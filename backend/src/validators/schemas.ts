import { z } from 'zod';

// ── Auth Schemas ──────────────────────────────────────────────────────────────
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('A valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('A valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

// ── Order Schemas ─────────────────────────────────────────────────────────────
export const shippingAddressSchema = z.object({
  name: z.string().min(2, 'Name is required').max(200),
  phone: z.string().min(7, 'Valid phone number required').max(20),
  street: z.string().min(5, 'Street address is required').max(500),
  city: z.string().min(2, 'City is required').max(100),
  province: z.string().min(2, 'Province is required').max(100),
  postal_code: z.string().optional(),
});

export const createOrderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(['COD', 'CARD']).default('COD'),
  notes: z.string().max(1000).optional(),
  discountCode: z.string().max(50).optional().nullable(),
  guestInfo: z.object({
    email: z.string().email('Valid guest email required'),
    name: z.string().min(2).max(200),
    phone: z.string().min(7).max(20),
  }).optional(),
});

// ── Cart Schemas ──────────────────────────────────────────────────────────────
export const cartItemSchema = z.object({
  variant_id: z.number().int().positive().optional(),
  bundle_id: z.number().int().positive().optional(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(99, 'Maximum quantity is 99'),
});

// ── Admin Auth Schemas ────────────────────────────────────────────────────────
export const adminLoginSchema = z.object({
  email: z.string().email('A valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

// ── Product Validation (existing) ─────────────────────────────────────────────
export const createProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  brand: z.string().min(1, "Brand is required"),
  description: z.string().optional(),
  category_id: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val), "Category ID must be a number"),
  is_active: z.enum(['true', 'false']).optional(),
  is_featured: z.enum(['true', 'false']).optional(),
  is_best_seller: z.enum(['true', 'false']).optional(),
  variants_json: z.string().optional()
});

export const updateProductSchema = createProductSchema.extend({
  is_new_arrival: z.enum(['true', 'false']).optional(),
  fragrance_type: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'UNISEX']).optional(),
}).partial();

// ── Category Validation (existing) ───────────────────────────────────────────
export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  meta_title: z.string().optional(),
  meta_desc: z.string().optional(),
  is_active: z.boolean().optional(),
});

// ── Ad Validation (existing) ──────────────────────────────────────────────────
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
