import Link from "next/link";
import { redirect } from "next/navigation";
import { loginAction } from "@/app/actions";
import { AuthShell } from "@/components/auth-shell";
import { PasswordInput } from "@/components/password-input";
import { csrfToken, getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; reset?: string; next?: string }>;
}) {
  const current = await getCurrentUser();
  if (current) redirect("/");

  const { error, reset, next } = await searchParams;
  const csrf = await csrfToken();

  return (
    <AuthShell title="Login">
      {error ? <p className="alert-error mb-5">Wrong username or password. Please try again.</p> : null}
      {reset ? <p className="alert-success mb-5">Password updated. Log in with your new password.</p> : null}

      <form method="post" action={loginAction}>
        <input type="hidden" name="csrf" value={csrf} />
        <input type="hidden" name="next" value={next ?? ""} />

        <div className="auth-card mb-8">
          <p className="mb-6 text-sm font-medium text-[#3e3423]">Please enter your details to proceed</p>

          <div className="mb-5">
            <label className="input-label" htmlFor="login">
              Username / Email
            </label>
            <div className="relative">
              <svg className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-[#3e3423]/70" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <input
                id="login"
                type="text"
                name="login"
                placeholder="Enter your username or email"
                className="input-field pl-7"
                required
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="input-label" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <svg className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-[#3e3423]/70" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
              <PasswordInput name="password" id="password" />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-sm font-medium">
            <label className="flex cursor-pointer items-center gap-2 text-[#3e3423]">
              <input type="checkbox" name="remember" className="h-4 w-4 accent-black" />
              Remember me
            </label>
            <Link href="/forgot" className="link-premium text-black">
              Forgot Password?
            </Link>
          </div>

          <div className="mt-8 text-xs font-semibold text-[#3e3423]">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="link-premium text-black">
              Register Now
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <span className="gold-text text-lg font-medium tracking-wide">Proceed</span>
          <button type="submit" className="btn-round" aria-label="Log in">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
            </svg>
          </button>
        </div>
      </form>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-[11px] leading-relaxed text-white/50">
        <p className="mb-1 font-bold uppercase tracking-widest text-gold/80">Demo accounts</p>
        <p>User: demo@champeetips.com / demo123</p>
        <p>Admin: admin@champeetips.com / admin123</p>
      </div>
    </AuthShell>
  );
}
