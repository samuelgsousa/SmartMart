import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ProductsService from "../services/products.service"
import {Product}  from "@/interfaces/interfaces"

export const useProducts = () => {
    const queryClient = useQueryClient();

    // Query para listagem
    const productsQuery = useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: ProductsService.getAll,
        staleTime: 60_000
    });

    // Mutações

    const createMutation = useMutation({
        mutationFn: ProductsService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        }
        });

    const updateMutation = useMutation({
        mutationFn: (params: { id: string; data: any }) => 
            ProductsService.update(params.id, params.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        }
        });

    const deleteMutation = useMutation({
    mutationFn: (id: string) => ProductsService.delete(id),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] });
    }
    });

    return {
        // Query
        sales: productsQuery.data || [],
        isLoading: productsQuery.isLoading,
        isFetching: productsQuery.isFetching,
        
        // Mutations
        createSale: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        
        updateSale: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        
        deleteSale: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
        
        // Erros
        error: productsQuery.error || 
               createMutation.error || 
               updateMutation.error || 
               deleteMutation.error
      };
}
