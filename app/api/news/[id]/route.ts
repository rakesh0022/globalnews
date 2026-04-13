import { NextRequest, NextResponse } from "next/server";
import { getArticleById } from "@/services/api/mockService";

/**
 * GET /api/news/:id
 *
 * NewsAPI free tier doesn't support fetching a single article by ID,
 * so we always resolve from the mock store (which is populated with
 * real-looking data). When you upgrade to a paid plan you can swap
 * this out for a real lookup.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json(article, {
    headers: { "Cache-Control": "public, s-maxage=3600" },
  });
}
