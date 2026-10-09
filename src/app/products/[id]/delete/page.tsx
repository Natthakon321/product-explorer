import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { getProduct } from "@/lib/products";
import { deleteProductAction } from "@/app/actions";

type DeleteProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DeleteProductPage({
  params,
}: DeleteProductPageProps) {
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
  const action = deleteProductAction.bind(null, String(product.id));

  return (
    <main className="mx-auto max-w-xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">ยืนยันการลบสินค้า</h1>

      <p>
        คุณต้องการลบสินค้า <strong>“{product.name}”</strong> หรือไม่?
      </p>

      <p className="text-sm text-gray-600">
        การดำเนินการนี้จะลบสินค้าออกจากรายการ
      </p>

      <div className="flex gap-3">
        <form action={action}>
          <button
            type="submit"
            className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
          >
            ยืนยันการลบ
          </button>
        </form>

        <Link
          href="/"
          className="rounded-lg border px-5 py-2 hover:bg-gray-100"
        >
          ยกเลิก
        </Link>
      </div>
    </main>
  );
}