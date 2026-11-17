import { notFound } from "next/navigation";
import { updateSlipAction } from "@/app/actions";
import { SlipForm } from "@/components/slip-form";
import { csrfToken } from "@/lib/auth";
import { findSlip } from "@/lib/db";

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
  const slip = await findSlip(id);
  if (!slip) notFound();
  const csrf = await csrfToken();

  return (
    <SlipForm
      action={updateSlipAction}
      csrf={csrf}
      slip={slip}
      error={error ? "Check the title and validity date, then try again." : undefined}
    />
  );
}
