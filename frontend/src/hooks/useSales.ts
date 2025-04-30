import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import SalesService from "../services/sales.service"
import {Sale}  from "@/interfaces/interfaces"

export const useSales = () => {
    const queryClient = useQueryClient();

     // Query para listagem
        const salesQuery = useQuery<Sale[]>({
            queryKey: ['sales'],
            queryFn: SalesService.getAll,
            staleTime: 60_000
        });

        const createMutation = useMutation({
            mutationFn: SalesService.create,
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['sales'] });
            }
          });
        
          const updateMutation = useMutation({
            mutationFn: (params: { id: string; data: any }) => 
              SalesService.update(params.id, params.data),
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['sales'] });
            }
          });
        
          const deleteMutation = useMutation({
            mutationFn: (id: string) => SalesService.delete(id),
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['sales'] });
            }
          });

          return {
            // Query
            sales: salesQuery.data || [],
            isLoading: salesQuery.isLoading,
            isFetching: salesQuery.isFetching,
            
            // Mutations
            createSale: createMutation.mutateAsync,
            isCreating: createMutation.isPending,
            
            updateSale: updateMutation.mutateAsync,
            isUpdating: updateMutation.isPending,
            
            deleteSale: deleteMutation.mutateAsync,
            isDeleting: deleteMutation.isPending,
            
            // Erros
            error: salesQuery.error || 
                   createMutation.error || 
                   updateMutation.error || 
                   deleteMutation.error
          };
}