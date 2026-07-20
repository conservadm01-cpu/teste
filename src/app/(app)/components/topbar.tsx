import { logoutAction } from "../actions";

export function Topbar({
  userName,
}: {
  userName: string | null | undefined;
}) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
      <span className="text-sm font-semibold text-slate-900">
        Sistema de Confecção
      </span>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500">{userName}</span>
        <form action={logoutAction}>
          <button
            type="submit"
            className="text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            Sair
          </button>
        </form>
      </div>
    </header>
  );
}
