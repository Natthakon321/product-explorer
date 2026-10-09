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
  const updateAction = updateProductAction.bind(null, product.id);

  return (
    <main>
      <h1>แก้ไขสินค้า</h1>

      <form action={updateAction}>
        <div>
          <label htmlFor="name">ชื่อสินค้า</label>
          <input
            id="name"
            name="name"
            defaultValue={product.name}
            required
          />
        </div>

        <div>
          <label htmlFor="price">ราคา</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={product.price}
            required
          />
        </div>

        <div>
          <label htmlFor="description">รายละเอียด</label>
          <textarea
            id="description"
            name="description"
            defaultValue={product.description}
            required
          />
        </div>

        <div>
          <button type="submit">บันทึก</button>
          <Link href="/">ยกเลิก</Link>
        </div>
      </form>
    </main>
  );
}