import { Resend } from 'resend';
import { ENV } from '../config/env';

const resend = new Resend(ENV.RESEND_API_KEY);

const FROM_SALES = 'Auriq Fragrances <sales@auriqfragrances.com>';
const FROM_SUPPORT = 'Auriq Support <support@auriqfragrances.com>';
const FROM_MARKETING = 'Auriq Fragrances <marketing@auriqfragrances.com>';
const FROM_BILLING = 'Auriq Fragrances <billing@auriqfragrances.com>';

import nodemailer from 'nodemailer';

// OTP Verification Email
export const sendOTPEmail = async (email: string, otp: string) => {
  console.log(`[DEV ONLY] Attempting to send OTP to ${email}: ${otp}`);
  
  const htmlContent = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#f5f0e8;">
      <div style="background:#1a1a1a;padding:40px;text-align:center;border-bottom:2px solid #d4af37;">
        <h1 style="color:#d4af37;font-size:28px;letter-spacing:4px;margin:0;">AURIQ</h1>
      </div>
      <div style="padding:40px;text-align:center;">
        <h2 style="color:#d4af37;font-size:20px;letter-spacing:2px;">VERIFY YOUR EMAIL</h2>
        <p style="color:#ccc;">Use the code below to verify your email address and complete your registration.</p>
        <div style="background:#1a1a1a;padding:24px;margin:32px auto;border:1px solid #333;width:fit-content;">
          <p style="color:#d4af37;font-size:32px;letter-spacing:8px;font-weight:bold;margin:0;">${otp}</p>
        </div>
        <p style="color:#888;font-size:12px;">If you didn't request this code, you can safely ignore this email.</p>
      </div>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_SUPPORT,
      to: email,
      subject: 'Your Auriq Verification Code',
      html: htmlContent
    });

    if (error) {
      throw new Error(error.message);
    }
  } catch (error: any) {
    console.error('RESEND OTP ERROR:', error.message || error);
    console.log('Falling back to Nodemailer (Ethereal) for development testing...');
    
    try {
      const testAccount = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      const info = await transporter.sendMail({
        from: '"Auriq Support" <support@auriqfragrances.com>',
        to: email,
        subject: 'Your Auriq Verification Code',
        html: htmlContent,
      });

      console.log("Fallback email sent! Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (fallbackError) {
      console.error('Nodemailer fallback failed:', fallbackError);
    }
  }
};

// Order Confirmation Email
export const sendOrderConfirmation = async (order: any, email: string, name: string) => {
  const itemsList = order.items?.map((item: any) =>
    `<tr>
      <td style="padding:8px;border-bottom:1px solid #f0e9dc;">${item.item_name} ${item.size_ml ? `(${item.size_ml}ml)` : ''}</td>
      <td style="padding:8px;border-bottom:1px solid #f0e9dc;text-align:center;">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #f0e9dc;text-align:right;">Rs. ${Number(item.unit_price).toLocaleString()}</td>
    </tr>`
  ).join('') || '';

  const { data, error } = await resend.emails.send({
    from: FROM_SALES,
    to: email,
    subject: `Order Confirmed — #AUR-${order.id} | Auriq Fragrances`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#f5f0e8;">
        <div style="background:#1a1a1a;padding:40px;text-align:center;border-bottom:2px solid #d4af37;">
          <h1 style="color:#d4af37;font-size:28px;letter-spacing:4px;margin:0;">AURIQ</h1>
          <p style="color:#888;font-size:11px;letter-spacing:3px;margin:8px 0 0;">LUXURY FRAGRANCES</p>
        </div>
        
        <div style="padding:40px;">
          <h2 style="color:#d4af37;font-size:20px;letter-spacing:2px;">ORDER CONFIRMED</h2>
          <p style="color:#ccc;">Dear ${name},</p>
          <p style="color:#ccc;">Thank you for your order. We have received your purchase and it is being processed.</p>
          
          <div style="background:#1a1a1a;padding:20px;margin:24px 0;border:1px solid #333;">
            <p style="color:#888;font-size:12px;letter-spacing:2px;margin:0 0 4px;">ORDER NUMBER</p>
            <p style="color:#d4af37;font-size:20px;font-weight:bold;margin:0;">#AUR-${order.id}</p>
          </div>

          <table style="width:100%;border-collapse:collapse;margin:24px 0;">
            <thead>
              <tr style="background:#1a1a1a;">
                <th style="padding:10px 8px;text-align:left;color:#888;font-size:11px;letter-spacing:2px;">ITEM</th>
                <th style="padding:10px 8px;text-align:center;color:#888;font-size:11px;letter-spacing:2px;">QTY</th>
                <th style="padding:10px 8px;text-align:right;color:#888;font-size:11px;letter-spacing:2px;">PRICE</th>
              </tr>
            </thead>
            <tbody style="color:#ccc;">
              ${itemsList}
            </tbody>
          </table>

          <div style="border-top:1px solid #333;padding-top:16px;">
            <div style="display:flex;justify-content:space-between;margin:8px 0;">
              <span style="color:#888;">Shipping</span>
              <span style="color:#ccc;">Rs. ${Number(order.shipping_fee).toLocaleString()}</span>
            </div>
            ${order.discount_amount > 0 ? `<div style="display:flex;justify-content:space-between;margin:8px 0;">
              <span style="color:#888;">Discount</span>
              <span style="color:#4ade80;">-Rs. ${Number(order.discount_amount).toLocaleString()}</span>
            </div>` : ''}
            <div style="display:flex;justify-content:space-between;margin:16px 0;padding-top:12px;border-top:1px solid #d4af37;">
              <span style="color:#d4af37;font-size:16px;letter-spacing:2px;">TOTAL</span>
              <span style="color:#d4af37;font-size:18px;font-weight:bold;">Rs. ${Number(order.total).toLocaleString()}</span>
            </div>
          </div>

          <div style="background:#1a1a1a;padding:20px;margin:24px 0;border:1px solid #333;">
            <p style="color:#888;font-size:11px;letter-spacing:2px;margin:0 0 8px;">DELIVERY ADDRESS</p>
            <p style="color:#ccc;margin:0;">${order.shipping_name}<br>${order.shipping_street}<br>${order.shipping_city}, ${order.shipping_province}</p>
          </div>

          <p style="color:#888;font-size:13px;">Payment Method: <span style="color:#ccc;">${order.payment_method}</span></p>
          
          <div style="text-align:center;margin:32px 0;">
            <a href="${ENV.FRONTEND_URL}/invoice/${order.id}" style="background:#d4af37;color:#0a0a0a;padding:14px 32px;text-decoration:none;font-size:12px;letter-spacing:3px;font-weight:bold;">VIEW INVOICE</a>
          </div>
        </div>

        <div style="background:#1a1a1a;padding:24px;text-align:center;border-top:1px solid #333;">
          <p style="color:#888;font-size:12px;margin:0;">Questions? Contact us at <a href="mailto:support@auriqfragrances.com" style="color:#d4af37;">support@auriqfragrances.com</a></p>
          <p style="color:#555;font-size:11px;margin:8px 0 0;">© 2026 Auriq Fragrances. All rights reserved.</p>
        </div>
      </div>
    `
  });

  if (error) {
    console.error('RESEND ORDER CONFIRM ERROR:', error);
    throw new Error(error.message);
  }
};

// Order Status Update Email
export const sendOrderStatusUpdate = async (order: any, email: string, name: string, newStatus: string) => {
  // No email for PENDING status
  if (newStatus === 'PENDING') return;

  const statusMessages: Record<string, string> = {
    CONFIRMED: 'Your order has been confirmed and is being prepared.',
    PROCESSING: 'Your order is currently being processed.',
    WAREHOUSE: 'Your order is at our warehouse and being packed.',
    SHIPPED: 'Great news! Your order has been shipped and is on its way.',
    DELIVERED: 'Your order has been delivered. We hope you love your fragrance!',
    CANCELLED: 'Your order has been cancelled. If you have questions, please contact us.'
  };

  const message = statusMessages[newStatus] || `Your order status has been updated to ${newStatus}.`;

  // CONFIRMED uses sales@ with full invoice, all other statuses use support@
  const fromAddress = newStatus === 'CONFIRMED' ? FROM_SALES : FROM_SUPPORT;
  const subjectLine = newStatus === 'CONFIRMED'
    ? `Order Confirmed — #AUR-${order.id} | Auriq Fragrances`
    : `Order Update — #AUR-${order.id} is ${newStatus} | Auriq Fragrances`;

  const itemsHtml = order.items && order.items.length > 0 ? `
    <table style="width:100%;border-collapse:collapse;margin:24px 0;">
      <tr style="border-bottom:1px solid #333;">
        <th style="color:#888;font-size:10px;letter-spacing:2px;text-align:left;padding:8px 0;">ITEM</th>
        <th style="color:#888;font-size:10px;letter-spacing:2px;text-align:center;padding:8px 0;">QTY</th>
        <th style="color:#888;font-size:10px;letter-spacing:2px;text-align:right;padding:8px 0;">PRICE</th>
      </tr>
      ${order.items.map((item: any) => `
      <tr style="border-bottom:1px solid #1a1a1a;">
        <td style="color:#ccc;padding:12px 0;font-size:13px;">${item.item_name}</td>
        <td style="color:#ccc;padding:12px 0;font-size:13px;text-align:center;">${item.quantity}</td>
        <td style="color:#ccc;padding:12px 0;font-size:13px;text-align:right;">Rs. ${Number(item.total_price).toLocaleString()}</td>
      </tr>
      `).join('')}
      <tr>
        <td colspan="2" style="color:#888;padding:12px 0;font-size:12px;">Shipping</td>
        <td style="color:#ccc;padding:12px 0;font-size:13px;text-align:right;">Rs. ${Number(order.shipping_fee || 0).toLocaleString()}</td>
      </tr>
      ${order.discount_amount && Number(order.discount_amount) > 0 ? `
      <tr>
        <td colspan="2" style="color:#888;padding:12px 0;font-size:12px;">Discount</td>
        <td style="color:#d4af37;padding:12px 0;font-size:13px;text-align:right;">- Rs. ${Number(order.discount_amount).toLocaleString()}</td>
      </tr>` : ''}
      <tr style="border-top:1px solid #d4af37;">
        <td colspan="2" style="color:#d4af37;padding:12px 0;font-size:14px;font-weight:bold;letter-spacing:1px;">TOTAL</td>
        <td style="color:#d4af37;padding:12px 0;font-size:16px;font-weight:bold;text-align:right;">Rs. ${Number(order.total || 0).toLocaleString()}</td>
      </tr>
    </table>` : '';

  const addressHtml = newStatus === 'CONFIRMED' && order.shipping_name ? `
    <div style="background:#1a1a1a;padding:20px;margin:24px 0;border-left:3px solid #d4af37;">
      <p style="color:#888;font-size:10px;letter-spacing:2px;margin:0 0 8px;">DELIVERY ADDRESS</p>
      <p style="color:#ccc;margin:0;font-size:13px;line-height:1.6;">
        ${order.shipping_name}<br/>
        ${order.shipping_street}<br/>
        ${order.shipping_city}, ${order.shipping_province}<br/>
        ${order.shipping_postal || ''}
      </p>
      <p style="color:#888;font-size:12px;margin:8px 0 0;">Payment Method: ${order.payment_method}</p>
    </div>` : '';

  const { data, error } = await resend.emails.send({
    from: fromAddress,
    to: email,
    subject: subjectLine,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#f5f0e8;">
        <div style="background:#1a1a1a;padding:40px;text-align:center;border-bottom:2px solid #d4af37;">
          <h1 style="color:#d4af37;font-size:28px;letter-spacing:4px;margin:0;">AURIQ</h1>
          <p style="color:#888;font-size:11px;letter-spacing:3px;margin:8px 0 0;">LUXURY FRAGRANCES</p>
        </div>
        <div style="padding:40px;">
          <h2 style="color:#d4af37;font-size:20px;letter-spacing:2px;">${newStatus === 'CONFIRMED' ? 'ORDER CONFIRMED' : 'ORDER UPDATE'}</h2>
          <p style="color:#ccc;">Dear ${name},</p>
          <p style="color:#ccc;">${message}</p>
          ${itemsHtml}
          ${addressHtml}
          <div style="background:#1a1a1a;padding:20px;margin:24px 0;border:1px solid #d4af37;text-align:center;">
            <p style="color:#888;font-size:11px;letter-spacing:2px;margin:0 0 4px;">ORDER #AUR-${order.id}</p>
            <p style="color:#d4af37;font-size:22px;font-weight:bold;letter-spacing:3px;margin:0;">${newStatus}</p>
          </div>
          <div style="text-align:center;margin:32px 0;">
            ${order.user_id ? `<a href="${ENV.FRONTEND_URL}/account?tab=orders" style="background:#d4af37;color:#0a0a0a;padding:14px 32px;text-decoration:none;font-size:12px;letter-spacing:3px;font-weight:bold;">VIEW MY ORDERS</a>` : `<p style="color:#888;font-size:12px;text-align:center;margin:0;">Your order updates will be sent to this email address.</p>`}
          </div>
        </div>
        <div style="background:#1a1a1a;padding:24px;text-align:center;border-top:1px solid #333;">
          <p style="color:#888;font-size:12px;margin:0;">Need help? <a href="mailto:support@auriqfragrances.com" style="color:#d4af37;">support@auriqfragrances.com</a></p>
          <p style="color:#555;font-size:11px;margin:8px 0 0;">© 2026 Auriq Fragrances. All rights reserved.</p>
        </div>
      </div>
    `
  });

  if (error) {
    console.error('RESEND STATUS UPDATE ERROR:', error);
    throw new Error(error.message);
  }
};

// Welcome Email
export const sendWelcomeEmail = async (email: string, name: string) => {
  const { data, error } = await resend.emails.send({
    from: FROM_MARKETING,
    to: email,
    subject: 'Welcome to Auriq Fragrances ✨',
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#f5f0e8;">
        <div style="background:#1a1a1a;padding:40px;text-align:center;border-bottom:2px solid #d4af37;">
          <h1 style="color:#d4af37;font-size:28px;letter-spacing:4px;margin:0;">AURIQ</h1>
          <p style="color:#888;font-size:11px;letter-spacing:3px;margin:8px 0 0;">LUXURY FRAGRANCES</p>
        </div>
        <div style="padding:40px;text-align:center;">
          <h2 style="color:#d4af37;font-size:22px;letter-spacing:2px;">WELCOME, ${name.toUpperCase()}</h2>
          <p style="color:#ccc;line-height:1.8;">You have joined an exclusive world of luxury fragrances. Each Auriq scent is crafted with the finest ingredients to create timeless memories.</p>
          <div style="margin:32px 0;">
            <a href="${ENV.FRONTEND_URL}/collections" style="background:#d4af37;color:#0a0a0a;padding:14px 32px;text-decoration:none;font-size:12px;letter-spacing:3px;font-weight:bold;">EXPLORE COLLECTIONS</a>
          </div>
          <p style="color:#888;font-size:13px;">Use code <span style="color:#d4af37;font-weight:bold;">WELCOME10</span> for 10% off your first order.</p>
        </div>
        <div style="background:#1a1a1a;padding:24px;text-align:center;border-top:1px solid #333;">
          <p style="color:#555;font-size:11px;margin:0;">© 2026 Auriq Fragrances. All rights reserved.</p>
        </div>
      </div>
    `
  });

  if (error) {
    console.error('RESEND WELCOME ERROR:', error);
    throw new Error(error.message);
  }
};

// Newsletter Confirmation Email
export const sendNewsletterConfirmation = async (email: string) => {
  const { data, error } = await resend.emails.send({
    from: FROM_MARKETING,
    to: email,
    subject: 'You are now subscribed to Auriq Fragrances',
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#f5f0e8;">
        <div style="background:#1a1a1a;padding:40px;text-align:center;border-bottom:2px solid #d4af37;">
          <h1 style="color:#d4af37;font-size:28px;letter-spacing:4px;margin:0;">AURIQ</h1>
        </div>
        <div style="padding:40px;text-align:center;">
          <h2 style="color:#d4af37;">YOU ARE SUBSCRIBED</h2>
          <p style="color:#ccc;">Thank you for subscribing to Auriq Fragrances. You will be the first to know about new collections, exclusive offers, and special events.</p>
          <p style="color:#888;font-size:13px;">Use code <span style="color:#d4af37;font-weight:bold;">WELCOME10</span> for 10% off your first order.</p>
          <div style="margin:32px 0;">
            <a href="${ENV.FRONTEND_URL}/collections" style="background:#d4af37;color:#0a0a0a;padding:14px 32px;text-decoration:none;font-size:12px;letter-spacing:3px;font-weight:bold;">SHOP NOW</a>
          </div>
        </div>
        <div style="background:#1a1a1a;padding:24px;text-align:center;border-top:1px solid #333;">
          <p style="color:#555;font-size:11px;margin:0;">© 2026 Auriq Fragrances. All rights reserved.</p>
        </div>
      </div>
    `
  });

  if (error) {
    console.error('RESEND NEWSLETTER ERROR:', error);
    throw new Error(error.message);
  }
};

// Contact Form Reply — notify admin
export const sendContactNotification = async (contactData: { name: string; email: string; subject?: string; message: string }) => {
  const { data, error } = await resend.emails.send({
    from: FROM_SUPPORT,
    to: 'support@auriqfragrances.com',
    subject: `New Contact Message from ${contactData.name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${contactData.name} (${contactData.email})</p>
        <p><strong>Subject:</strong> ${contactData.subject || 'No subject'}</p>
        <p><strong>Message:</strong></p>
        <div style="background:#f5f5f5;padding:16px;border-left:4px solid #d4af37;">
          ${contactData.message}
        </div>
        <p>Reply directly to: <a href="mailto:${contactData.email}">${contactData.email}</a></p>
      </div>
    `,
    replyTo: contactData.email
  });

  if (error) {
    console.error('RESEND CONTACT NOTIFICATION ERROR:', error);
    throw new Error(error.message);
  }
};
