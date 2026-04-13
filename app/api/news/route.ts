import { NextRequest, NextResponse } from "next/server";
import { Category } from "@/types";
import { fetchHeadlines, fetchEverything, NewsAPIError } from "@/lib/newsapi";
import { getNews as getMockNews } from "@/services/api/mockService";

const CACHE_SECONDS = 300; // 5 min

export async function GET(req: NextRequest) {
  const sp       = req.nextUrl.searchParams;
  const category = (sp.get("category") ?? "all") as Category;
  const query    = sp.get("q") ?? "";
  const page     = Math.max(1, parseInt(sp.get("page")     ?? "1",  10));
  const pageSize = Math.min(50, parseInt(sp.get("pageSize") ?? "10", 10));

  try {
    let data;

    if (query.trim()) {
      // Search mode — use /everything
      data = await fetchEverything({ query, category, page, pageSize });
    } else {
      // Browse mode — use /top-headlines
      data = await fetchHeadlines({ category, page, pageSize });
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=60`,
        "X-Data-Source": "newsapi",
      },
    });
  } catch (err) {
    // Fall back to mock data when API key is missing or rate-limited
    if (err instanceof NewsAPIError && (err.isNoApiKey || err.isRateLimited)) {
      const mock = await getMockNews({ category, query, page, pageSize });
      return NextResponse.json(mock, {
        headers: {
          "Cache-Control": "no-store",
          "X-Data-Source": "mock",
        },
      });
    }

    console.error("[/api/news]", err);
    return NextResponse.json(
      { error: "Failed to fetch news. Please try again." },
      { status: 502 }
    );
  }
}
