import { inputClass, labelClass, primaryButtonClass } from "@/components/ui";
import type { Lead } from "@prisma/client";

export function LeadForm({
  lead,
  action,
}: {
  lead?: Lead;
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
          defaultValue={lead?.nome}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="empresa" className={labelClass}>
          Empresa
        </label>
        <input
          id="empresa"
          name="empresa"
          defaultValue={lead?.empresa ?? ""}
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
          defaultValue={lead?.telefone ?? ""}
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
          defaultValue={lead?.email ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="origem" className={labelClass}>
          Origem (ex: indicação, Instagram, site)
        </label>
        <input
          id="origem"
          name="origem"
          defaultValue={lead?.origem ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="observacoes" className={labelClass}>
          Observações
        </label>
        <textarea
          id="observacoes"
          name="observacoes"
          defaultValue={lead?.observacoes ?? ""}
          className={inputClass}
          rows={3}
        />
      </div>

      <button type="submit" className={`${primaryButtonClass} mt-2 self-start`}>
        Salvar
      </button>
    </form>
  );
}
