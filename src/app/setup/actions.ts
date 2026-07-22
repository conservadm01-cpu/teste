"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export type SetupState = { error?: string };

export async function setupAdminAction(
  _prevState: SetupState,
  formData: FormData
): Promise<SetupState> {
  const existing = await prisma.user.count();
  if (existing > 0) {
    return { error: "A configuração inicial já foi concluída." };
  }

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!name) return { error: "Nome é obrigatório." };
  if (!email) return { error: "E-mail é obrigatório." };
  if (password.length < 6) {
    return { error: "A senha deve ter pelo menos 6 caracteres." };
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, password: hashed, role: "ADMIN" },
  });

  redirect("/login");
}
