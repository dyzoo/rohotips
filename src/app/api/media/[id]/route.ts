import { NextResponse } from "next/server";
import { findMedia } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const media = await findMedia(id);

  if (!media) return new NextResponse("Not found", { status: 404 });

  const bytes = Buffer.from(media.data, "base64");
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": media.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
