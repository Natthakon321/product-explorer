"use client";

import { useEffect, useState } from "react";
import {
  defaultQuery,
  fetchProducts,
} from "@/lib/products";
import type {
  Product,
  ProductDraft,
  ProductList,
  SearchQuery,
} from "@/lib/products";
import ProductForm from "@/components/ProductForm";
import ProductSearchForm from "@/components/ProductSearchForm";

export default function ProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadProducts(query: SearchQuery = defaultQuery) {
    setLoading(true);

    try {
      const result: ProductList = await fetchProducts(query);
      setProducts(result.products);
    } catch {
      setMessage("ไม่สามารถโหลดสินค้าได้");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  async function handleSearch(query: SearchQuery) {
    await loadProducts(query);
  }

  function handleSave(draft: ProductDraft) {
    if (editingId !== null) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingId
            ? {
                ...product,
                name: draft.title,
                title: draft.title,
                price: draft.price,
                stock: draft.stock,
                category: draft.category,
              }
            : product
        )
      );

      setEditingId(null);
      setMessage("แก้ไขสินค้าเรียบร้อยแล้ว");
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      name: draft.title,
      title: draft.title,
      price: draft.price,
      description: "",
      stock: draft.stock,
      category: draft.category,
    };

    setProducts((current) => [...current, newProduct]);
    setMessage("เพิ่มสินค้าเรียบร้อยแล้ว");
  }

  function handleEdit(product: Product) {
    setEditingId(product.id);
    setMessage("");
  }

  function handleDelete(id: number) {
    const confirmed = window.confirm("คุณต้องการลบสินค้านี้หรือไม่?");

    if (!confirmed) return;

    setProducts((current) =>
      current.filter((product) => product.id !== id)
    );

    if (editingId === id) {
      setEditingId(null);
    }

    setMessage("ลบสินค้าเรียบร้อยแล้ว");
  }

  const editingProduct =
    products.find((product) => product.id === editingId) ?? null;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 p-6">
      <header>
        <h1 className="text-3xl font-bold">Product Explorer</h1>
        <p className="mt-2 text-gray-600">
          ค้นหา เพิ่ม แก้ไข และจัดการข้อมูลสินค้า
        </p>
      </header>

      {message && (
        <div
          role="status"
          className="rounded-lg bg-green-100 p-3 text-green-800"
        >
          {message}
        </div>
      )}

      <section className="rounded-xl border p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">
          {editingProduct ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}
        </h2>

        <ProductForm
          key={editingProduct?.id ?? "new-product"}
          initialData={
            editingProduct
              ? {
                  title: editingProduct.title,
                  price: editingProduct.price,
                  stock: editingProduct.stock,
                  category: editingProduct.category,
                }
              : undefined
          }
          onSubmit={handleSave}
          onCancel={() => setEditingId(null)}
        />
      </section>

      <section className="rounded-xl border p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">ค้นหาสินค้า</h2>

        <ProductSearchForm onSearch={handleSearch} />
      </section>

      <section className="rounded-xl border p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">รายการสินค้า</h2>
          <span className="text-sm text-gray-500">
            ทั้งหมด {products.length} รายการ
          </span>
        </div>

        {loading ? (
          <p className="py-8 text-center text-gray-500">
            กำลังโหลดสินค้า...
          </p>
        ) : products.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            ไม่พบสินค้า
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3">ชื่อสินค้า</th>
                  <th className="p-3">หมวดหมู่</th>
                  <th className="p-3">ราคา</th>
                  <th className="p-3">คงเหลือ</th>
                  <th className="p-3">จัดการ</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="p-3 font-medium">
                      {product.title}
                    </td>

                    <td className="p-3">
                      {product.category}
                    </td>

                    <td className="p-3">
                      {product.price.toLocaleString("th-TH", {
                        style: "currency",
                        currency: "THB",
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    <td className="p-3">{product.stock}</td>

                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(product)}
                          className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                        >
                          แก้ไข
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(product.id)}
                          className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
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
        )}
      </section>
    </main>
  );
}