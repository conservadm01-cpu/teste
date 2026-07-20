import { inputClass, labelClass, primaryButtonClass } from "@/components/ui";
import type { Cliente } from "@prisma/client";

export function ClienteForm({
  cliente,
  action,
}: {
  cliente?: Cliente;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="nome" className={labelClass}>
          Nome *
        </label>
        <input
          id="nome"
          name="nome"
          required
          defaultValue={cliente?.nome}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="documento" className={labelClass}>
          CPF/CNPJ
        </label>
        <input
          id="documento"
          name="documento"
          defaultValue={cliente?.documento ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="telefone" className={labelClass}>
          Telefone
        </label>
        <input
          id="telefone"
          name="telefone"
          defaultValue={cliente?.telefone ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className={labelClass}>
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={cliente?.email ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="endereco" className={labelClass}>
          Endereço
        </label>
        <textarea
          id="endereco"
          name="endereco"
          defaultValue={cliente?.endereco ?? ""}
          className={inputClass}
          rows={2}
        />
      </div>

      <button type="submit" className={`${primaryButtonClass} mt-2 self-start`}>
        Salvar
      </button>
    </form>
  );
}
