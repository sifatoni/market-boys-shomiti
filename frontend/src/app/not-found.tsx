import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-black text-indigo-500 select-none leading-none">
          404
        </h1>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Page not found</h2>
          <p className="text-zinc-400 text-sm max-w-xs mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors text-sm"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
