import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface LayoutProps {
    children: React.ReactNode;
  }
  export function Layout({ children }: LayoutProps) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-4">
              <SidebarTrigger className="mb-4 md:hidden" />
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </SidebarProvider>
    );
  }