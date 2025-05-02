import { useQuery, useMutation, useQueryClient, useMutationState } from '@tanstack/react-query';
import ProductsService from "../services/products.service"
import {Product}  from "@/interfaces/interfaces"
import { convertArrayToCsv } from '@/utils/csvUtils';

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
        mutationFn: (params: { id: number; data: any }) => 
            ProductsService.update(params.id, params.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        }
        });

    const deleteMutation = useMutation({
    mutationFn: (id: number) => ProductsService.delete(id),
    mutationKey: ['deleteProduct'],
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] });
    }
    });

    const deletingStates = useMutationState({
        filters: { mutationKey: ['deleteProduct'] },
        select: (mutation) => ({
          id: mutation.state.variables as number,
          isDeleting: mutation.state.status === 'pending'
        })
      });

      const { mutateAsync: bulkCreate } = useMutation({
        mutationFn: async (products: any) => {
          // Converter array para CSV 
          const csv = convertArrayToCsv(products)
          
          const formData = new FormData()
          const csvBlob = new Blob([csv], { type: 'text/csv' });
    
          // Adiciona o arquivo com nome específico
          formData.append('file', csvBlob, 'products.csv');
          
          const response = await ProductsService.bulkCreate(formData)
          return response
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['products'] })
        }
      })

    return {
        // Query
        products: productsQuery.data || [],
        isLoading: productsQuery.isLoading,
        isFetching: productsQuery.isFetching,
        bulkCreate,
        
        // Mutations
        createProduct: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
        
        updateProduct: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        
        deleteProduct: deleteMutation.mutate,
        deletingStates,
        
        // Erros
        error: productsQuery.error || 
               createMutation.error || 
               updateMutation.error || 
               deleteMutation.error
      };

      
}
