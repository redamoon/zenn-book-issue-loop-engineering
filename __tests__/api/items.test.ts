import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import type { Item } from "@/lib/items/types";
import * as repository from "@/lib/items/repository";
import { GET } from "@/app/api/items/route";

function makeRequest(url: string) {
  return new NextRequest(url);
}

describe("GET /api/items", () => {
  afterEach(() => {
    vi.restoreAllMocks();
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
    vi.spyOn(repository, "getItems").mockReturnValue(items);

    const response = await GET(makeRequest("http://localhost/api/items"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body).toEqual(items);
  });

  it("returns 200 and an empty array when there are no items", async () => {
    vi.spyOn(repository, "getItems").mockReturnValue([]);

    const response = await GET(makeRequest("http://localhost/api/items"));
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
    vi.spyOn(repository, "getItems").mockReturnValue(items);

    const response = await GET(makeRequest("http://localhost/api/items"));
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

  it("passes the keyword query parameter through to getItems", async () => {
    const spy = vi.spyOn(repository, "getItems").mockReturnValue([]);

    await GET(makeRequest("http://localhost/api/items?keyword=Item"));

    expect(spy).toHaveBeenCalledWith("Item");
  });

  it("calls getItems without a keyword when the query parameter is absent", async () => {
    const spy = vi.spyOn(repository, "getItems").mockReturnValue([]);

    await GET(makeRequest("http://localhost/api/items"));

    expect(spy).toHaveBeenCalledWith(undefined);
  });
});

describe("GET /api/items keyword filtering", () => {
  it("returns only items whose name or description match the keyword, case-insensitively", async () => {
    const response = await GET(
      makeRequest("http://localhost/api/items?keyword=item 1"),
    );
    const body = await response.json();

    expect(body).toEqual([
      expect.objectContaining({ id: "1", name: "Item 1" }),
    ]);
  });

  it("returns all items when the keyword query parameter is not specified", async () => {
    const response = await GET(makeRequest("http://localhost/api/items"));
    const body = await response.json();

    expect(body).toHaveLength(3);
  });

  it("returns an empty array when no item matches the keyword", async () => {
    const response = await GET(
      makeRequest("http://localhost/api/items?keyword=nonexistent"),
    );
    const body = await response.json();

    expect(body).toEqual([]);
  });
});
