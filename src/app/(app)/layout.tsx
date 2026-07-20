import { auth } from "@/auth";
import { Sidebar } from "./components/sidebar";
import { Topbar } from "./components/topbar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex min-h-screen w-full">
      <aside className="w-56 shrink-0 border-r border-slate-200 bg-white">
        <Sidebar />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar userName={session?.user?.name} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
