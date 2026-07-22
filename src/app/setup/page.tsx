import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SetupForm } from "./setup-form";

export default async function SetupPage() {
  const userCount = await prisma.user.count();

  if (userCount > 0) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-semibold text-slate-900">
          Configuração inicial
        </h1>
        <p className="mb-6 text-sm text-slate-500">
          Crie o primeiro usuário administrador do sistema.
        </p>
        <SetupForm />
      </div>
    </div>
  );
}
