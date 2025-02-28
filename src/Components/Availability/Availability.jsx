import React, { useState, useEffect } from "react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  startOfMonth,
  endOfMonth,
  isAfter,
  startOfDay,
  parseISO,
  subWeeks,
  addWeeks,
} from "date-fns";
import { es } from "date-fns/locale";
import TimePicker from "./TimePicker";
import axiosInstance from "../../../Conexion/AxiosInstance";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState({});
  const [editDay, setEditDay] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener el inicio y fin de la semana actual
  const startWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endWeek = endOfWeek(currentDate, { weekStartsOn: 1 });

  // Generar los días de la semana y filtrar los días anteriores al día actual
  const daysOfWeek = eachDayOfInterval({ start: startWeek, end: endWeek }).filter(
    (day) => isAfter(day, startOfDay(new Date())) || isSameDay(day, startOfDay(new Date()))
  );

  // Función para cambiar a la semana anterior
  const goToPreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  // Función para cambiar a la semana siguiente
  const goToNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  // Función para manejar cambios en la disponibilidad
  const handleAvailabilityChange = (day, open, close) => {
    setAvailability((prev) => ({
      ...prev,
      [format(day, "yyyy-MM-dd")]: { open, close },
    }));
  };

  // Obtener el ID del veterinario del localStorage
  const getVetId = () => {
    const userData = JSON.parse(localStorage.getItem("usuario"));
    return userData?.veterinario?.id;
  };

  // Función para guardar disponibilidad individual
  const saveAvailability = async (date, timeSlot) => {
    const vetId = getVetId();
    if (!vetId) {
      setError("No se encontró ID del veterinario");
      return;
    }

    try {
      const response = await axiosInstance.post("/disponibilidad", {
        id_veterinario: vetId,
        fecha: format(date, "yyyy-MM-dd"),
        hora_inicio: timeSlot.open,
        hora_fin: timeSlot.close,
      });

      setAvailability((prev) => ({
        ...prev,
        [format(date, "yyyy-MM-dd")]: timeSlot,
      }));

      setError(null);
    } catch (err) {
      setError("Error al guardar la disponibilidad");
      console.error(err);
    }
  };

  // Función para aplicar horario masivo (semanal o mensual)
  const applyBulkSchedule = async (timeSlot, period) => {
    setLoading(true);
    const vetId = getVetId();

    try {
      let dates;
      const today = new Date();

      if (period === "week") {
        const weekStart = startOfWeek(today, { weekStartsOn: 1 });
        dates = [...Array(7)].map((_, i) => addDays(weekStart, i));
      } else if (period === "month") {
        const monthStart = startOfMonth(today);
        const monthEnd = endOfMonth(today);
        dates = eachDayOfInterval({ start: monthStart, end: monthEnd });
      }

      // Realizar las peticiones en secuencia para evitar sobrecarga
      for (const date of dates) {
        await saveAvailability(date, timeSlot);
      }

      setError(null);
    } catch (err) {
      setError(`Error al aplicar horario ${period === "week" ? "semanal" : "mensual"}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar disponibilidades existentes y filtrar solo las actuales y futuras
  const fetchAvailabilities = async () => {
    const vetId = getVetId();
    if (!vetId) return;

    try {
      setLoading(true);
      const response = await axiosInstance.get(`/disponibilidad/veterinario/${vetId}`);
      const availabilityMap = {};

      const today = startOfDay(new Date());
      response.data
        .filter((slot) => {
          const slotDate = parseISO(slot.fecha); // Convierte el string de fecha a objeto Date
          return isAfter(slotDate, today) || format(slotDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
        })
        .forEach((slot) => {
          availabilityMap[slot.fecha] = {
            id: slot.id,
            open: slot.hora_inicio.substring(0, 5),
            close: slot.hora_fin.substring(0, 5),
          };
        });

      setAvailability(availabilityMap);
      setError(null);
    } catch (err) {
      console.error("Error al cargar disponibilidades:", err);
      setError("Error al cargar las disponibilidades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailabilities();
  }, [currentDate]); // Recargar disponibilidades cuando cambia la semana

  return (
    <div className="min-h-screen bg-sky-50 p-6 sm:p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center text-sky-900 tracking-wide">
          Organizador Semanal
        </h1>

        {loading && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mx-auto"></div>
              <p className="mt-2">Cargando disponibilidades...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="relative bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-sm">
          <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-sky-200"></div>

          {/* Botones de navegación entre semanas */}
          <div className="flex justify-between mb-6">
            <button
              onClick={goToPreviousWeek}
              className="px-4 py-2 bg-sky-200 text-sky-800 rounded-lg hover:bg-sky-300 transition-colors duration-200"
            >
              Semana anterior
            </button>
            <button
              onClick={goToNextWeek}
              className="px-4 py-2 bg-sky-200 text-sky-800 rounded-lg hover:bg-sky-300 transition-colors duration-200"
            >
              Semana siguiente
            </button>
          </div>

          {daysOfWeek.map((day) => (
            <div key={day.toString()} className="flex items-start mb-6 relative">
              <div className="absolute -left-12 top-1/2 w-4 h-4 rounded-full bg-sky-300 -mt-2"></div>
              <div className="w-40 mr-8">
                <h3 className="text-lg font-semibold text-sky-800">
                  {format(day, "EEEE", { locale: es })}
                </h3>
                <p className="text-sm text-sky-600">
                  {format(day, "d MMMM", { locale: es })}
                </p>
              </div>

              <div className="flex-1 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
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
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sky-700">
                        <span className="text-sky-500">Apertura:</span>{" "}
                        {availability[format(day, "yyyy-MM-dd")]?.open || "—"}
                      </p>
                      <p className="text-sky-700">
                        <span className="text-sky-500">Cierre:</span>{" "}
                        {availability[format(day, "yyyy-MM-dd")]?.close || "—"}
                      </p>
                    </div>
                    <button
                      onClick={() => setEditDay(day)}
                      className="px-4 py-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition-colors duration-200"
                    >
                      Editar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => applyBulkSchedule({ open: "09:00", close: "18:00" }, "week")}
            className="px-6 py-2 bg-sky-200 text-sky-800 rounded-full hover:bg-sky-300 transition-colors duration-200"
          >
            Aplicar horario semanal
          </button>
          <button
            onClick={() => applyBulkSchedule({ open: "10:00", close: "15:00" }, "month")}
            className="px-6 py-2 bg-sky-200 text-sky-800 rounded-full hover:bg-sky-300 transition-colors duration-200"
          >
            Aplicar horario mensual
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calendar;