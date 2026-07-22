"use client";

import { useActionState } from "react";
import { setupAdminAction, type SetupState } from "./actions";
import { inputClass, labelClass, primaryButtonClass } from "@/components/ui";

const initialState: SetupState = {};

export function SetupForm() {
  const [state, formAction, pending] = useActionState(
    setupAdminAction,
    initialState
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className={labelClass}>
          Nome
        </label>
        <input id="name" name="name" required className={inputClass} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className={labelClass}>
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className={labelClass}>
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          className={inputClass}
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className={`${primaryButtonClass} mt-2 disabled:opacity-50`}
      >
        {pending ? "Criando..." : "Criar administrador"}
      </button>
    </form>
  );
}
