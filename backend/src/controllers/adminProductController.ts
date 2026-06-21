import { Request, Response } from 'express';
import prisma from '../config/database';
import { uploadToCloudinary } from '../utils/cloudinary';
import axios from 'axios';
import { ENV } from '../config/env';
import { logAdminAction } from '../utils/auditLog';

const revalidateFrontend = async (tag: string) => {
  try {
    // Attempt to revalidate frontend cache
    await axios.post(`${ENV.FRONTEND_URL}/api/revalidate`, {
      tag,
      secret: ENV.REVALIDATION_SECRET
    });
  } catch (error) {
    console.error('Failed to revalidate frontend cache:', error);
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, brand, description, category_id, is_active, is_featured, is_best_seller, variants_json } = req.body;
    const files = req.files as Express.Multer.File[];

    let uploadedImages: string[] = [];
    if (files && files.length > 0) {
      const uploadPromises = files.map(file => uploadToCloudinary(file.buffer, 'auriq_products'));
      const results = await Promise.all(uploadPromises);
      uploadedImages = results.map(res => res.secure_url);
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/ /g, '-'),
        brand,
        description,
        category_id: parseInt(category_id),
        is_active: is_active === 'true',
        is_featured: is_featured === 'true',
        is_best_seller: is_best_seller === 'true',
        images: {
          create: uploadedImages.map((url, index) => ({
            image_url: url,
            sort_order: index
          }))
        }
      }
    });

    if (variants_json) {
      const variants = JSON.parse(variants_json);
      for (const v of variants) {
         await prisma.productVariant.create({
           data: {
             product_id: product.id,
             size_ml: v.size_ml,
             price: v.price,
             stock_quantity: v.stock_quantity,
             sku: v.sku
           }
         });
      }
    }

    await revalidateFrontend('products');

    await logAdminAction((req as any).admin.id, 'CREATE_PRODUCT', 'Product', product.id, null, { name: product.name });

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('CREATE PRODUCT ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

    const [total, products] = await Promise.all([
      prisma.product.count({ where: { is_active: true } }),
      prisma.product.findMany({
        where: { is_active: true },
        include: {
          category: true,
          variants: true,
          images: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      })
    ]);

    res.json({ 
      success: true, 
      data: products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('ADMIN GET PRODUCTS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const {
      name,
      brand,
      description,
      category_id,
      is_active,
      is_featured,
      is_best_seller,
      is_new_arrival,
      fragrance_type,
      gender,
      variants_json
    } = req.body

    const files = req.files as Express.Multer.File[]

    // Check product exists
    const existing = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    })
    if (!existing) {
      res.status(404).json({ success: false, message: 'Product not found' })
      return
    }

    // Upload new images if provided
    let uploadedImages: string[] = []
    if (files && files.length > 0) {
      const uploadPromises = files.map(file => uploadToCloudinary(file.buffer, 'auriq_products'));
      const results = await Promise.all(uploadPromises);
      uploadedImages = results.map(res => res.secure_url);
    }

    // Update product
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name, slug: name.toLowerCase().replace(/ /g, '-') }),
        ...(brand && { brand }),
        ...(description && { description }),
        ...(category_id && { category_id: parseInt(category_id) }),
        ...(is_active !== undefined && { is_active: is_active === 'true' }),
        ...(is_featured !== undefined && { is_featured: is_featured === 'true' }),
        ...(is_best_seller !== undefined && { is_best_seller: is_best_seller === 'true' }),
        ...(is_new_arrival !== undefined && { is_new_arrival: is_new_arrival === 'true' }),
        ...(fragrance_type && { fragrance_type }),
        ...(gender && { gender }),
        ...(uploadedImages.length > 0 && {
          images: {
            create: uploadedImages.map((url, index) => ({
              image_url: url,
              sort_order: index
            }))
          }
        })
      }
    })

    // Update variants if provided
    if (variants_json) {
      const variants = JSON.parse(variants_json)
      for (const v of variants) {
        if (v.id) {
          // Update existing variant
          await prisma.productVariant.update({
            where: { id: v.id },
            data: {
              size_ml: v.size_ml,
              price: v.price,
              discount_price: v.discount_price || null,
              stock_quantity: v.stock_quantity,
            }
          })
        } else {
          // Create new variant
          await prisma.productVariant.create({
            data: {
              product_id: product.id,
              size_ml: v.size_ml,
              price: v.price,
              stock_quantity: v.stock_quantity,
              sku: v.sku
            }
          })
        }
      }
    }

    await revalidateFrontend('products')

    await logAdminAction((req as any).admin.id, 'UPDATE_PRODUCT', 'Product', product.id, existing, product);

    res.json({ success: true, data: product })
  } catch (error) {
    console.error('UPDATE PRODUCT ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string

    const existing = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    })
    if (!existing) {
      res.status(404).json({ success: false, message: 'Product not found' })
      return
    }

    // Soft delete — just set is_active to false
    await prisma.product.update({
      where: { id: parseInt(id) },
      data: { is_active: false }
    })

    await revalidateFrontend('products')

    await logAdminAction((req as any).admin.id, 'DELETE_PRODUCT', 'Product', existing.id, existing, { is_active: false });

    res.json({ success: true, message: 'Product deleted successfully' })
  } catch (error) {
    console.error('DELETE PRODUCT ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const bulkDeleteProducts = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ success: false, message: 'Invalid or missing product IDs' });
      return;
    }

    const intIds = ids.map(id => parseInt(id));

    // Soft delete all specified products
    await prisma.product.updateMany({
      where: { id: { in: intIds } },
      data: { is_active: false }
    });

    await revalidateFrontend('products');

    await logAdminAction((req as any).admin.id, 'BULK_DELETE_PRODUCTS', 'Product', 0, null, { deleted_ids: intIds, is_active: false });

    res.json({ success: true, message: 'Products deleted successfully' });
  } catch (error) {
    console.error('BULK DELETE PRODUCTS ERROR:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

export const deleteProductImage = async (req: Request, res: Response) => {
  try {
    const imageId = req.params.imageId as string

    await prisma.productImage.delete({
      where: { id: parseInt(imageId) }
    })

    res.json({ success: true, message: 'Image deleted' })
  } catch (error) {
    console.error('DELETE IMAGE ERROR:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}
