"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { deleteProduct, updateProduct } from "@/lib/products";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ตรวจสอบว่าผู้ใช้เข้าสู่ระบบแล้วหรือยัง
async function requireUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

// แก้ไขสินค้า
export async function updateProductAction(
  id: string,
  formData: FormData
) {
  // ตรวจสอบ Session ก่อนอนุญาตให้แก้ไข
  await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number(formData.get("price"));

  // ตรวจสอบข้อมูล
  if (!name || !description) {
    throw new Error("กรุณากรอกข้อมูลให้ครบ");
  }

  if (!Number.isFinite(price) || price < 0) {
    throw new Error("ราคาไม่ถูกต้อง");
  }

  // บันทึกการแก้ไขสินค้า
  updateProduct(id, {
    name,
    description,
    price,
  });

  // อัปเดตข้อมูลหน้าแรก
  revalidatePath("/");

  // กลับไปหน้าแรก
  redirect("/");
}

// ลบสินค้า
export async function deleteProductAction(id: string) {
  // ตรวจสอบ Session ก่อนอนุญาตให้ลบ
  await requireUser();

  deleteProduct(id);

  // อัปเดตข้อมูลหน้าแรก
  revalidatePath("/");

  // กลับไปหน้าแรก
  redirect("/");
}