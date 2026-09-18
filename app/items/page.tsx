"use client";

import { useEffect, useState } from "react";
import type { Item } from "@/lib/items/types";
import { ItemsList } from "./_components/ItemsList";
import { SearchBox } from "./_components/SearchBox";

const SEARCH_DEBOUNCE_MS = 300;

export default function ItemsPage() {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [keyword]);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setHasError(false);

    const query = debouncedKeyword
      ? `?keyword=${encodeURIComponent(debouncedKeyword)}`
      : "";

    fetch(`/api/items${query}`, { signal: controller.signal })
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
  }, [debouncedKeyword]);

  return (
    <>
      <SearchBox value={keyword} onChange={setKeyword} />
      {isLoading ? (
        <p>読み込み中...</p>
      ) : hasError ? (
        <p>アイテムの取得に失敗しました</p>
      ) : (
        <ItemsList items={items} />
      )}
    </>
  );
}
