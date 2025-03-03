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
import BulkScheduleModal from "./BulkScheduleModal";
import { Clock } from "lucide-react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState({});
  const [editDay, setEditDay] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showBulkModal, setShowBulkModal] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-blue1/5 to-blue2/5 p-6 sm:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-blue1 tracking-wide">
            Organizador Semanal
          </h1>
          <button
            onClick={() => setShowBulkModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue1 to-blue2 text-white rounded-xl
                     hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
          >
            Configurar Horarios
          </button>
        </div>

        {loading && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue1"></div>
              <p className="mt-4 text-gray-600">Cargando disponibilidades...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="relative bg-white rounded-2xl p-8 shadow-lg">
          <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue1/20 to-blue2/20"></div>

          {/* Botones de navegación entre semanas */}
          <div className="flex justify-between mb-6">
            <button
              onClick={goToPreviousWeek}
              className="px-4 py-2 bg-emerald-200 text-blue1 rounded-lg hover:bg-blue2 transition-colors duration-200"
            >
              Semana anterior
            </button>
            <button
              onClick={goToNextWeek}
              className="px-4 py-2 bg-emerald-200 text-blue1 rounded-lg hover:bg-blue2 transition-colors duration-200"
            >
              Semana siguiente
            </button>
          </div>

          {daysOfWeek.map((day) => (
            <div key={day.toString()} className="flex items-start mb-6 relative">
              <div className="absolute -left-12 top-1/2 w-4 h-4 rounded-full bg-emerald-300 -mt-2"></div>
              <div className="w-40 mr-8">
                <h3 className="text-lg font-semibold text-blue2">
                  {format(day, "EEEE", { locale: es })}
                </h3>
                <p className="text-sm text-blue2">
                  {format(day, "d MMMM", { locale: es })}
                </p>
              </div>

              <div className="flex-1 bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                {editDay && isSameDay(editDay, day) ? (
                  <TimePicker
                    initialOpen={availability[format(day, "yyyy-MM-dd")]?.open || "09:00"}
                    initialClose={availability[format(day, "yyyy-MM-dd")]?.close || "18:00"}
                    onSave={async (open, close) => {
                      await saveAvailability(day, { open, close });
                      setEditDay(null);
                    }}
                  />
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        <span className="text-blue1 font-medium">Apertura:</span>{" "}
                        {availability[format(day, "yyyy-MM-dd")]?.open || "—"}
                      </p>
                      <p className="text-gray-700">
                        <span className="text-blue1 font-medium">Cierre:</span>{" "}
                        {availability[format(day, "yyyy-MM-dd")]?.close || "—"}
                      </p>
                    </div>
                    <button
                      onClick={() => setEditDay(day)}
                      className="px-4 py-2 bg-gray-50 text-blue1 rounded-xl hover:bg-gray-100 
                               transition-all duration-200 flex items-center gap-2"
                    >
                      <Clock size={18} />
                      Editar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <BulkScheduleModal
          isOpen={showBulkModal}
          onClose={() => setShowBulkModal(false)}
          onApply={(schedule) => {
            applyBulkSchedule(
              { open: schedule.open, close: schedule.close },
              schedule.period
            );
            setShowBulkModal(false);
          }}
        />
      </div>
    </div>
  );
};

export default Calendar;