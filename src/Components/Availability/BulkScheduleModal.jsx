import { useState } from "react";
import { X, Calendar, Clock } from "lucide-react";

export default function BulkScheduleModal({ isOpen, onClose, onApply }) {
  const [schedule, setSchedule] = useState({
    open: "09:00",
    close: "18:00",
    period: "week" // "week" o "month"
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[200]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 relative z-10">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="text-gray-400" size={20} />
        </button>

        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Configurar Horario</h3>
          <p className="text-gray-600 mt-2">Define el horario que se aplicará al período seleccionado</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de apertura
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue1" size={18} />
                <input
                  type="time"
                  value={schedule.open}
                  onChange={(e) => setSchedule(prev => ({ ...prev, open: e.target.value }))}
                  className="pl-10 w-full p-3 rounded-xl bg-gray-50/70 focus:ring-2 focus:ring-blue1 border-0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de cierre
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue1" size={18} />
                <input
                  type="time"
                  value={schedule.close}
                  onChange={(e) => setSchedule(prev => ({ ...prev, close: e.target.value }))}
                  className="pl-10 w-full p-3 rounded-xl bg-gray-50/70 focus:ring-2 focus:ring-blue1 border-0"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período de aplicación
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSchedule(prev => ({ ...prev, period: "week" }))}
                className={`p-3 rounded-xl flex items-center justify-center gap-2 transition-all
                  ${schedule.period === "week" 
                    ? "bg-blue1 text-white" 
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}
              >
                <Calendar size={18} />
                Semanal
              </button>
              <button
                onClick={() => setSchedule(prev => ({ ...prev, period: "month" }))}
                className={`p-3 rounded-xl flex items-center justify-center gap-2 transition-all
                  ${schedule.period === "month" 
                    ? "bg-blue1 text-white" 
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}
              >
                <Calendar size={18} />
                Mensual
              </button>
            </div>
          </div>

          <button
            onClick={() => onApply(schedule)}
            className="w-full bg-gradient-to-r from-blue1 to-blue2 text-white py-3 rounded-xl
                     hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
          >
            Aplicar Horario
          </button>
        </div>
      </div>
    </div>
  );
} 