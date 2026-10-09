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
  const deleteAction = deleteProductAction.bind(null, product.id);

  return (
    <main>
      <h1>ยืนยันการลบ</h1>

      <p>ต้องการลบสินค้า “{product.name}” หรือไม่?</p>

      <div>
        <form action={deleteAction}>
          <button type="submit">ยืนยันการลบ</button>
        </form>

        <Link href="/">ยกเลิก</Link>
      </div>
    </main>
  );
}