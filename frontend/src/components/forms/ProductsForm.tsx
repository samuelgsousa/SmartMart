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
import {useProducts} from '../../hooks/useProducts'
import { Product } from "@/interfaces/interfaces"

const formSchema = z.object({
    name: z.string({
        message: "Digite um nome"// Se não for número
      }),

    price: z.coerce
    .number({
      invalid_type_error: "Preço deve ser um número",
    })
    .positive("Preço não pode ser negativo"),

    category_id: z.coerce    .number({
        invalid_type_error: "Selecione uma categoria válida!", // Se não for número
      })
      .positive("Selecione uma categoria!")
      .min(1, "Selecione uma categoria!"),

    brand: z.string({
        message: "Digite uma marca!"// Se não for número
      }),

  })

const ProductsForm = ({productUpdating, onSuccess}) => {


}

export default ProductsForm