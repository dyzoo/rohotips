import { forgotAction } from "@/app/actions";
import { AuthShell } from "@/components/auth-shell";
import { csrfToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ForgotPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  const { error, sent } = await searchParams;
  const csrf = await csrfToken();

  return (
    <AuthShell title="Recover" backHref="/login">
      {sent ? (
        <p className="alert-success mb-5">
          If an account exists for that email, a reset link has been created.
        </p>
      ) : null}
      {error ? <p className="alert-error mb-5">Please enter a valid email and solve the anti-robot question.</p> : null}

      <form method="post" action={forgotAction} className="space-y-5">
        <input type="hidden" name="csrf" value={csrf} />

        <p className="text-sm leading-relaxed text-white/50">
          Enter your email to receive a reset link.
        </p>

        <div>
          <label className="field-label" htmlFor="email">
            Email address
          </label>
          <input id="email" type="email" name="email" placeholder="example@gmail.com" className="field" required />
        </div>

        <div>
          <label className="field-label" htmlFor="captcha">
            Anti-robot: 6 + 4 = ?
          </label>
          <input id="captcha" type="number" name="captcha" placeholder="Jibu lako" className="field" required />
        </div>

        <button type="submit" className="btn-gold flex items-center justify-center gap-2">
          Send link
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>
    </AuthShell>
  );
}
