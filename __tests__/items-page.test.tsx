// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import type { Item } from "@/lib/items/types";
import ItemsPage from "@/app/items/page";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function mockFetchResolvedWith(items: Item[]) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => items,
    }),
  );
}

describe("ItemsPage", () => {
  it("renders the items returned by GET /api/items", async () => {
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
    ];
    mockFetchResolvedWith(items);

    render(<ItemsPage />);

    expect(await screen.findByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      "/api/items",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("shows an empty-state message when there are no items", async () => {
    mockFetchResolvedWith([]);

    render(<ItemsPage />);

    expect(
      await screen.findByText("該当するアイテムがありません"),
    ).toBeInTheDocument();
  });

  it("shows an error message instead of the empty state when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error("should not be called");
        },
      }),
    );

    render(<ItemsPage />);

    expect(
      await screen.findByText("アイテムの取得に失敗しました"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("該当するアイテムがありません"),
    ).not.toBeInTheDocument();
  });
});
