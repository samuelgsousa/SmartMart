import { useState, useEffect  } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from "date-fns";


interface DatePickerProps {
    value?: string; // Recebe no formato ISO (ex: "2024-05-20")
    onChange?: (value: string) => void; // Retorna no formato ISO
  }

const DatePicker = ({ value, onChange }: DatePickerProps) => {

    const [internalDate, setInternalDate] = useState<Date | null>(value ? parseISO(value) : null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weeks = [];
  let week: Date[] = [];

  daysInMonth.forEach((day, index) => {
    week.push(day);
    if ((index + 1) % 7 === 0) {
      weeks.push(week);
      week = [];
    }
  });

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  useEffect(() => {
    if (value) {
      setInternalDate(parseISO(value));
      setCurrentMonth(parseISO(value));
    }
  }, [value]);

  const handleDateSelect = (date: Date) => {
    setInternalDate(date)           // atualiza o texto no input
    setSelectedDate(date)           // atualiza o destaque no calendário
    onChange?.(date.toISOString())  // informa o RHF / parent component
    setIsOpen(false)
  }


  return (
    <div className="relative w-64">
        <input
        type="text"
        readOnly
        value={internalDate ? format(internalDate, "dd/MM/yyyy") : ""}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
        placeholder="Selecione uma data"
      ></input>

      {isOpen && (
        <div className="absolute bottom-full mb-2 bg-white border rounded-lg shadow-lg p-4 z-50">
          {/* Header do calendário */}
          <div className="flex justify-between items-center mb-4">
            <button
            type="button"
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded"
            >
              ←
            </button>
            <span className="font-semibold">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <button
            type="button"
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded"
            >
              →
            </button>
          </div>

          {/* Dias da semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>

          {/* Dias do mês */}
          <div className="grid grid-cols-7 gap-1">
            {weeks.flat().map((date, index) => (
              <button
                key={index}
                onClick={() => handleDateSelect(date)}
                className={`
                  w-8 h-8 rounded
                  text-sm
                  ${isSameMonth(date, currentMonth) ? "text-gray-900" : "text-gray-400"}
                  ${selectedDate && isSameDay(date, selectedDate) ? "bg-blue-500 text-white" : "hover:bg-gray-100"}
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                `}
                disabled={!isSameMonth(date, currentMonth)}
              >
                {format(date, "d")}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DatePicker