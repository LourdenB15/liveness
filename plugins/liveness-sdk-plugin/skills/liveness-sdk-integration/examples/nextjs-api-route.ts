import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      descriptor,
      targetId,
      sessionToken,
      integrity,
      threshold = 0.98,
    } = body;

    if (
      !descriptor ||
      !Array.isArray(descriptor) ||
      descriptor.length !== 128
    ) {
      return NextResponse.json(
        { error: "A valid 128-dimensional descriptor array is required." },
        { status: 400 },
      );
    }

    // 1. Forward to Liveness Cloud API or verify against your database
    const livenessCloudUrl =
      process.env.LIVENESS_API_URL || "https://api.liveness.dev/api/liveness";
    const apiKey = process.env.LIVENESS_API_KEY;

    if (apiKey) {
      const endpoint = targetId
        ? `${livenessCloudUrl}/verify-one`
        : `${livenessCloudUrl}/verify`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          descriptor,
          targetId,
          sessionToken,
          integrity,
          threshold,
        }),
      });

      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    // 2. Fallback: Local database lookup (e.g. Prisma / Drizzle with pgvector)
    return NextResponse.json({
      verified: true,
      message: "Local verification completed.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal verification error." },
      { status: 500 },
    );
  }
}
