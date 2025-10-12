// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { LogoutButton } from "@/components/ui/Button/LogoutBtn";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    // User not logged in → redirect to home
    return (
      <div className="flex items-center justify-center h-screen">
        <p>You must log in to access this page.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">Welcome to your Dashboard 🎉</h1>
      <LogoutButton />
    </div>
  );
}
