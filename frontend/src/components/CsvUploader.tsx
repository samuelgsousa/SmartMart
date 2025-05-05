import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { parse } from 'papaparse'
import { useProducts } from '@/hooks/useProducts'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CsvLineError } from '@/utils/csvUtils'
import { Loader2 } from 'lucide-react'


export function CsvUploader() {
  const [previewData, setPreviewData] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const[bulkErrors, setBulkErrors] = useState<any[]>([])

  const { bulkCreate, isBulking} = useProducts()

  const [csvFile, setCsvFile] = useState<File | null>(null)

  useEffect(() => {

    console.log("preview Data: ", previewData)
    
    }, [previewData])

  const onSubmit = async () => {
      // Enviar para API
      if (!csvFile) return

      try {
        const formData = new FormData()
        formData.append('file', csvFile)

        setBulkErrors([])
        
        const resposta = await bulkCreate(formData)

        if(resposta) setPreviewData([])
        
      } catch (error) {

        console.error('Erro no envio:', error)

        if (error instanceof CsvLineError) { 
          console.error(error.message);  
          console.error(error.lineErros);     
          console.error(error.total_erros);
          
          setBulkErrors(error.lineErros)
          setPreviewData([])
          setCsvFile(null)
        }
      }
  }

 
  


  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsProcessing(true)
    
    try {
      setCsvFile(file)
      // Ler e parsear o CSV
      const results = await new Promise<any>((resolve, reject) => {
        parse(file, {
          header: true,
          complete: (results) => resolve(results.data),
          error: reject
        })
      })

      // Validação básica
      if (!results.length || !results[0].name) {
        throw new Error('Formato de CSV inválido')
      }

      // Mostrar preview
      setPreviewData(results)
      setBulkErrors([])

      
    } catch (error) {
      console.error('Erro no processamento:', error)
      alert(error instanceof Error ? error.message : 'Erro desconhecido')
    } finally {
      setIsProcessing(false)
    }
  }, [bulkCreate])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1,
    disabled: isProcessing
  })

  return (
    <div className="space-y-4 ">
      <div 
        {...getRootProps()}
        className={`w-100 h-40 m-auto mb-5 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          ${isDragActive ? 'border-primary bg-muted' : 'border-muted-foreground'}`}
      >
        <input {...getInputProps()} />
        
        {isProcessing ? (
          <div className="text-muted-foreground">
            Processando arquivo...
          </div>
        ) : (
          <div>
            <p className="text-muted-foreground">
              {isDragActive 
                ? 'Solte o arquivo CSV aqui' 
                : 'Arraste ou clique para selecionar um CSV'}
            </p>
            <Button 
              type="button"
              variant="outline"
              className="mt-4"
            >
              Selecionar Arquivo
            </Button>
          </div>
        )}
      </div>

      {previewData?.length > 0 && (
        <>
        <div className='flex gap-3'>

        <Button variant='success' className='w-20' onClick={() => onSubmit()} disabled={isBulking}>
          
          {isBulking ? (<Loader2 className="animate-spin"/>):(<>Enviar</>)}
        </Button>
        
        <Button variant="destructive" onClick={() => {
            setCsvFile(null)
            setPreviewData(null)
            }} disabled={isBulking}>Limpar</Button>

        </div>


        <div className="rounded-md border">
          <Table>
          <TableHeader>
              <TableRow>
                <TableHead key={"csv_line_head"}>Line</TableHead>
                <TableHead key={"product_name_head"}>Name</TableHead>
                <TableHead key={"description_head"}>Description</TableHead>
                <TableHead key={"price_head"}>Price</TableHead>
                <TableHead key={"category_head"}>Category_id</TableHead>
                <TableHead key={"brand_head"}>Brand</TableHead>
              </TableRow>
          </TableHeader>

          <TableBody>
            {previewData?.map((produto, index) => (
              <TableRow className={`${index % 2 === 0 ? 'bg-amber-500/40' : 'bg-amber-600/50'} hover:bg-amber-500`} key={index + 2}>
                <TableCell className='pl-3 text-base'>{index + 2}</TableCell>
                <TableCell>{produto.name}</TableCell>
                <TableCell>{produto.description}</TableCell>
                <TableCell>{produto.price}</TableCell>
                <TableCell>{produto.category_id}</TableCell>
                <TableCell>{produto.brand}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </div>

          
   
        </>

      )}
        
       {bulkErrors?.lineErros?.length > 0 && (
        
               <>
                    <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead key={"csv_line_head"}>Line</TableHead>
                            <TableHead key={"product_name_head"}>Product Name</TableHead>
                            <TableHead key={"error_head"}>Error</TableHead>
                            <TableHead key={"category_head"}>Category</TableHead>
                            <TableHead key={"price_head"}>Price</TableHead>
                            <TableHead key={"brand_head"}>Brand</TableHead>
                            <TableHead key={"description_head"}>Description</TableHead>
                        </TableRow>
                    </TableHeader>

                   <TableBody>
                   {bulkErrors?.lineErros?.map((erro, index) => (
                        <TableRow key={index}>
                          <TableCell>{erro.linha}</TableCell>
                          <TableCell>{erro.dados.name}</TableCell>
                          <TableCell className="text-red-600">{erro.erro}</TableCell>
                          <TableCell>{erro.valor_category_id}</TableCell>
                          <TableCell>{erro.dados.price}</TableCell>
                          <TableCell>{erro.dados.brand}</TableCell>
                          <TableCell>{erro.dados.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                </Table>

                <Button variant="destructive" onClick={() => setBulkErrors([])}>Ignorar</Button>
               
               </>
      )} 

    </div>
  )
}