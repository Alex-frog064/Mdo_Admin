import React, { useState } from "react";
import { Clock } from "lucide-react";

export default function TimePicker({ initialOpen, initialClose, onSave }) {
  const [open, setOpen] = useState(initialOpen);
  const [close, setClose] = useState(initialClose);

  return (
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
              value={open}
              onChange={(e) => setOpen(e.target.value)}
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
              value={close}
              onChange={(e) => setClose(e.target.value)}
              className="pl-10 w-full p-3 rounded-xl bg-gray-50/70 focus:ring-2 focus:ring-blue1 border-0"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onSave(open, close)}
          className="px-6 py-3 bg-gradient-to-r from-blue1 to-blue2 text-white rounded-xl
                   hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
        >
          Guardar Horario
        </button>
      </div>
    </div>
  );
}