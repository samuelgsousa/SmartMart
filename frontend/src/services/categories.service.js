import httpClient from "./httpClient";

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
    }
}

export default CategoriesService