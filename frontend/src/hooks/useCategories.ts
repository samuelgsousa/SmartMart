import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import CategoriesService from "../services/categories.service"
import {Category}  from "@/interfaces/interfaces"

export const useCategories = () => {
    const queryClient = useQueryClient();

    // Query para listagem
    const categoriesQuery = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: CategoriesService.getAll,
        staleTime: 60_000
    });

    //Mutações

    const createMutation = useMutation({
        mutationFn: CategoriesService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        }
        });

    return {
        // Query
        categories: categoriesQuery.data || [],
        isLoading: categoriesQuery.isLoading,
        isFetching: categoriesQuery.isFetching,

        // Mutations
        createCategory: createMutation.mutateAsync,
        isCreating: createMutation.isPending
};
}