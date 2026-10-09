"use client";

import { signIn, signOut } from "next-auth/react";

type AuthButtonsProps = {
  isLoggedIn: boolean;
  userName?: string | null;
};

export function AuthButtons({ isLoggedIn, userName }: AuthButtonsProps) {
  if (isLoggedIn) {
    return (
      <div>
        <span>สวัสดี {userName ?? "ผู้ใช้งาน"}</span>

        <button type="button" onClick={() => signOut({ callbackUrl: "/" })}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/" })}
    >
      Login with Google
    </button>
  );
}