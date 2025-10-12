"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // NextAuth clears cookies and invalidates session
      await signOut({ redirect: false });

      // Optional: clear any local app state (if you stored custom tokens)
      localStorage.removeItem("token");

      // Redirect to homepage (or login)
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 cursor-pointer text-white rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
};
