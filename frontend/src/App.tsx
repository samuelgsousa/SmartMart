import React from"react";
import AppRoutes from "./routes/AppRoutes";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
       <h1 className="text-3xl font-bold underline">Smart Mart</h1>
      <AppRoutes />
    </QueryClientProvider>
    )

  }
  
  export default App;