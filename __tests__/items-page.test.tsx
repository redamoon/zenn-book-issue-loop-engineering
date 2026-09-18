// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
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

function mockFetchFilteredBy(allItems: Item[]) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockImplementation(async (input: string) => {
      const keyword = new URL(input, "http://localhost").searchParams.get(
        "keyword",
      );
      const filtered = keyword
        ? allItems.filter(
            (item) =>
              item.name.includes(keyword) || item.description.includes(keyword),
          )
        : allItems;

      return {
        ok: true,
        json: async () => filtered,
      };
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

  it("renders a keyword search box", async () => {
    mockFetchResolvedWith([]);

    render(<ItemsPage />);

    expect(
      await screen.findByRole("searchbox", { name: "キーワード検索" }),
    ).toBeInTheDocument();
  });

  it("filters the list via the API when a keyword is entered", async () => {
    const items: Item[] = [
      {
        id: "1",
        name: "Apple",
        description: "A fruit",
        createdAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: "2",
        name: "Banana",
        description: "Another fruit",
        createdAt: "2024-01-02T00:00:00.000Z",
      },
    ];
    mockFetchFilteredBy(items);

    render(<ItemsPage />);
    await screen.findByText("Apple");

    const searchBox = screen.getByRole("searchbox", {
      name: "キーワード検索",
    });
    fireEvent.change(searchBox, { target: { value: "Apple" } });

    await waitFor(() => {
      expect(fetch).toHaveBeenLastCalledWith(
        "/api/items?keyword=Apple",
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });
    await waitFor(() => {
      expect(screen.queryByText("Banana")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Apple")).toBeInTheDocument();
  });

  it("shows the empty-state message when the keyword search has no matches", async () => {
    const items: Item[] = [
      {
        id: "1",
        name: "Apple",
        description: "A fruit",
        createdAt: "2024-01-01T00:00:00.000Z",
      },
    ];
    mockFetchFilteredBy(items);

    render(<ItemsPage />);
    await screen.findByText("Apple");

    const searchBox = screen.getByRole("searchbox", {
      name: "キーワード検索",
    });
    fireEvent.change(searchBox, { target: { value: "nonexistent" } });

    expect(
      await screen.findByText("該当するアイテムがありません"),
    ).toBeInTheDocument();
  });
});
