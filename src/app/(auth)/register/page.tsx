import Link from "next/link";
import { redirect } from "next/navigation";
import { registerAction } from "@/app/actions";
import { AuthShell } from "@/components/auth-shell";
import { PasswordInput } from "@/components/password-input";
import { csrfToken, getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const current = await getCurrentUser();
  if (current) redirect("/");

  const { error } = await searchParams;
  const csrf = await csrfToken();

  return (
    <AuthShell title="Register Now">
      {error === "exists" ? (
        <p className="alert-error mb-5">An account with this email already exists. Try logging in.</p>
      ) : error ? (
        <p className="alert-error mb-5">Please fill all fields correctly. Passwords must match and be at least 6 characters.</p>
      ) : null}

      <form method="post" action={registerAction}>
        <input type="hidden" name="csrf" value={csrf} />

        <div className="auth-card mb-8">
          <p className="mb-6 text-sm font-medium text-[#3e3423]">Please enter your details to proceed</p>

          <div className="mb-5">
            <label className="input-label" htmlFor="username">
              Full Name
            </label>
            <div className="relative">
              <svg className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-[#3e3423]/70" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <input id="username" type="text" name="username" placeholder="John Doe" className="input-field pl-7" required />
            </div>
          </div>

          <div className="mb-5">
            <label className="input-label" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <svg className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-[#3e3423]/70" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <input id="email" type="email" name="email" placeholder="you@example.com" className="input-field pl-7" required />
            </div>
          </div>

          <div className="mb-5">
            <label className="input-label" htmlFor="phone">
              Mobile Number
            </label>
            <div className="relative">
              <svg className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-[#3e3423]/70" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              <input id="phone" type="tel" name="phone" placeholder="+255 700 000000" className="input-field pl-7" required />
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

          <div className="mb-6">
            <label className="input-label" htmlFor="confirm_password">
              Confirm Password
            </label>
            <div className="relative">
              <svg className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-[#3e3423]/70" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
              <PasswordInput name="confirm_password" id="confirm_password" />
            </div>
          </div>

          <div className="mt-8 text-xs font-semibold text-[#3e3423]">
            Already have an account?{" "}
            <Link href="/login" className="link-premium text-black">
              Login
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <span className="gold-text text-lg font-medium tracking-wide">Next</span>
          <button type="submit" className="btn-round" aria-label="Create account">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
            </svg>
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
