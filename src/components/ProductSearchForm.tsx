"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SORT_FIELDS, SearchQuerySchema, defaultQuery } from "@/lib/products";
import type { SearchQuery } from "@/lib/products";

type ProductSearchFormProps = {
  onSearch: (query: SearchQuery) => Promise<void>;
};

export default function ProductSearchForm({ onSearch }: ProductSearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchQuery>({
    resolver: zodResolver(SearchQuerySchema),
    mode: "onTouched",
    defaultValues: defaultQuery,
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
      <form onSubmit={handleSubmit(onSearch)} noValidate className="flex flex-wrap items-end gap-3">
        {/* คำค้น */}
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="q" className="block text-xs font-semibold text-slate-600 mb-1">
            ค้นหาชื่อสินค้า
          </label>
          <input
            id="q"
            placeholder="พิมพ์ชื่อสินค้า เช่น phone, watch..."
            {...register("q")}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        {/* จำนวนรายการ */}
        <div className="w-28">
          <label htmlFor="limit" className="block text-xs font-semibold text-slate-600 mb-1">
            จำนวน (1-30)
          </label>
          <input
            id="limit"
            type="number"
            {...register("limit", { valueAsNumber: true })}
            aria-invalid={!!errors.limit}
            aria-describedby="limit-error"
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-center"
          />
        </div>

        {/* เรียงตาม */}
        <div className="w-36">
          <label htmlFor="sortBy" className="block text-xs font-semibold text-slate-600 mb-1">
            เรียงตาม
          </label>
          <select
            id="sortBy"
            {...register("sortBy")}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
          >
            {SORT_FIELDS.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>
        </div>

        {/* ปุ่ม Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 rounded-lg disabled:opacity-50 transition shadow-sm"
        >
          {isSubmitting ? "กำลังค้นหา..." : "🔍 ค้นหา"}
        </button>
      </form>

      {errors.limit && (
        <p id="limit-error" role="alert" className="text-rose-500 text-xs mt-2 font-medium">
          ⚠️ {errors.limit.message}
        </p>
      )}
    </div>
  );
}