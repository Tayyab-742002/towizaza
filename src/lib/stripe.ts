import "server-only";

import Stripe from "stripe";

// const apiVersion = process.env.STRIPE_API_VERSIOn! || "2025-04-30.basil";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export default stripe;
