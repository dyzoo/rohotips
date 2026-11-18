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

      <form method="post" action={resetPasswordAction} className="space-y-5">
        <input type="hidden" name="csrf" value={csrf} />
        <input type="hidden" name="token" value={token} />

        <p className="text-sm leading-relaxed text-white/50">Choose a new password for your account.</p>

        <div>
          <label className="field-label" htmlFor="password">
            New password
          </label>
          <PasswordInput name="password" id="password" className="field pr-12" toggleClassName="right-4 text-white/35" />
        </div>

        <div>
          <label className="field-label" htmlFor="confirm_password">
            Confirm password
          </label>
          <PasswordInput
            name="confirm_password"
            id="confirm_password"
            className="field pr-12"
            toggleClassName="right-4 text-white/35"
          />
        </div>

        <button type="submit" className="btn-gold flex items-center justify-center gap-2">
          Save password
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M4 12l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>
    </AuthShell>
  );
}
