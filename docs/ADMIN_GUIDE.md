# Alfa Elevator Admin Guide

## Accessing the Admin Portal

1. Navigate to `/login`
2. Sign in with your admin credentials or Google OAuth
3. You will be redirected to `/admin` dashboard

## Role Permissions

### Super Admin
- All admin features
- User management (`/admin/users`)
- Site settings (`/admin/settings`)

### Admin
- Products, services, projects, blog, testimonials, clients, process steps

### HR
- Job openings (`/admin/careers`)
- Applications (`/admin/applications`)

### Sales
- Quote inquiries (`/admin/quotes`)
- Contact inquiries (`/admin/contacts`)

### Editor
- Blog management (`/admin/blog`)

## Managing Content

### Products
Add/edit products with images, specifications, features, and SEO fields. Images upload to Supabase Storage `products` bucket.

### Blog
Use the TipTap rich text editor. Save drafts or publish articles. Cover images upload to `blogs` bucket.

### Quote Inquiries
View incoming quote requests in real-time. Update status, add sales notes, export to CSV.

### Site Settings
Configure company info, social links, homepage hero content, stats, and SEO defaults.

## Storage Buckets

| Bucket | Access | Purpose |
|--------|--------|---------|
| products | Public read | Product images |
| projects | Public read | Project photos |
| blogs | Public read | Blog covers & content images |
| testimonials | Public read | Client photos |
| clients | Public read | Client logos |
| company-assets | Public read | OG images, brand assets |
| resumes | Private (HR only) | Job application resumes |

## Support

Contact: info@alfaelevator.in
