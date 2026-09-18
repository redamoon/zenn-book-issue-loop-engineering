import { NextResponse } from "next/server";
import { getItems } from "@/lib/items/repository";
import type { ItemsListResponse } from "@/lib/items/types";

export async function GET() {
  const items: ItemsListResponse = getItems();
  return NextResponse.json(items);
}
