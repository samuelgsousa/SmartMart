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


export function CsvUploader() {
  const [previewData, setPreviewData] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const[bulkErrors, setBulkErrors] = useState([])

  const { bulkCreate} = useProducts()

  const [csvFile, setCsvFile] = useState<File | null>(null)

  useEffect(() => {

    console.log("Teste da variável: ", bulkErrors)
    
    }, [bulkErrors])

  const onSubmit = async () => {
      // Enviar para API
      if (!csvFile) return

      try {
        const formData = new FormData()
        formData.append('file', csvFile)
        
        const resposta = await bulkCreate(formData)
        
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
      setPreviewData(results.slice(0, 5))

      
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
    <div className="space-y-4">
      <div 
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
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
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Preview (primeiras 5 linhas):</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {Object.keys(previewData[0]).map((header) => (
                    <th key={header} className="text-left p-2 border-b">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value: any, i) => (
                      <td key={i} className="p-2 border-b">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button onClick={() => onSubmit()}>Enviar</Button>
          <Button variant="destructive" onClick={() => {
            setCsvFile(null)
            setPreviewData(null)
            }}>Limpar</Button>
        </div>
      )}
        
       {bulkErrors?.lineErros?.length > 0 && (
        
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
      )} 

    </div>
  )
}