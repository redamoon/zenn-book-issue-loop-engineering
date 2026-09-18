import { afterEach, describe, expect, it, vi } from "vitest";
import type { Item } from "@/lib/items/types";

vi.mock("@/lib/items/repository", () => ({
  getItems: vi.fn(),
}));

import { getItems } from "@/lib/items/repository";
import { GET } from "@/app/api/items/route";

const mockedGetItems = vi.mocked(getItems);

describe("GET /api/items", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 and an array of items", async () => {
    const items: Item[] = [
      {
        id: "1",
        name: "Item 1",
        description: "Description for item 1",
        createdAt: "2024-01-01T00:00:00.000Z",
      },
    ];
    mockedGetItems.mockReturnValue(items);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body).toEqual(items);
  });

  it("returns 200 and an empty array when there are no items", async () => {
    mockedGetItems.mockReturnValue([]);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual([]);
  });

  it("returns items matching the Item type shape", async () => {
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
    mockedGetItems.mockReturnValue(items);

    const response = await GET();
    const body = await response.json();

    for (const item of body) {
      expect(item).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          createdAt: expect.any(String),
        }),
      );
    }
  });
});
