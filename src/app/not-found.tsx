import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
      <p className="num text-7xl font-bold text-gold">404</p>
      <div className="my-5 h-px w-24 bg-gold/50" />
      <h1 className="text-xl font-black uppercase tracking-wide text-white">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-white/40">
        The page you are looking for may have expired or was moved.
      </p>
      <Link href="/" className="btn-gold mt-7 max-w-[220px]">
        Back to the board
      </Link>
    </div>
  );
}
