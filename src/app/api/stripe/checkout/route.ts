import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, PLANS, type PlanKey } from "@/lib/stripe";
import { getURL } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan, interval } = (await request.json()) as {
      plan: PlanKey;
      interval: "monthly" | "annual";
    };

    if (!plan || !interval || plan === "free") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const planConfig = PLANS[plan];
    if (!("stripePriceId" in planConfig)) {
      return NextResponse.json({ error: "Plan not available" }, { status: 400 });
    }

    const priceId = planConfig.stripePriceId[interval];
    if (!priceId) {
      return NextResponse.json(
        { error: "Price not configured" },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${getURL()}/dashboard?checkout=success`,
      cancel_url: `${getURL()}/settings?checkout=cancelled`,
      metadata: {
        supabase_user_id: user.id,
        plan,
        interval,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
