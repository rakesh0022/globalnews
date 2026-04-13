import { Suspense } from "react";
import { Metadata } from "next";
import SearchResults from "./SearchResults";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" — Search | NewsHub` : "Search | NewsHub",
    description: q ? `News search results for "${q}"` : "Search NewsHub for the latest news.",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={<SkeletonGrid count={8} />}>
        <SearchResults query={q} />
      </Suspense>
    </div>
  );
}
