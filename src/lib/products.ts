import { z } from "zod";

export type Product = {
  id: number;
  name: string;
  title: string;
  price: number;
  description: string;
  stock: number;
  category: string;
};

export type ProductList = {
  products: Product[];
};

export const CATEGORIES = [
  "Electronics",
  "Accessories",
  "Computers",
  "Other",
] as const;

export const ProductDraftSchema = z.object({
  title: z.string().trim().min(1, "กรุณากรอกชื่อสินค้า"),
  price: z.number().positive("ราคาต้องมากกว่า 0"),
  stock: z
    .number()
    .int("จำนวนสินค้าต้องเป็นจำนวนเต็ม")
    .min(0, "จำนวนสินค้าต้องไม่ติดลบ"),
  category: z.string().min(1, "กรุณาเลือกหมวดหมู่"),
});

export type ProductDraft = z.infer<typeof ProductDraftSchema>;

export const SearchQuerySchema = z.object({
  q: z.string().default(""),
  limit: z.number().int().min(1).max(30),
  sortBy: z.enum(["title", "price", "stock"]).default("title"),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;

export type SearchQueryInput = z.input<typeof SearchQuerySchema>;

export const SORT_FIELDS = ["title", "price", "stock"] as const;

export const defaultQuery: SearchQuery = {
  q: "",
  limit: 10,
  sortBy: "title",
};

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Mechanical Keyboard",
    title: "Mechanical Keyboard",
    price: 2590,
    description: "คีย์บอร์ด Mechanical สำหรับทำงานและเล่นเกม",
    stock: 15,
    category: "Accessories",
  },
  {
    id: 2,
    name: "Wireless Mouse",
    title: "Wireless Mouse",
    price: 1290,
    description: "เมาส์ไร้สาย น้ำหนักเบา",
    stock: 8,
    category: "Accessories",
  },
  {
    id: 3,
    name: "USB-C Hub",
    title: "USB-C Hub",
    price: 1890,
    description: "USB-C Hub พร้อม HDMI และ Card Reader",
    stock: 20,
    category: "Electronics",
  },
];

declare global {
  // eslint-disable-next-line no-var
  var demoProducts: Product[] | undefined;
}

const products: Product[] =
  globalThis.demoProducts ?? structuredClone(initialProducts);

if (process.env.NODE_ENV !== "production") {
  globalThis.demoProducts = products;
}

export function getProducts(): Product[] {
  return products;
}

export function getProduct(id: string): Product | undefined {
  return products.find((product) => String(product.id) === id);
}

export function updateProduct(
  id: string,
  values: Partial<
    Pick<
      Product,
      "name" | "title" | "price" | "description" | "stock" | "category"
    >
  >
): void {
  const product = getProduct(id);

  if (!product) {
    throw new Error("Product not found");
  }

  Object.assign(product, values);

  if (values.name !== undefined) {
    product.title = values.name;
  }

  if (values.title !== undefined) {
    product.name = values.title;
  }
}

export function deleteProduct(id: string): void {
  const index = products.findIndex(
    (product) => String(product.id) === id
  );

  if (index === -1) {
    throw new Error("Product not found");
  }

  products.splice(index, 1);
}

export async function fetchProducts(
  query: SearchQuery
): Promise<ProductList> {
  const validatedQuery = SearchQuerySchema.parse(query);
  const searchTerm = validatedQuery.q.trim().toLowerCase();

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm)
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const field = validatedQuery.sortBy;

    if (field === "price" || field === "stock") {
      return a[field] - b[field];
    }

    return a.title.localeCompare(b.title);
  });

  return {
    products: sortedProducts.slice(0, validatedQuery.limit),
  };
}