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

      <form method="post" action={forgotAction}>
        <input type="hidden" name="csrf" value={csrf} />

        <div className="auth-card mb-8">
          <p className="mb-6 text-sm font-medium text-[#3e3423]">Enter your email to receive a reset link</p>

          <div className="mb-5">
            <label className="input-label" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <svg className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-[#3e3423]/70" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <input id="email" type="email" name="email" placeholder="example@gmail.com" className="input-field pl-7" required />
            </div>
          </div>

          <div>
            <label className="input-label" htmlFor="captcha">
              Anti-Robot: 6 + 4 = ?
            </label>
            <div className="relative">
              <svg className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-[#3e3423]/70" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
              <input id="captcha" type="number" name="captcha" placeholder="Jibu lako" className="input-field pl-7" required />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <span className="gold-text text-lg font-medium tracking-wide">Send Link</span>
          <button type="submit" className="btn-round" aria-label="Send reset link">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
