import { notFound } from "next/navigation";
import { updateSlipAction } from "@/app/actions";
import { SlipForm } from "@/components/slip-form";
import { csrfToken } from "@/lib/auth";
import { findSlip, getBrandLogos } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EditSlipPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const [slip, logos] = await Promise.all([findSlip(id), getBrandLogos()]);
  if (!slip) notFound();
  const csrf = await csrfToken();

  return (
    <SlipForm
      action={updateSlipAction}
      csrf={csrf}
      slip={slip}
      logos={logos}
      error={
        error === "upload"
          ? "The logo could not be uploaded. Use a PNG, JPEG or WebP image under 4 MB."
          : error
            ? "Check the title and validity date, then try again."
            : undefined
      }
    />
  );
}
