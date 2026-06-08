import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <section className="pt-40 pb-40 px-4">
      <div className="max-w-6xl mx-auto text-center space-y-6">
        <p className="text-xs text-black/30 uppercase tracking-wide">404</p>
        <h1 className="text-5xl font-normal text-black tracking-tight">Page not found.</h1>
        <p className="text-base text-black/50 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="inline-block bg-black text-white px-6 py-2.5 text-sm rounded-md hover:bg-black/90 transition-colors">
          Back to home
        </Link>
      </div>
    </section>
  );
}
