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

import {useProducts} from '../hooks/useProducts'
import { Button } from '@/components/ui/button';
import ProductsForm from '@/components/forms/ProductsForm';
import { Trash2, Pencil, Loader2   } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CsvUploader } from '@/components/CsvUploader';


const Products = () => {

    const {products, deleteProduct, deletingStates} = useProducts()
    const [productUpdating, setProductUpdating] = useState(null)
    const [DialogIsOpen, setDialogIsOpen] = useState(false)

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

    const TabProducts = () => {
        return (
            <>
            <Table>
            <TableHeader>
                <TableRow>
                    <TableHead key={"product_id_head"}>Product Id</TableHead>
                    <TableHead key={"product_name_head"}>Product Name</TableHead>
                    <TableHead key={"description_head"}>Description</TableHead>
                    <TableHead key={"price_head"}>Price</TableHead>
                    <TableHead key={"category_head"}>Category</TableHead>
                    <TableHead key={"brand_head"}>Brand</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {products.map(product => (
                    <TableRow key={`product_row_${product.id}`}>
                        <TableCell key={`product_id_${product.id}`}>{product.id}</TableCell>
                        <TableCell key={`product_name_${product.id}`}>{product.name}</TableCell>
                        <TableCell key={`product_description_${product.id}`}>{product.description}</TableCell>
                        <TableCell key={`product_price_${product.id}`}>{product.price}</TableCell>
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

        <Button variant="success" onClick={() => handleNewProduct()}>New Product</Button>

        <Dialog open={DialogIsOpen} onOpenChange={setDialogIsOpen}>


        <DialogContent>
            <DialogHeader><DialogTitle>{productUpdating ? `Update product ${productUpdating.id}` : 'New Product'}</DialogTitle></DialogHeader>

            <ProductsForm productUpdating={productUpdating} onSuccess={() => setDialogIsOpen(false)}/>

        </DialogContent>
        </Dialog>
            </>
        )
}


    return (
        <>

        
        <Tabs defaultValue="products_tab" >
        <TabsList>
            <TabsTrigger value="products_tab">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="csv_uploader">CSV Uploader</TabsTrigger>
        </TabsList>
        <TabsContent value="products_tab"> <TabProducts/> </TabsContent>
        
        <TabsContent value="categories">Categorias ficarão aqui</TabsContent>
        <TabsContent value="csv_uploader"> <CsvUploader/> </TabsContent>
        </Tabs>

       

            


        </>
    )
}

export default Products