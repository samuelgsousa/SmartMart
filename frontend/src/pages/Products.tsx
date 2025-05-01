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

const Products = () => {

    const {products} = useProducts()
    const [DialogIsOpen, setDialogIsOpen] = useState(false)

    const handleNewProduct = () => {
        setDialogIsOpen(true)
    }

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
                    </TableRow>

                ))}
            </TableBody>
        </Table>

        <Button variant="success" onClick={() => handleNewProduct()}>New Product</Button>

        <Dialog open={DialogIsOpen} onOpenChange={setDialogIsOpen}>


        <DialogContent>
            <DialogHeader><DialogTitle>New Product</DialogTitle></DialogHeader>

            <ProductsForm productUpdating={null} onSuccess={undefined}/>

        </DialogContent>
        </Dialog>

        </>
    )
}

export default Products