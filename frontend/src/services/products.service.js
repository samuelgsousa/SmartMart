import httpClient from "./httpClient";

const ProductsService = {
    getAll: async () => {
        try {
            const response = await httpClient.get('/produtos')
            return response.data
        } catch (error) {
            console.error('Erro ao buscar produtos', error)
            throw new Error(error)
        }
    },
    create: async (data) => {
        try {
            const response = await httpClient.post('/produtos', data);
            return response
        } catch (error) {
            console.error('Erro ao cadastrar produto!', error);
            throw new Error(error)
        }
    },
}

export default ProductsService