"use client";

import { useEffect, useState } from "react";
import type { Item } from "@/lib/items/types";
import { ItemsList } from "./_components/ItemsList";

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/items", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch items: ${response.status}`);
        }
        return response.json() as Promise<Item[]>;
      })
      .then((data) => {
        setItems(data);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        setHasError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  if (isLoading) {
    return <p>読み込み中...</p>;
  }

  if (hasError) {
    return <p>アイテムの取得に失敗しました</p>;
  }

  return <ItemsList items={items} />;
}
