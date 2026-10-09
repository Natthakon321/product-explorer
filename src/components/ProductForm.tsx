"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CATEGORIES,
  ProductDraftSchema,
} from "@/lib/products";

import type { ProductDraft } from "@/lib/products";

type ProductFormProps = {
  initialData?: ProductDraft;
  onSubmit: (data: ProductDraft) => void | Promise<void>;
  onCancel?: () => void;
};

export default function ProductForm({
  initialData,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductDraft>({
    resolver: zodResolver(ProductDraftSchema),
    defaultValues: initialData ?? {
      title: "",
      price: 1,
      stock: 0,
      category: "Other",
    },
  });

  useEffect(() => {
    reset(
      initialData ?? {
        title: "",
        price: 1,
        stock: 0,
        category: "Other",
      }
    );
  }, [initialData, reset]);

  async function submitForm(data: ProductDraft) {
    await onSubmit(data);

    if (!initialData) {
      reset({
        title: "",
        price: 1,
        stock: 0,
        category: "Other",
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      <div>
        <label
          htmlFor="product-title"
          className="mb-1 block text-sm font-medium"
        >
          ชื่อสินค้า
        </label>

        <input
          id="product-title"
          {...register("title")}
          placeholder="กรอกชื่อสินค้า"
          className="w-full rounded-lg border px-3 py-2"
        />

        {errors.title && (
          <p className="mt-1 text-sm text-red-600">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="product-price"
          className="mb-1 block text-sm font-medium"
        >
          ราคา (บาท)
        </label>

        <input
          id="product-price"
          type="number"
          min="0.01"
          step="0.01"
          {...register("price", { valueAsNumber: true })}
          className="w-full rounded-lg border px-3 py-2"
        />

        {errors.price && (
          <p className="mt-1 text-sm text-red-600">
            {errors.price.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="product-stock"
          className="mb-1 block text-sm font-medium"
        >
          จำนวนสินค้า
        </label>

        <input
          id="product-stock"
          type="number"
          min="0"
          step="1"
          {...register("stock", { valueAsNumber: true })}
          className="w-full rounded-lg border px-3 py-2"
        />

        {errors.stock && (
          <p className="mt-1 text-sm text-red-600">
            {errors.stock.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="product-category"
          className="mb-1 block text-sm font-medium"
        >
          หมวดหมู่
        </label>

        <select
          id="product-category"
          {...register("category")}
          className="w-full rounded-lg border px-3 py-2"
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {errors.category && (
          <p className="mt-1 text-sm text-red-600">
            {errors.category.message}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 md:col-span-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting
            ? "กำลังบันทึก..."
            : initialData
              ? "บันทึกการแก้ไข"
              : "เพิ่มสินค้า"}
        </button>

        {initialData && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border px-5 py-2 hover:bg-gray-100"
          >
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
}