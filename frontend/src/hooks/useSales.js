import { useQuery, useQueryClient } from '@tanstack/react-query';
import SalesService from "../services/sales.service" 

export const useSales = () => {
    const queryClient = useQueryClient();



    const query = useQuery({
        queryKey: ['sales'],
        queryFn: async () => {
            const response = await SalesService.getAll();
            if (!response) throw new Error('Erro ao carregar vendas!');
            return response;
        },
        keepPreviousData: true, // Mantém dados anteriores durante o carregamento
        // Configuração de cache
        staleTime: 60 * 1000 // 1 minuto
    })

    const deleteSale = async (sale_id) => {
        try {
            const response = await SalesService.delete(sale_id)
            query.refetch()
            return response;
            
        } catch (error) {
            throw new Error(error)
        }
        
    }

    return {
        sales: query?.data || [],
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        refetch: query.refetch,
        deleteSale
    }
}