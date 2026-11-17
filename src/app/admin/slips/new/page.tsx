import { createSlipAction } from "@/app/actions";
import { SlipForm } from "@/components/slip-form";
import { csrfToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewSlipPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const csrf = await csrfToken();
  return (
    <SlipForm
      action={createSlipAction}
      csrf={csrf}
      error={error ? "Check the title, category, odds, price and validity date." : undefined}
    />
  );
}
