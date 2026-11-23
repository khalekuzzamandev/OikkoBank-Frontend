import DashboardNavbar from "@/components/Layout/dashboard/DashboardNavbar";
import DashboradSidebar from "@/components/Layout/dashboard/DashboradSidebar";

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="border-r">
        <DashboradSidebar />
      </div>

      {/* Right Section */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar */}
        <div className="">
         <DashboardNavbar/>
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-5">
          {children}
        </main>
      </div>
    </div>
    )
}