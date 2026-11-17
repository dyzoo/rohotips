import { redirect } from "next/navigation";
import { resetPasswordAction } from "@/app/actions";
import { AuthShell } from "@/components/auth-shell";
import { PasswordInput } from "@/components/password-input";
import { csrfToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ResetPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;
  if (!token) redirect("/forgot");
  const csrf = await csrfToken();

  return (
    <AuthShell title="New Password" backHref="/login">
      {error ? <p className="alert-error mb-5">Passwords must match and be at least 6 characters.</p> : null}

      <form method="post" action={resetPasswordAction}>
        <input type="hidden" name="csrf" value={csrf} />
        <input type="hidden" name="token" value={token} />

        <div className="auth-card mb-8">
          <p className="mb-6 text-sm font-medium text-[#3e3423]">Choose a new password for your account</p>

          <div className="mb-5">
            <label className="input-label" htmlFor="password">
              New Password
            </label>
            <div className="relative">
              <svg className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-[#3e3423]/70" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
              <PasswordInput name="password" id="password" />
            </div>
          </div>

          <div>
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
        </div>

        <div className="flex items-center justify-end gap-3">
          <span className="gold-text text-lg font-medium tracking-wide">Save</span>
          <button type="submit" className="btn-round" aria-label="Save new password">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
