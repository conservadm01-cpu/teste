"use client";

import { secondaryButtonClass } from "@/components/ui";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-red-200 bg-red-50 p-6">
      <h1 className="text-lg font-semibold text-red-800">
        Ocorreu um erro
      </h1>
      <p className="text-sm text-red-700">{error.message}</p>
      <button onClick={reset} className={`${secondaryButtonClass} self-start`}>
        Tentar novamente
      </button>
    </div>
  );
}
