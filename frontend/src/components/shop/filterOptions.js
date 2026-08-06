// These values must match products/models.py Product.Material and
// Product.Gender choices exactly, since they're sent straight to the
// ?material= / ?gender= query params on the API.
export const MATERIAL_OPTIONS = [
  { value: "gold", label: "Gold" },
  { value: "silver", label: "Silver" },
  { value: "platinum", label: "Platinum" },
  { value: "diamond", label: "Diamond" },
  { value: "rose_gold", label: "Rose Gold" },
  { value: "gemstone", label: "Gemstone" },
];

export const GENDER_OPTIONS = [
  { value: "women", label: "Women" },
  { value: "men", label: "Men" },
  { value: "unisex", label: "Unisex" },
  { value: "kids", label: "Kids" },
];

export const SORT_OPTIONS = [
  { value: "-created_at", label: "Newest First" },
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
  { value: "name", label: "Name: A to Z" },
];

export const PRICE_MIN = 0;
export const PRICE_MAX = 200000;
