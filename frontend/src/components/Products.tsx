import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle,
} from "@/components/ui/dialog"

import { Button } from '@/components/ui/button';
import ProductsForm from '@/components/forms/ProductsForm';
import { Trash2, Pencil, Loader2  } from "lucide-react";
import { formatPrice } from '@/utils/formatUtils';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';

const TabProducts = () => {

    const {products, deleteProduct, deletingStates} = useProducts()
    const {categories} = useCategories()
    
    const [DialogIsOpen, setDialogIsOpen] = useState(false)
    const [productUpdating, setProductUpdating] = useState(null)
    const [categoryFilter, setCategoryFilter] = useState<string>('All categories')
    const [filteredProducts, setFilteredProducts] = useState(products)

    useEffect(() => {
        
    if (categoryFilter != "All categories") setFilteredProducts(products.filter(product => String(product.category_id) === categoryFilter))
        else setFilteredProducts(products)
      }, [categoryFilter, products]); //sempre que o valor do select de filtro muda, ele filtra os produtos para a categoria equivalente

    const handleNewProduct = () => {
        setProductUpdating(null)
        setDialogIsOpen(true)
    }

    const handleProductUpdate = (product) => {
        setProductUpdating(product)
        setDialogIsOpen(true)
    }

    // Função auxiliar para verificar o estado ao deletar um produto
    const isDeleting = (productId: number) => deletingStates.some(state => state.id === productId && state.isDeleting);

        return (
            <>
            

            <div className='w-100 mb-2'>

            <label htmlFor="categories_filter" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Filter by category</label>

            <div className='flex gap-4 items-center'>
                <select onChange={(e) => setCategoryFilter(e.target.value)} value={categoryFilter} id="categories_filter" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option>All categories</option> 
                    {categories?.map(category => (
                         <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                </select>

                <Button variant="success" onClick={() => handleNewProduct()}>New Product</Button>
            </div>

            


            </div>



        <div className="rounded-md border">
            <Table >
                <TableHeader>
                    <TableRow className="[&_th]:bg-muted/50 [&_th]:hover:bg-muted">
                        <TableHead key={"product_id_head"}>Product Id</TableHead>
                        <TableHead key={"product_name_head"}>Product Name</TableHead>
                        <TableHead key={"description_head"}>Description</TableHead>
                        <TableHead key={"price_head"}>Price</TableHead>
                        <TableHead key={"category_head"}>Category</TableHead>
                        <TableHead key={"brand_head"}>Brand</TableHead>
                        <TableHead key={"actions_head"}>Actions</TableHead>
                    </TableRow>
                </TableHeader>
            {/* hover:bg-indigo-300 */}
                <TableBody>
                    {filteredProducts.map((product, index) => (
                        <TableRow className={`${index % 2 === 0 ? 'bg-indigo-100' : 'bg-indigo-200'} hover:bg-indigo-300`} key={`product_row_${product.id}`}>
                            <TableCell className='flex justify-center text-base' key={`product_id_${product.id}`}>{product.id}</TableCell>
                            <TableCell key={`product_name_${product.id}`}>{product.name}</TableCell>
                            <TableCell key={`product_description_${product.id}`}>{product.description}</TableCell>
                            <TableCell key={`product_price_${product.id}`}>{formatPrice(product.price)}</TableCell>
                            <TableCell key={`product_${product.id}_category`}>{product.category_name}</TableCell>
                            <TableCell key={`product_brand_${product.id}`}>{product.brand}</TableCell>
                            <TableCell className="flex gap-2" key={`action_buttons_${product.id}`}>
                                <Button variant="destructive" size="icon" onClick={() => deleteProduct(product.id)} disabled={isDeleting(product.id)}>
                                {isDeleting(product.id) ?
                                ( <Loader2 className="animate-spin"/>)
                                :
                                (<Trash2 className="h-5 w-5"/>)
                                }
            
            
                                </Button>
                                <Button variant="warning" size="icon" onClick={() => handleProductUpdate(product)}>
                                    <Pencil className="h-5 w-5" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>

        

        <Dialog open={DialogIsOpen} onOpenChange={setDialogIsOpen}>


        <DialogContent>
            <DialogHeader><DialogTitle>{productUpdating ? `Update product ${productUpdating.id}` : 'New Product'}</DialogTitle></DialogHeader>

            <ProductsForm productUpdating={productUpdating} onSuccess={() => setDialogIsOpen(false)}/>

        </DialogContent>
        </Dialog>
            </>
        )
}

export default TabProducts