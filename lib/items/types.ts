export interface Item {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export type ItemsListResponse = Item[];
