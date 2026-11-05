import content from "./food-content.json";
import documents from "./food-documents.json";
export const {
  recipes,
  mealPlan,
  substitutionGroups,
  shopping,
  bases,
  planning,
  safety,
  reading,
  fruitOptions,
  baseStorage,
  about,
} = content;
export { documents };
export function documentUrl(id, page) {
  const doc = documents.find((d) => d.id === id);
  if (!doc) return null;
  const url = window.__MEDEIROS_DOCUMENTS__?.[id] || doc.url;
  return `${url}${page ? `#page=${page}` : ""}`;
}
export const mealNames = mealPlan.map((m) => m.name);
export const cookingMethods = [
  ...new Set(recipes.flatMap((r) => r.methods)),
].sort((a, b) => a.localeCompare(b, "pt-BR"));
export const normalize = (text) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
