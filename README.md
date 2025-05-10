# Towizaza Official Website

This is the official website for Towizaza, a music artist platform featuring music streaming, merchandise store, and artist content.

## Tech Stack

- **Frontend**: Next.js 15+, React, TypeScript, Tailwind CSS
- **CMS**: Sanity.io
- **Payments**: Stripe
- **Styling**: Tailwind CSS, Framer Motion


## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- A Sanity.io account
- A Stripe account




## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token
SANITY_PREVIEW_SECRET=your_preview_secret

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# Change to your production URL for production environments

# Optional - Email (for order confirmations)
EMAIL_SERVER_USER=your_email_user
EMAIL_SERVER_PASSWORD=your_email_password
EMAIL_SERVER_HOST=your_email_host
EMAIL_SERVER_PORT=587
EMAIL_FROM=your_from_email
```



### Sanity Studio

The Sanity Studio is integrated into the Next.js application and can be accessed at `/studio` route.

To deploy the Sanity Studio:


