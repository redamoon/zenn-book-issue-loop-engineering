import { NextResponse, type NextRequest } from "next/server";
import { getItems } from "@/lib/items/repository";
import type { ItemsListResponse } from "@/lib/items/types";

export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams.get("keyword") ?? undefined;
  const items: ItemsListResponse = getItems(keyword);
  return NextResponse.json(items);
}
