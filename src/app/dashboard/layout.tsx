import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
        <DashboardHeader />
        <main className="flex-1 p-4 sm:p-6 md:p-8">
            {children}
        </main>
    </div>
  );
}
