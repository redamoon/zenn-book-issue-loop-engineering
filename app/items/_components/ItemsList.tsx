import type { Item } from "@/lib/items/types";

type ItemsListProps = {
  items: Item[];
};

export function ItemsList({ items }: ItemsListProps) {
  if (items.length === 0) {
    return <p>該当するアイテムがありません</p>;
  }

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <p>{item.name}</p>
          <p>{item.description}</p>
        </li>
      ))}
    </ul>
  );
}
