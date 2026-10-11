import { NextResponse } from "next/server";
import { getActivePromoCodes, validatePromoCode } from "@/services/promocodes";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const coupons = await getActivePromoCodes();
    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    console.error("API GET /api/promocodes error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch coupons", coupons: [] },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { code, cartTotal } = body || {};

    if (!code) {
      return NextResponse.json(
        { valid: false, error: "Promo code is required" },
        { status: 400 }
      );
    }

    const result = await validatePromoCode(code, Number(cartTotal) || 0);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API POST /api/promocodes error:", error);
    return NextResponse.json(
      { valid: false, error: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}
