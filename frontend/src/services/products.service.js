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
    bulkCreate: async (formData) =>{

        const response = await httpClient.post('/produtos/bulk', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          return response.data
    },

    update: async (product_id, data) => {
        try {
            const response = await httpClient.put(`/produtos/${product_id}`, data);
            return response
        } catch (error) {
            console.error(`Erro ao atualizar produto ${product_id}`, error);
            throw new Error(error)
        }
    },
    delete: async (product_id) => {
        try {
            const response = await httpClient.delete(`/produtos/${product_id}`)
            return response
        } catch (error) {
            console.error('Erro ao deletar produto!', error);
            throw new Error(error.response.data.detail)
        }
    }
}

export default ProductsService