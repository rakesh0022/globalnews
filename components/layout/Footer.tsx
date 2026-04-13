import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#0d1526]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 dark:text-white">
              News<span className="gradient-text">Hub</span>
            </span>
          </div>

          <p className="text-sm text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} NewsHub. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-sm text-slate-400 dark:text-slate-500">
            <Link href="/" className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors">Home</Link>
            <span>·</span>
            <Link href="/blog" className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors">Blog</Link>
            <span>·</span>
            <span className="cursor-default">Privacy</span>
            <span>·</span>
            <span className="cursor-default">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
