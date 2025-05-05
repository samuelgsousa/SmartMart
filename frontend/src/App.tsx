import React, { useEffect } from"react";
import AppRoutes from "./routes/AppRoutes";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar"
import { useLocation, Link } from "react-router-dom";
import { ArrowLeft, BadgeDollarSign, House, Package, PanelRightClose } from "lucide-react";
import { useSidebar } from '@/components/ui/sidebar'; 

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3 * 60 * 1000, // 3 minutos
      retry: 2, // Tentar 2 vezes em caso de erro
      refetchOnWindowFocus: true // Recarrega ao focar na janela
    }
  }
});

function App() {
  const location = useLocation();
  const { open, setOpen  } = useSidebar();

   useEffect(() => {
     if (open) {
       setOpen(false);
     }
   }, [location.pathname]);

  return(
  <QueryClientProvider client={queryClient}>
      <main className="w-full min-h-screen">

        <div className="flex items-center ml-2 h-12 gap-3">

        <SidebarTrigger>
          <PanelRightClose className="size-7"/>
        </SidebarTrigger>

        <h1 className="text-3xl font-bold pb-1">Smart Mart</h1>
        </div>
      
      
        

    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
        
        <SidebarGroupLabel className="flex-auto justify-between text-lg mb-2 mt-2"> 
            SmartMart 
            <SidebarTrigger ><ArrowLeft className="size-6" /> </SidebarTrigger>   
        </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
            
                <SidebarMenuItem key={"dashboard_item"}>
                  <SidebarMenuButton asChild>
                    <Link to="/"> <House /> <span>Dashboard</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem key={"product_item"}>
                  <SidebarMenuButton asChild>
                    <Link to="/products"> <Package /> <span>Products</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem key={"sales_item"}>
                  <SidebarMenuButton asChild>
                    <Link to="/sales"> <BadgeDollarSign /> <span>Sales</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>

        <AppRoutes />
        </main>

    </QueryClientProvider>
    )

  }
  
  export default App;