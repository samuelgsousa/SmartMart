import { useQuery, useQueryClient } from '@tanstack/react-query';
import ProductsService from "../services/products.service"

export const useProducts = () => {
    const query = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await ProductsService.getAll();
            if (!response) throw new Error('Erro ao carregar produtos');
            return response;
        },
        keepPreviousData: true, // Mantém dados anteriores durante o carregamento
        // Configuração de cache
        staleTime: 60 * 1000 // 1 minuto
    })

    return {
        products: query?.data || [],
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        refetch: query.refetch,
    }
}
