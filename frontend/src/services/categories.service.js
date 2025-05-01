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
    }
}

export default CategoriesService