import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { getProduct } from "@/lib/products";
import { updateProductAction } from "@/app/actions";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  // ตรวจสอบว่าผู้ใช้เข้าสู่ระบบแล้วหรือยัง
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  // Next.js 16: params เป็น Promise
  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    notFound();
  }

  // ผูก ID สินค้าเข้ากับ Server Action
  const action = updateProductAction.bind(null, String(product.id));

  return (
    <main className="mx-auto max-w-xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">แก้ไขสินค้า</h1>

      <form action={action} className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="mb-1 block font-medium"
          >
            ชื่อสินค้า
          </label>

          <input
            id="name"
            name="name"
            type="text"
            defaultValue={product.name}
            required
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="mb-1 block font-medium"
          >
            ราคา (บาท)
          </label>

          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={product.price}
            required
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1 block font-medium"
          >
            รายละเอียดสินค้า
          </label>

          <textarea
            id="description"
            name="description"
            defaultValue={product.description}
            required
            rows={4}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            บันทึกการแก้ไข
          </button>

          <Link
            href="/"
            className="rounded-lg border px-5 py-2 hover:bg-gray-100"
          >
            ยกเลิก
          </Link>
        </div>
      </form>
    </main>
  );
}