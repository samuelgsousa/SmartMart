import httpClient from "./httpClient";
import {useSales} from '../hooks/useSales'

const {refetch} = useSales()

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
            refetch();

            return response
        } catch (error) {
            console.error('Erro ao registrar nova venda!', error);
            return error;
        }
    }
}

export default SalesService