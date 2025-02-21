import React, { useState } from "react";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import TimePicker from "./TimePicker";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState({});
  const [editDay, setEditDay] = useState(null);

  const startWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endWeek = endOfWeek(currentDate, { weekStartsOn: 1 });
  const daysOfWeek = eachDayOfInterval({ start: startWeek, end: endWeek });

  const handleAvailabilityChange = (day, open, close) => {
    setAvailability((prev) => ({
      ...prev,
      [format(day, "yyyy-MM-dd")]: { open, close },
    }));
  };

  const applySchedule = (schedule, period) => {
    const newAvailability = { ...availability };
    let startDate, endDate;

    if (period === "week") {
      startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
      endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
    } else if (period === "month") {
      startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
      endDate = addDays(startDate, 30);
    }

    eachDayOfInterval({ start: startDate, end: endDate }).forEach((day) => {
      newAvailability[format(day, "yyyy-MM-dd")] = schedule;
    });

    setAvailability(newAvailability);
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-4 text-center">Calendario de Disponibilidad</h2>

      <div className="flex justify-between items-center w-full max-w-4xl mb-6">
        <button onClick={() => setCurrentDate(addDays(currentDate, -7))} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Semana Anterior
        </button>
        <div className="flex gap-4">
          <button onClick={() => applySchedule({ open: "09:00", close: "18:00" }, "week")} className="bg-green-500 text-white px-4 py-2 rounded-lg">
            Aplicar a toda la semana
          </button>
          <button onClick={() => applySchedule({ open: "10:00", close: "15:00" }, "month")} className="bg-green-500 text-white px-4 py-2 rounded-lg">
            Aplicar a todo el mes
          </button>
        </div>
        <button onClick={() => setCurrentDate(addDays(currentDate, 7))} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Siguiente Semana
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-4xl">
        {daysOfWeek.slice(0, 3).map((day) => (
          <div key={day.toString()} className="p-4 border rounded-lg shadow-md w-full text-center">
            <div className="font-semibold mb-2">{format(day, "EEEE, d MMMM")}</div>
            {editDay && isSameDay(editDay, day) ? (
              <TimePicker
                initialOpen={availability[format(day, "yyyy-MM-dd")]?.open || "09:00"}
                initialClose={availability[format(day, "yyyy-MM-dd")]?.close || "18:00"}
                onSave={(open, close) => {
                  handleAvailabilityChange(day, open, close);
                  setEditDay(null);
                }}
              />
            ) : (
              <div>
                <p>Apertura: {availability[format(day, "yyyy-MM-dd")]?.open || "Cerrado"}</p>
                <p>Cierre: {availability[format(day, "yyyy-MM-dd")]?.close || "Cerrado"}</p>
                <button onClick={() => setEditDay(day)} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg">
                  Editar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-4xl mt-4">
        {daysOfWeek.slice(3).map((day) => (
          <div key={day.toString()} className="p-4 border rounded-lg shadow-md w-full text-center">
            <div className="font-semibold mb-2">{format(day, "EEEE, d MMMM")}</div>
            {editDay && isSameDay(editDay, day) ? (
              <TimePicker
                initialOpen={availability[format(day, "yyyy-MM-dd")]?.open || "09:00"}
                initialClose={availability[format(day, "yyyy-MM-dd")]?.close || "18:00"}
                onSave={(open, close) => {
                  handleAvailabilityChange(day, open, close);
                  setEditDay(null);
                }}
              />
            ) : (
              <div>
                <p>Apertura: {availability[format(day, "yyyy-MM-dd")]?.open || "Cerrado"}</p>
                <p>Cierre: {availability[format(day, "yyyy-MM-dd")]?.close || "Cerrado"}</p>
                <button onClick={() => setEditDay(day)} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg">
                  Editar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
