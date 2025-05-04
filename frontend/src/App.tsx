import React from"react";
import AppRoutes from "./routes/AppRoutes";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Sidebar, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Link } from "react-router-dom";

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
        <main>
        <h1 className="text-3xl font-bold underline">Smart Mart</h1>
          <SidebarTrigger />

          <Sidebar>
          <SidebarTrigger />
          <Link to="/">Dashboard</Link>
          <Link to="/products">Products</Link>

          
          </Sidebar>

        <AppRoutes />
        </main>
      </SidebarProvider>

    </QueryClientProvider>
    )

  }
  
  export default App;