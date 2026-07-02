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
    const { name, brand, description, category_id, is_active, is_featured, is_best_seller, variants_json, gender, fragrance_type, notes_json } = req.body;
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
        ...(gender && { gender }),
        ...(fragrance_type && { fragrance_type }),
        images: {
          create: uploadedImages.map((url, index) => ({
            image_url: url,
            sort_order: index
          }))
        }
      }
    });

    if (variants_json) {
      let variants: any[];
      try {
        variants = JSON.parse(variants_json);
      } catch {
        res.status(400).json({ success: false, message: 'Invalid variants format' });
        return;
      }
      if (!Array.isArray(variants) || variants.length === 0) {
        res.status(400).json({ success: false, message: 'At least one variant is required' });
        return;
      }
      for (const v of variants) {
        if (!v.size_ml || v.price === undefined || v.stock_quantity === undefined) {
          res.status(400).json({ success: false, message: 'Each variant must have size_ml, price, and stock_quantity' });
          return;
        }
        if (isNaN(Number(v.price)) || Number(v.price) <= 0) {
          res.status(400).json({ success: false, message: 'Variant price must be a positive number' });
          return;
        }
        if (isNaN(Number(v.stock_quantity)) || Number(v.stock_quantity) < 0) {
          res.status(400).json({ success: false, message: 'Variant stock quantity must be 0 or more' });
          return;
        }
      }
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

    if (notes_json) {
      const notes = JSON.parse(notes_json);
      for (const note of notes) {
        await prisma.fragranceNote.create({
          data: { product_id: product.id, note_type: note.note_type, note_name: note.note_name }
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
      prisma.product.count(),
      prisma.product.findMany({
        where: {},
        include: {
          category: true,
          variants: true,
          images: { take: 1, orderBy: { sort_order: 'asc' } },
          fragrance_notes: true,
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
      variants_json,
      notes_json
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
            deleteMany: {},
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
      let variants: any[];
      try {
        variants = JSON.parse(variants_json);
      } catch {
        res.status(400).json({ success: false, message: 'Invalid variants format' });
        return;
      }
      if (!Array.isArray(variants) || variants.length === 0) {
        res.status(400).json({ success: false, message: 'At least one variant is required' });
        return;
      }
      for (const v of variants) {
        if (!v.size_ml || v.price === undefined || v.stock_quantity === undefined) {
          res.status(400).json({ success: false, message: 'Each variant must have size_ml, price, and stock_quantity' });
          return;
        }
        if (isNaN(Number(v.price)) || Number(v.price) <= 0) {
          res.status(400).json({ success: false, message: 'Variant price must be a positive number' });
          return;
        }
        if (isNaN(Number(v.stock_quantity)) || Number(v.stock_quantity) < 0) {
          res.status(400).json({ success: false, message: 'Variant stock quantity must be 0 or more' });
          return;
        }
      }
      for (const v of variants) {
        if (v.id) {
          // Update existing variant — include product_id to prevent cross-product mutation
          await prisma.productVariant.update({
            where: { id: v.id, product_id: product.id },
            data: {
              size_ml: v.size_ml,
              price: v.price,
              discount_price: v.discount_price || null,
              stock_quantity: v.stock_quantity,
              is_active: v.is_active !== undefined ? Boolean(v.is_active) : true,
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

    if (notes_json) {
      const notes = JSON.parse(notes_json);
      await prisma.fragranceNote.deleteMany({ where: { product_id: product.id } });
      for (const note of notes) {
        await prisma.fragranceNote.create({
          data: { product_id: product.id, note_type: note.note_type, note_name: note.note_name }
        });
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

    // Check if any order items reference this product's variants
    const variants = await prisma.productVariant.findMany({
      where: { product_id: parseInt(id) },
      select: { id: true }
    })
    const variantIds = variants.map(v => v.id)

    const orderedCount = variantIds.length > 0
      ? await prisma.orderItem.count({ where: { variant_id: { in: variantIds } } })
      : 0

    if (orderedCount > 0) {
      // Has order history — soft delete to preserve records
      await prisma.product.update({
        where: { id: parseInt(id) },
        data: { is_active: false }
      })
      await revalidateFrontend('products')
      await logAdminAction((req as any).admin.id, 'DELETE_PRODUCT', 'Product', existing.id, existing, { is_active: false });
      res.json({ success: true, message: 'Product deactivated (has existing orders — hidden from store)' })
    } else {
      // No orders — permanently delete (cascades to variants, images, notes)
      await prisma.product.delete({ where: { id: parseInt(id) } })
      await revalidateFrontend('products')
      await logAdminAction((req as any).admin.id, 'DELETE_PRODUCT', 'Product', existing.id, existing, null);
      res.json({ success: true, message: 'Product permanently deleted' })
    }
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

    // Find all variant IDs for these products and check order references
    const variants = await prisma.productVariant.findMany({
      where: { product_id: { in: intIds } },
      select: { id: true, product_id: true }
    });
    const variantIds = variants.map(v => v.id);

    const orderedVariantIds = variantIds.length > 0
      ? (await prisma.orderItem.findMany({
          where: { variant_id: { in: variantIds } },
          select: { variant_id: true },
          distinct: ['variant_id']
        })).map(oi => oi.variant_id as number)
      : [];

    const orderedProductIds = new Set(
      variants.filter(v => orderedVariantIds.includes(v.id)).map(v => v.product_id)
    );

    const toDeactivate = intIds.filter(id => orderedProductIds.has(id));
    const toDelete = intIds.filter(id => !orderedProductIds.has(id));

    if (toDeactivate.length > 0) {
      await prisma.product.updateMany({
        where: { id: { in: toDeactivate } },
        data: { is_active: false }
      });
    }
    if (toDelete.length > 0) {
      await prisma.product.deleteMany({ where: { id: { in: toDelete } } });
    }

    await revalidateFrontend('products');
    await logAdminAction((req as any).admin.id, 'BULK_DELETE_PRODUCTS', 'Product', 0, null, { deleted: toDelete, deactivated: toDeactivate });

    const msg = toDeactivate.length > 0 && toDelete.length > 0
      ? `${toDelete.length} deleted, ${toDeactivate.length} deactivated (have existing orders)`
      : toDeactivate.length > 0
        ? `${toDeactivate.length} product(s) deactivated (have existing orders)`
        : `${toDelete.length} product(s) permanently deleted`;

    res.json({ success: true, message: msg });
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
