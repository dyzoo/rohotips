import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
      <p className="gold-text text-6xl font-black">404</p>
      <h1 className="mt-3 text-xl font-bold text-white">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-[#888]">
        The page you are looking for may have expired or was moved.
      </p>
      <Link
        href="/"
        className="gold-gradient mt-6 rounded-xl px-6 py-3 text-xs font-extrabold uppercase tracking-wide text-black"
      >
        Back to ChampeeTips
      </Link>
    </div>
  );
}
