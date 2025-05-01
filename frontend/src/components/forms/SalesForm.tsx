
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { cn } from "@/lib/utils"
import { Calendar } from "../ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format  } from "date-fns"
import {useSales} from '../../hooks/useSales'
import {useProducts} from '../../hooks/useProducts'
import { Product } from "@/interfaces/interfaces"


const formSchema = z.object({
    product_id: z.coerce    .number({
        invalid_type_error: "Selecione um produto válido", // Se não for número
      })
      .positive("Selecione um produto")
      .min(1, "Selecione um produto"),

    total_price: z.coerce
    .number({
      invalid_type_error: "Preço deve ser um número",
    })
    .positive("Preço não pode ser negativo"),

    quantity: z.coerce
    .number({
      invalid_type_error: "Quantidade deve ser um número",
    })
    .int("Quantidade deve ser inteira")
    .positive("Quantidade não pode ser zero")
    .min(1, "Quantidade mínima é 1"),

    date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Formato de data inválido (Use YYYY-MM-DD)",
    })
    .refine(date => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, { message: "Data inválida" })

  })

const SalesForm = ({saleUpdating, onSuccess}) => {

  const {products} = useProducts()
    
  const { createSale, isCreating, updateSale, isUpdating } = useSales();
    

    function getCurrentDateLocal(): string {
        const now = new Date()
        const offsetMinutes = now.getTimezoneOffset()
        const correctedMs = now.getTime() + offsetMinutes * 60 * 10000
        const localDate = new Date(correctedMs)
      
        const iso = localDate.toISOString()      
        return iso.slice(0, 10)                  
      }


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: saleUpdating || {
            product_id: 0,
            total_price: null,
            quantity: null,
            date: getCurrentDateLocal(),
          },
    })

    const onSubmit = async (data) => {
        try {
          if (saleUpdating) await updateSale({ id: saleUpdating.id, data })
          else await createSale(data)
          
          onSuccess()

        } catch (error) {
            alert("Falha ao enviar venda!")
        }
    }

    return (

        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {/* Select do produto */}
          <FormField
            control={form.control}
            name="product_id"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Product</FormLabel>
                        <Select onValueChange={field.onChange} value={String(field.value)}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a product" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="0">Selecione um produto</SelectItem>
                              {products?.map(product => (
                                <SelectItem key={product.id} value={String(product.id)}>{product.name}</SelectItem>
                              ))}
                            </SelectContent>
                        </Select>
                    <FormMessage />
                </FormItem>
            )}
            />
            
        {/* Valor da venda */}
            <FormField
              control={form.control}
              name="total_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Priece</FormLabel>
                  <FormControl>
                    <Input type={"number"} placeholder="value" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
                
              )}
            />

        {/* Quantidade do produto */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                    <FormControl>
                        <Input type={"number"} placeholder="value" {...field} />
                    </FormControl>
                  <FormMessage />
                </FormItem>
                
              )}
            />

            {/* Data da venda */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background z-50" align="start">
                  <Calendar
                    mode="single"
                    selected={null}
                    onSelect={(date) => {
                        const isoDate = date?.toISOString().split('T')[0];
                        field.onChange(isoDate);
                      }}

                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      )
} 

export default SalesForm