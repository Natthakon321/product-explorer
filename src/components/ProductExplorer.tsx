"use client";

import { useEffect, useState } from "react";
import { defaultQuery, fetchProducts } from "@/lib/products";
import type { Product, ProductDraft, ProductList, SearchQuery } from "@/lib/products";
import ProductForm from "./ProductForm";
import ProductSearchForm from "./ProductSearchForm";

type LoadState = "loading" | "error" | "ready";

export default function ProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const editingProduct = products.find((item) => item.id === editingId) ?? null;

  function showResult(list: ProductList) {
    setProducts(list.products);
    setStatus("ready");
  }

  function showError(error: unknown) {
    setErrorMessage(error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ");
    setStatus("error");
  }

  async function loadProducts(query: SearchQuery) {
    setStatus("loading");
    setErrorMessage("");
    try {
      showResult(await fetchProducts(query));
    } catch (error) {
      showError(error);
    }
  }

  useEffect(() => {
    fetchProducts(defaultQuery).then(showResult).catch(showError);
  }, []);

  function saveProduct(draft: ProductDraft) {
    if (editingId !== null) {
      setProducts(
        products.map((item) => (item.id === editingId ? { ...item, ...draft } : item))
      );
      setEditingId(null);
    } else {
      setProducts([...products, { ...draft, id: Date.now() }]);
    }
  }

  function removeProduct(id: number) {
    setProducts(products.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              📦 ระบบจัดการสินค้า (Product Explorer)
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              ใบงาน React Hook Form, Zod และ External API
            </p>
          </div>
          <button
            type="button"
            onClick={() => loadProducts(defaultQuery)}
            disabled={status === "loading"}
            className="mt-4 sm:mt-0 px-4 py-2 text-sm font-medium bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 transition shadow-sm flex items-center justify-center gap-2"
          >
            🔄 {status === "loading" ? "กำลังโหลด..." : "โหลดข้อมูลใหม่"}
          </button>
        </div>

        {/* ฟอร์มเพิ่ม / แก้ไข */}
        <ProductForm
          key={editingId ?? "new"}
          editing={editingProduct}
          onSave={saveProduct}
          onCancel={() => setEditingId(null)}
        />

        {/* ฟอร์มค้นหา */}
        <ProductSearchForm onSearch={loadProducts} />

        {/* ผลลัพธ์และตาราง */}
        <section aria-live="polite" className="mt-6">
          {status === "loading" && (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-sm text-slate-500 font-medium">
              ⏳ กำลังโหลดข้อมูลสินค้า...
            </div>
          )}

          {status === "error" && (
            <div
              role="alert"
              className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium text-center"
            >
              ❌ {errorMessage}
            </div>
          )}

          {status === "ready" && products.length === 0 && (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-sm text-slate-500">
              🔍 ไม่พบสินค้าที่ตรงกับเงื่อนไขการค้นหา
            </div>
          )}

          {status === "ready" && products.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">ชื่อสินค้า</th>
                      <th className="py-3.5 px-4 text-right">ราคา</th>
                      <th className="py-3.5 px-4 text-center">คงเหลือ</th>
                      <th className="py-3.5 px-4">หมวดหมู่</th>
                      <th className="py-3.5 px-4 text-center">การกระทำ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 font-medium text-slate-900">{item.title}</td>
                        <td className="py-3 px-4 text-right font-mono text-emerald-600 font-semibold">
                          ${typeof item.price === "number" ? item.price.toFixed(2) : item.price}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                              item.stock > 10
                                ? "bg-slate-100 text-slate-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {item.stock} ชิ้น
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingId(item.id)}
                              className="px-2.5 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition"
                            >
                              แก้ไข
                            </button>
                            <span className="text-slate-300">|</span>
                            <button
                              type="button"
                              onClick={() => removeProduct(item.id)}
                              className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition"
                            >
                              ลบ
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 text-right">
                แสดงผลทั้งหมด {products.length} รายการ
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}