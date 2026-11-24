import { Suspense } from "react";
import DashboardNavbar from "@/components/Layout/dashboard/ui/DashboardNavbar";
import DashboradSidebar from "@/components/Layout/dashboard/ui/DashboradSidebar";

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="">
        <Suspense fallback={null}>
          <DashboradSidebar />
        </Suspense>
      </div>

      {/* Right Section */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar */}
        <div className="">
          <Suspense fallback={null}>
            <DashboardNavbar />
          </Suspense>
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-5">
          {children}
        </main>
      </div>
    </div>
  )
}