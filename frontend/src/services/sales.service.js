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
    },
    create: async (data) => {
        try {
            const response = await httpClient.post('/sales', data);
            return response
        } catch (error) {
            console.error('Erro ao registrar nova venda!', error);
            throw new Error(error)
        }
    },
    delete: async (sale_id) => {
        try {
            const response = await httpClient.delete(`/sales${sale_id}`)
            return response
        } catch (error) {
            console.error('Erro ao deletar venda!', error);
            throw new Error(error)
        }
    }
}

export default SalesService