"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, ProductDraftSchema } from "@/lib/products";
import type { Product, ProductDraft } from "@/lib/products";

type ProductFormProps = {
  editing: Product | null;
  onSave: (draft: ProductDraft) => void;
  onCancel: () => void;
};

export default function ProductForm({ editing, onSave, onCancel }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<ProductDraft>({
    resolver: zodResolver(ProductDraftSchema),
    mode: "onTouched",
    defaultValues: editing
      ? {
          title: editing.title,
          price: editing.price,
          stock: editing.stock,
          category: editing.category,
        }
      : {
          title: "",
          price: undefined,
          stock: undefined,
        },
  });

  function saveProduct(values: ProductDraft) {
    onSave(values);
    reset();
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">
          {editing ? "✏️ แก้ไขสินค้า" : "➕ เพิ่มสินค้าใหม่"}
        </h2>
        {editing && (
          <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-medium border border-amber-200">
            โหมดกำลังแก้ไข ID: {editing.id}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit(saveProduct)} noValidate className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ชื่อสินค้า */}
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              ชื่อสินค้า <span className="text-rose-500">*</span>
            </label>
            <input
              id="title"
              placeholder="เช่น iPhone 15 Pro, กระเป๋าสะพาย"
              {...register("title")}
              aria-invalid={!!errors.title}
              aria-describedby="title-error"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
            {errors.title && (
              <p id="title-error" role="alert" className="text-rose-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                ⚠️ {errors.title.message}
              </p>
            )}
          </div>

          {/* ราคา */}
          <div>
            <label htmlFor="price" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              ราคา (บาท / USD) <span className="text-rose-500">*</span>
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("price", { valueAsNumber: true })}
              aria-invalid={!!errors.price}
              aria-describedby="price-error"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
            {errors.price && (
              <p id="price-error" role="alert" className="text-rose-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                ⚠️ {errors.price.message}
              </p>
            )}
          </div>

          {/* จำนวนคงเหลือ */}
          <div>
            <label htmlFor="stock" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              จำนวนคงเหลือ (ชิ้น) <span className="text-rose-500">*</span>
            </label>
            <input
              id="stock"
              type="number"
              step="1"
              placeholder="0"
              {...register("stock", { valueAsNumber: true })}
              aria-invalid={!!errors.stock}
              aria-describedby="stock-error"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
            {errors.stock && (
              <p id="stock-error" role="alert" className="text-rose-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                ⚠️ {errors.stock.message}
              </p>
            )}
          </div>

          {/* หมวดหมู่ */}
          <div className="md:col-span-2">
            <label htmlFor="category" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              หมวดหมู่ <span className="text-rose-500">*</span>
            </label>
            <select
              id="category"
              {...register("category")}
              aria-invalid={!!errors.category}
              aria-describedby="category-error"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition cursor-pointer"
            >
              <option value="">-- กรุณาเลือกหมวดหมู่สินค้า --</option>
              {CATEGORIES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p id="category-error" role="alert" className="text-rose-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                ⚠️ {errors.category.message}
              </p>
            )}
          </div>
        </div>

        {/* ปุ่ม Submit */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="submit"
            disabled={!isDirty || !isValid}
            className="px-5 py-2 rounded-lg font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
          >
            {editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg font-medium text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              ยกเลิก
            </button>
          )}
        </div>
      </form>
    </div>
  );
}