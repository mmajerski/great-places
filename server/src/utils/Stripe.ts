import stripe from "stripe";

const client = new stripe(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: "2020-08-27"
});

export const Stripe = {
  connect: async (code: string) => {
    const response = await client.oauth.token({
      grant_type: "authorization_code",
      code
    });

    return response;
  },
  charge: async (amount: number, source: string, stripeAccount: string) => {
    const res = await client.charges.create(
      {
        amount,
        currency: "usd",
        source,
        application_fee_amount: Math.round(amount * 0.1)
      },
      {
        stripeAccount
      }
    );

    if (res.status !== "succeeded") {
      throw new Error("Failed to create charge with Stripe");
    }
  }
};
