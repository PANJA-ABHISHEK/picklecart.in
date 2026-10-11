import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getStoreSettings, updateStoreSettings } from "@/services/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getStoreSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("API GET /api/settings error:", error);
    return NextResponse.json(
      {
        success: false,
        settings: {
          announcement: {
            enabled: true,
            text: "🚚 Free delivery above ₹1,500 — India delivery addresses only",
            bgColor: "bg-[#B84A32]",
            textColor: "text-white",
          },
          shipping: {
            defaultFee: 99,
            freeThreshold: 1500,
          },
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await updateStoreSettings(body);
    revalidatePath("/", "layout");
    return NextResponse.json(result);
  } catch (error) {
    console.error("API POST /api/settings error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
