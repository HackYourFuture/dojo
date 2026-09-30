import { InfiniteData } from '@tanstack/react-query';

// The number of items that a list asks for at a time.
export const PAGE_SIZE = 50;

// A page of a list, as the API returns it.
export interface PagedModel<T> {
  content: T[];
  page: {
    totalPages: number;
  };
}

// A page of a list, with its items mapped to the client's model.
export interface Page<T> {
  items: T[];
  totalPages: number;
}

export const mapPageToDomain = <ApiItem, Item>(
  page: PagedModel<ApiItem>,
  mapItem: (item: ApiItem) => Item
): Page<Item> => {
  return {
    items: page.content.map(mapItem),
    totalPages: page.page.totalPages,
  };
};

// For useInfiniteQuery: the page after the last loaded one, or undefined when that was the last page.
export const getNextPageParam = (lastPage: Page<unknown>, _allPages: unknown, lastPageParam: number) =>
  lastPageParam + 1 < lastPage.totalPages ? lastPageParam + 1 : undefined;

// The loaded items, each once. Pages are fetched by offset, so an item added or removed while scrolling can repeat.
export const getLoadedItems = <Item extends { id: string }>(data: InfiniteData<Page<Item>>): Item[] => {
  const seenIds = new Set<string>();

  return data.pages
    .flatMap((page) => page.items)
    .filter((item) => {
      if (seenIds.has(item.id)) {
        return false;
      }
      seenIds.add(item.id);
      return true;
    });
};
