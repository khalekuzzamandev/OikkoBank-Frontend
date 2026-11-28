
import { Suspense } from "react";
import WithdrawDetailsClient from "./WithdrawDetailsClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function WithdrawDetailsContent({
  params,
}: PageProps) {
  const { id } = await params;

  return <WithdrawDetailsClient id={id} />;
}

export default function WithdrawDetailsPage({
  params,
}: PageProps) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#F4F7FB]">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#003566]" />

            <p className="mt-4 text-sm text-gray-500">
              Loading withdrawal details...
            </p>
          </div>
        </main>
      }
    >
      <WithdrawDetailsContent params={params} />
    </Suspense>
  );
}
