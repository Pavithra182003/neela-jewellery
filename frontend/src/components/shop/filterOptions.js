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
export const PRICE_MAX = 100000;

export const PRICE_OPTIONS = [
  {
    label: "Under ₹500",
    min: 0,
    max: 500,
  },
  {
    label: "₹500 - ₹1,000",
    min: 500,
    max: 1000,
  },
  {
    label: "₹1,000 - ₹2,000",
    min: 1000,
    max: 2000,
  },
  {
    label: "₹2,000 - ₹5,000",
    min: 2000,
    max: 5000,
  },
  {
    label: "₹5,000 - ₹10,000",
    min: 5000,
    max: 10000,
  },
  {
    label: "Above ₹10,000",
    min: 10000,
    max: null,
  },
];