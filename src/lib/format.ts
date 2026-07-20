export function currency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function dateBR(value: Date | string) {
  return new Date(value).toLocaleDateString("pt-BR");
}
