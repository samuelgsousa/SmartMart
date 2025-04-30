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

    const createSale = async (data) => {
        try {
            const response = await SalesService.create(data)
            query.refetch()
            return response;
            
        } catch (error) {
            alert(`Erro ao registrar venda! ${error}`)
        }
    }

    const updateSale = async (sale_id, data) => {
        try {
            const response = await SalesService.update(sale_id, data)
            query.refetch()
            return response;
            
        } catch (error) {
            alert(`Erro ao atualizar a venda ${sale_id} ${error}`)
        }
    }

    const deleteSale = async (sale_id) => {
        try {
            const response = await SalesService.delete(sale_id)
            query.refetch()
            return response;
            
        } catch (error) {
            alert(`Erro ao deletar venda! ${error}`)
        }
        
    }

    return {
        sales: query?.data || [],
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        refetch: query.refetch,
        createSale,
        updateSale,
        deleteSale,

    }
}