import { createProduto } from "../../actions";
import { ProdutoForm } from "../../produto-form";

export default function NovoProdutoPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900">Novo produto</h1>
      <ProdutoForm action={createProduto} />
    </div>
  );
}
