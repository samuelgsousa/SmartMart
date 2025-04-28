import httpClient from "./httpClient";

const SalesService = {
    getAll: async () => {
        try {
            const response = await httpClient.get('/sales')
            return response.data
        } catch (error) {
            console.error('Erro ao buscar vendas', error)
            throw new Error(error)
        }
    }
}

export default SalesService