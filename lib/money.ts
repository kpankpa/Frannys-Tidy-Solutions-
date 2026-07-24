/** Money helpers. Prices in the DB are stored as integer pesewas. */

export function cedisToPesewas(cedis: number): number {
  return Math.round(cedis * 100);
}

export function pesewasToCedis(pesewas: number): number {
  return pesewas / 100;
}

export function formatPriceFromPesewas(pesewas: number): string {
  return `GH₵ ${pesewasToCedis(pesewas).toFixed(2)}`;
}

export function formatPriceFromCedis(cedis: number): string {
  return `GH₵ ${cedis.toFixed(2)}`;
}
