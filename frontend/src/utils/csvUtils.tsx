export const convertArrayToCsv = (data: any[]) => {
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(obj => Object.values(obj).join(','))
    return [headers, ...rows].join('\n')
  }

export class CsvLineError extends Error {
  constructor(
    public message: string,
    public lineErros: any,
    public total_erros?: any
  ) {
    super(message);
    this.name = "CsvLineError";
  }
}