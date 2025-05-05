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
  

import {useSales} from '../hooks/useSales'
import SalesForm from '@/components/forms/SalesForm';
import { Button } from '@/components/ui/button';
import { Trash2, Pencil, Loader2   } from "lucide-react";
import { formatPrice } from '@/utils/formatUtils';


const Sales = () => {

    const {sales, isLoading, isFetching, isError, deleteSale, deletingStates} = useSales()
    const [saleUpdating, setSaleUpdating] = useState(null)
    const [DialogIsOpen, setDialogIsOpen] = useState(false)

    // Função auxiliar para verificar o estado ao deletar um produto
    const isDeleting = (saleId: number) => deletingStates.some(state => state.id === saleId && state.isDeleting);

    const handleSaleUpdate = (sale: any) => {
        //console.log("venda: ", sale)
        setSaleUpdating(sale)
        setDialogIsOpen(true)
    }

    const handleNewSale = () => {
        setSaleUpdating(null)
        setDialogIsOpen(true)
    }

    return (
        <div className="pl-3 mt-3 mb-3 pr-3">
        
        <h1 className="text-3xl font-bold mb-4">Sales</h1>

        <Button variant="success" onClick={() => handleNewSale()}>New Sale</Button>
        
        <div className="rounded-md border mt-3">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead key={"sale_id"}>Sale Id</TableHead>
                        <TableHead key={"product_name"}>Product Name</TableHead>
                        <TableHead key={"total_price"}>Total Price</TableHead>
                        <TableHead key={"quantity"}>Quantity</TableHead>
                        <TableHead key={"date"}>Date</TableHead>
                        <TableHead key={"actions"}>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {sales.map((sale, index) => (
                    <TableRow className={`${index % 2 === 0 ? 'bg-emerald-200/90' : 'bg-emerald-300/70'} hover:bg-emerald-400`} key={sale.id}>
                        <TableCell className='flex pl-4 text-base' key={"sale_id"}>{sale.id}</TableCell>
                        <TableCell key={"product_name_cell"}>{sale.product_name}</TableCell>
                        <TableCell key={"total_price_cell"}>{formatPrice(sale.total_price)}</TableCell>
                        <TableCell key={"quantity_cell"}>{sale.quantity}</TableCell>
                        <TableCell key={"date"}>{new Date(sale.date).toLocaleDateString()}</TableCell>
                        <TableCell className="flex gap-2" key={`action_buttons_${sale.id}`}>
                            <Button  variant="destructive" size="icon" onClick={() => deleteSale(sale.id)} disabled={isDeleting(sale.id)}>
                                {isDeleting(sale.id) ?
                                ( <Loader2 className="animate-spin"/>)
                                :
                                (<Trash2 className="h-5 w-5"/>)
                                }
                            </Button>
                            <Button variant="warning" size="icon" onClick={() => handleSaleUpdate(sale)}>
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
                <DialogHeader><DialogTitle>{saleUpdating ? `Update sale ${saleUpdating.id}` : 'New Sale'}</DialogTitle></DialogHeader>

                <SalesForm saleUpdating={saleUpdating} onSuccess={() => setDialogIsOpen(false)}/>

            </DialogContent>
        </Dialog>


      
        </div>
  );
  };
  
export default Sales;