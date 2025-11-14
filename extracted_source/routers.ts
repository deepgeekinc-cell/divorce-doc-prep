  }),

  payment: router({
    createCheckoutSession: protectedProcedure
      .input(z.object({ tier: z.enum(["complete", "premium"]) }))
      .mutation(async ({ input, ctx }) => {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
        
        const product = input.tier === "complete" ? PRODUCTS.COMPLETE : PRODUCTS.PREMIUM;
        
        const session = await stripe.checkout.sessions.create({
          mode: "payment",
          payment_method_types: ["card"],
          line_items: [
            {
              price: product.priceId,
              quantity: 1,
            },
          ],
          success_url: `${ctx.req.protocol}://${ctx.req.get("host")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${ctx.req.protocol}://${ctx.req.get("host")}/pricing`,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            tier: input.tier,
            userId: ctx.user.id.toString(),
          },
        });
        
        return { url: session.url };
      }),
    createCheckout_OLD: protectedProcedure
      .input(z.object({
        tier: z.enum(["basic", "complete", "premium"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

        const { PRODUCTS } = await import("./products");
        const product = input.tier === "complete" ? PRODUCTS.COMPLETE : PRODUCTS.PREMIUM;

        const session = await stripe.checkout.sessions.create({
          mode: "payment",
          payment_method_types: ["card"],
          line_items: [
            {
              price: product.priceId,
              quantity: 1,
            },
          ],
          success_url: `${ctx.req.headers.origin}/dashboard?payment=success`,
          cancel_url: `${ctx.req.headers.origin}/pricing?payment=cancelled`,
          client_reference_id: ctx.user.id.toString(),
          customer_email: ctx.user.email || undefined,
          metadata: {
            user_id: ctx.user.id.toString(),
            tier: input.tier,
            customer_email: ctx.user.email || "",
            customer_name: ctx.user.name || "",
          },