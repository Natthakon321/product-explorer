import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getProducts } from "@/lib/products";
import { AuthButtons } from "./auth-buttons";

export default async function HomePage() {
  // ตรวจสอบ Session ของผู้ใช้
  const session = await getServerSession(authOptions);
  const products = getProducts();

  // ตรวจสอบว่าผู้ใช้เข้าสู่ระบบแล้วหรือยัง
  const isLoggedIn = Boolean(session?.user);

  return (
    <main>
      <header>
        <h1>สินค้า</h1>

        <AuthButtons
          isLoggedIn={isLoggedIn}
          userName={session?.user?.name}
        />
      </header>

      <div>
        {products.map((product) => (
          <article key={product.id} data-testid="product">
            <h2>{product.name}</h2>

            <p>{product.description}</p>

            <p>฿{product.price.toLocaleString("th-TH")}</p>

            {/* แสดงลิงก์แก้ไขและลบเฉพาะผู้ที่ล็อกอินแล้ว */}
            {isLoggedIn && (
              <div>
                <Link href={`/products/${product.id}/edit`}>
                  แก้ไข
                </Link>

                {" "}

                <Link href={`/products/${product.id}/delete`}>
                  ลบ
                </Link>
              </div>
            )}
          </article>
        ))}

        {products.length === 0 && <p>ไม่มีสินค้า</p>}
      </div>
    </main>
  );
}