import Link from "next/link";
import { redirect } from "next/navigation";
import { loginAction } from "@/app/actions";
import { ModernAuthShell } from "@/components/modern-auth-shell";
import { PasswordInput } from "@/components/password-input";
import { csrfToken, getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; reset?: string; next?: string; registered?: string }>;
}) {
  const current = await getCurrentUser();
  if (current) redirect("/");

  const { error, reset, next, registered } = await searchParams;
  const csrf = await csrfToken();

  return (
    <ModernAuthShell
      title="Welcome back"
      subtitle="Sign in to unlock today's sure tips and booking codes."
      footer={
        <>
          New to the desk?{" "}
          <Link href="/register" className="font-bold text-gold hover:text-gold-soft">
            Create an account
          </Link>
        </>
      }
    >
      {error ? <p className="alert-error mb-5">Wrong username or password. Please try again.</p> : null}
      {reset ? <p className="alert-success mb-5">Password updated. Log in with your new password.</p> : null}
      {registered ? <p className="alert-success mb-5">Account created successfully. Please sign in to continue.</p> : null}

      <form method="post" action={loginAction} className="space-y-5">
        <input type="hidden" name="csrf" value={csrf} />
        <input type="hidden" name="next" value={next ?? ""} />

        <div>
          <label className="field-label" htmlFor="login">
            Username or email
          </label>
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/30"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <input
              id="login"
              type="text"
              name="login"
              placeholder="you@example.com"
              className="field field-with-icon"
              autoComplete="username"
              required
            />
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/30"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
            </svg>
            <PasswordInput
              name="password"
              id="password"
              placeholder="Enter your password"
              className="field field-with-icon field-with-toggle"
              toggleClassName="right-4 text-white/35 transition hover:text-white"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 text-xs">
          <label className="flex cursor-pointer items-center gap-2 text-white/55">
            <input type="checkbox" name="remember" className="h-4 w-4 accent-[#dcb97f]" />
            Remember me
          </label>
          <Link href="/forgot" className="font-bold text-gold hover:text-gold-soft">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="btn-gold flex items-center justify-center gap-2"
        >
          Sign in
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
          </svg>
        </button>
      </form>

    </ModernAuthShell>
  );
}
