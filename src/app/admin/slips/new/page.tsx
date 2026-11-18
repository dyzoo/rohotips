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
      error={
        error === "upload"
          ? "The logo could not be uploaded. Use a PNG, JPEG or WebP image under 4 MB."
          : error
            ? "Check the title, category, odds, price and validity date."
            : undefined
      }
    />
  );
}
