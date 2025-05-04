import React from"react";
import AppRoutes from "./routes/AppRoutes";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Link } from "react-router-dom";
import { BadgeDollarSign, House, Package } from "lucide-react";

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

    return(
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <main className="w-full min-h-screen">
        <h1 className="text-3xl font-bold underline">Smart Mart</h1>
          <SidebarTrigger />

    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
        
          <SidebarGroupLabel>  Application <SidebarTrigger /></SidebarGroupLabel>
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
      </SidebarProvider>

    </QueryClientProvider>
    )

  }
  
  export default App;