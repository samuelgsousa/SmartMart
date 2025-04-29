
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
import { format } from "date-fns"
import SalesService from "../../services/sales.service"
import {useSales} from '../../hooks/useSales'



const formSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
  })

const SalesForm = () => {

    const {refetch} = useSales()

    const form = useForm()

    const onSubmit = async (data) => {

        console.log("dados a serem enviados: ", data)

        try {
            const response = await SalesService.create(data)

            if (response) refetch()

            console.log(response)
        } catch (error) {
            console.log('Erro ao enviar venda')
        }
    }

    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="product_id"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Product</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a product" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="1">Monitor 4k</SelectItem>
                                <SelectItem value="2">iPhone 15</SelectItem>
                            </SelectContent>
                        </Select>
                    <FormMessage />
                </FormItem>
            )}
            />

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

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
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
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                        const isoDate = date?.toISOString().split('T')[0];
                        field.onChange(isoDate);
                      }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
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