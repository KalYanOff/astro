export const ROOM_CATEGORIES = [
  {
    id: 'standard-2',
    label: 'Стандарт 2-местный',
    group: 'Стандарт',
    category: 'standard',
    capacity: 2,
  },
  {
    id: 'standard-3',
    label: 'Стандарт 3-местный',
    group: 'Стандарт',
    category: 'standard',
    capacity: 3,
  },
  {
    id: 'econom-2',
    label: 'Эконом 2-местный',
    group: 'Эконом',
    category: 'econom',
    capacity: 2,
  },
  {
    id: 'econom-3',
    label: 'Эконом 3-местный',
    group: 'Эконом',
    category: 'econom',
    capacity: 3,
  },
  {
    id: 'econom-4',
    label: 'Эконом 4-местный',
    group: 'Эконом',
    category: 'econom',
    capacity: 4,
  },
];

export const ROOM_CATEGORIES_BY_ID = Object.fromEntries(
  ROOM_CATEGORIES.map((item) => [item.id, item])
);

export function normalizeRoomCategory(category) {
  if (category === 'standart') return 'standard';
  return category;
}

export function getRoomCategoryId(categoryOrRoom, capacityArg) {
  const category =
    typeof categoryOrRoom === 'object'
      ? normalizeRoomCategory(categoryOrRoom?.category)
      : normalizeRoomCategory(categoryOrRoom);
  const capacity =
    typeof categoryOrRoom === 'object' ? categoryOrRoom?.capacity : capacityArg;

  const match = ROOM_CATEGORIES.find(
    (item) => item.category === category && item.capacity === capacity
  );

  return match?.id ?? null;
}

export function getRoomCategoryMeta(categoryId) {
  return ROOM_CATEGORIES_BY_ID[categoryId] ?? null;
}
