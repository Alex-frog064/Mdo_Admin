import React, { useState } from "react";

export default function TimePicker({ initialOpen, initialClose, onSave }) {
  const [open, setOpen] = useState(initialOpen);
  const [close, setClose] = useState(initialClose);

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-sky-500 mb-1">
          Apertura
        </label>
        <input
          type="time"
          value={open}
          onChange={(e) => setOpen(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-sky-500 mb-1">
          Cierre
        </label>
        <input
          type="time"
          value={close}
          onChange={(e) => setClose(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
      </div>
      <button
        onClick={() => onSave(open, close)}
        className="self-end px-4 py-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition-colors duration-200"
      >
        Guardar
      </button>
    </div>
  );
}