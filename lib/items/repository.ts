import type { Item } from "./types";

const items: Item[] = [
  {
    id: "1",
    name: "Item 1",
    description: "Description for item 1",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Item 2",
    description: "Description for item 2",
    createdAt: "2024-01-02T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Item 3",
    description: "Description for item 3",
    createdAt: "2024-01-03T00:00:00.000Z",
  },
];

export function getItems(keyword?: string): Item[] {
  const normalized = keyword?.trim().toLowerCase();

  if (!normalized) {
    return items;
  }

  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(normalized) ||
      item.description.toLowerCase().includes(normalized),
  );
}
