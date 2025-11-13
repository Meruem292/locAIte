import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar, SidebarInset } from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardSidebar />
        <SidebarInset>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </div>
  );
}
