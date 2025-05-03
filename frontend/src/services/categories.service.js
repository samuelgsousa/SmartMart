import httpClient from "./httpClient";
import { DeleteCategoryError } from '@/utils/Errors';

const CategoriesService = {
    getAll: async () => {
        try {
            const response = await httpClient.get('/categories')
            return response.data
        } catch (error) {
            console.error('Erro ao buscar categorias', error)
            throw new Error(error)
        }
    },
    create: async (data) => {
        try {
            const response = await httpClient.post('/categories', data);
            return response
        } catch (error) {
            console.error('Erro ao buscar categorias', error);
            throw new Error(error)
        }
    },
    update: async (category_id, data) => {
        try {
            const response = await httpClient.put(`/categories/${category_id}`, data);
            return response
        } catch (error) {
            console.error(`Erro ao atualizar categoria ${category_id}`, error);
            throw new Error(error)
        }
    },
    delete: async (category_id) => {
        try {
            const response = await httpClient.delete(`/categories/${category_id}`)
            return response
        } catch (error) {
            
            if (error.response.status == 409) throw new DeleteCategoryError("Erro ao deletar categoria", {
                status: error.response.status,
                detail: error.response.data.detail
            })
            else {
                console.error('Erro ao deletar categoria!', error); 
                 throw new Error (error)
            }
        }
    }
}

export default CategoriesService