import React, { useState } from "react";

const TimePicker = ({ initialOpen, initialClose, onSave }) => {
  const [open, setOpen] = useState(initialOpen);
  const [close, setClose] = useState(initialClose);

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Apertura</label>
          <input
            type="time"
            value={open}
            onChange={(e) => setOpen(e.target.value)}
            className="border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cierre</label>
          <input
            type="time"
            value={close}
            onChange={(e) => setClose(e.target.value)}
            className="border rounded-lg p-2"
          />
        </div>
      </div>
      <button
        onClick={() => onSave(open, close)}
        className="bg-green-500 text-white px-4 py-2 rounded-lg"
      >
        Guardar
      </button>
    </div>
  );
};

export default TimePicker;