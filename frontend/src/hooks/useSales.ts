import { useQuery, useMutation, useQueryClient, useMutationState } from '@tanstack/react-query'
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

      //Mutações

        const createMutation = useMutation({
            mutationFn: SalesService.create,
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['sales'] });
            }
          });
        
          const updateMutation = useMutation({
            mutationFn: (params: { id: number; data: any }) => 
              SalesService.update(params.id, params.data),
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['sales'] });
            }
          });
        
          const deleteMutation = useMutation({
            mutationFn: (id: number) => SalesService.delete(id),
            mutationKey: ['deleteSale'],
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['sales'] });
            }
          });

          const deletingStates = useMutationState({
            filters: { mutationKey: ['deleteSale'] },
            select: (mutation) => ({
              id: mutation.state.variables as number,
              isDeleting: mutation.state.status === 'pending'
            })
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
            deletingStates,
            
            // Erros
            error: salesQuery.error || 
                   createMutation.error || 
                   updateMutation.error || 
                   deleteMutation.error
          };
}