export interface Product {

    id: number
    name: string
    description: string
    price: number
    category_id: number
    category_name: string
    brand: string
  }

export interface Sale {
    id: number
    product_name: string
    total_price: number
    quantity: number
    date: Date
}