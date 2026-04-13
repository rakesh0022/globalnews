import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-8xl font-black text-gray-200 dark:text-gray-800 select-none">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">Page not found</h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2 mb-8">
        The article or page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
