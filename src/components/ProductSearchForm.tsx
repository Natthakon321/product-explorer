"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  SearchQuerySchema,
  SORT_FIELDS,
  defaultQuery,
} from "@/lib/products";

import type {
  SearchQuery,
  SearchQueryInput,
} from "@/lib/products";

type ProductSearchFormProps = {
  onSearch: (query: SearchQuery) => Promise<void> | void;
};

export default function ProductSearchForm({
  onSearch,
}: ProductSearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SearchQueryInput, unknown, SearchQuery>({
    resolver: zodResolver(SearchQuerySchema),
    defaultValues: defaultQuery,
  });

  async function onSubmit(query: SearchQuery) {
    await onSearch(query);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <div>
        <label
          htmlFor="search-query"
          className="mb-1 block text-sm font-medium"
        >
          ค้นหาชื่อสินค้า
        </label>

        <input
          id="search-query"
          type="text"
          placeholder="พิมพ์ชื่อสินค้า..."
          {...register("q")}
          className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="search-limit"
          className="mb-1 block text-sm font-medium"
        >
          จำนวนรายการ
        </label>

        <select
          id="search-limit"
          {...register("limit", { valueAsNumber: true })}
          className="w-full rounded-lg border px-3 py-2"
        >
          {[5, 10, 15, 20, 30].map((limit) => (
            <option key={limit} value={limit}>
              {limit} รายการ
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="search-sort"
          className="mb-1 block text-sm font-medium"
        >
          เรียงตาม
        </label>

        <select
          id="search-sort"
          {...register("sortBy")}
          className="w-full rounded-lg border px-3 py-2"
        >
          {SORT_FIELDS.map((field) => (
            <option key={field} value={field}>
              {field === "title"
                ? "ชื่อสินค้า"
                : field === "price"
                  ? "ราคา"
                  : "จำนวนสินค้า"}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "กำลังค้นหา..." : "ค้นหาสินค้า"}
        </button>
      </div>
    </form>
  );
}