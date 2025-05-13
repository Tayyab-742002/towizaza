# Setting Up Stripe Webhooks

This document explains how to set up and test Stripe webhooks in your Next.js 15 application.

## Prerequisites

1. A Stripe account (you can sign up for free at [stripe.com](https://stripe.com))
2. The Stripe CLI installed locally ([Installation Guide](https://stripe.com/docs/stripe-cli))
3. Next.js 15 application

## Environment Setup

1. Create a `.env.local` file in your project root with the following variables:

```
STRIPE_SECRET_KEY=sk_test_your_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

2. Get your API keys from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys)

## Testing Webhooks Locally

1. Open a terminal and login to your Stripe account:

```bash
stripe login
```

2. Start the webhook listener to forward Stripe events to your local server:

```bash
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
```

3. The CLI will output a webhook signing secret. Copy this value and add it to your `.env.local` file as `STRIPE_WEBHOOK_SECRET`.

4. In another terminal, you can trigger test webhook events:

```bash
# Test a successful payment
stripe trigger payment_intent.succeeded

# Test a failed payment
stripe trigger payment_intent.payment_failed

# Test a completed checkout session
stripe trigger checkout.session.completed
```

## Webhook Events

Our webhook handler is configured to process the following events:

- `payment_intent.succeeded`: When a payment is successful
- `payment_intent.payment_failed`: When a payment fails
- `checkout.session.completed`: When a checkout session is completed

For each event, we extract the order ID from the metadata and update the order status accordingly.

## Production Deployment

When deploying to production:

1. Go to the [Stripe Dashboard Webhooks section](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your production webhook URL (e.g., `https://your-domain.com/api/webhooks/stripe`)
4. Select the events you want to listen for (`payment_intent.succeeded`, `payment_intent.payment_failed`, `checkout.session.completed`)
5. Get the webhook signing secret and add it to your production environment variables

## Security Considerations

- Always verify the webhook signature to ensure requests are coming from Stripe
- Store your Stripe secret key and webhook secret securely
- Use environment variables and never commit secrets to version control
- Implement idempotency to prevent duplicate processing of events

## Troubleshooting

If you encounter issues with your webhooks:

1. Check the Stripe CLI logs for any errors
2. Verify your webhook endpoint is accessible
3. Confirm your webhook secret is correctly set
4. Check your application logs for processing errors
5. Use the Stripe Dashboard to view webhook delivery attempts and any failures

## Additional Resources

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Next.js API Routes Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
