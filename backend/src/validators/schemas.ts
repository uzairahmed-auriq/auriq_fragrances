import { z } from 'zod';

// Product Validation
export const createProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  brand: z.string().min(1, "Brand is required"),
  description: z.string().optional(),
  category_id: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val), "Category ID must be a number"),
  is_active: z.enum(['true', 'false']).optional(),
  is_featured: z.enum(['true', 'false']).optional(),
  is_best_seller: z.enum(['true', 'false']).optional(),
  variants_json: z.string().optional() // Can be further validated as JSON if needed
});

export const updateProductSchema = createProductSchema.extend({
  is_new_arrival: z.enum(['true', 'false']).optional(),
  fragrance_type: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'UNISEX']).optional(),
}).partial();

// Category Validation
export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  meta_title: z.string().optional(),
  meta_desc: z.string().optional(),
  is_active: z.boolean().optional(),
});

// Ad Validation
export const adSchema = z.object({
  title: z.string().min(2, "Title is required"),
  link_url: z.string().url().optional().or(z.literal('')),
  position: z.enum(['HERO', 'ANNOUNCEMENT_BAR']),
  is_active: z.enum(['true', 'false']).optional(),
  button_text: z.string().optional(),
  sort_order: z.string().optional(),
  starts_at: z.string().optional(),
  ends_at: z.string().optional(),
});
