import { X, Calendar, Clock, User, PawPrint, FileText } from "lucide-react";

export default function DateDetails({ isOpen, onClose, cita }) {
  if (!isOpen || !cita) return null;

  const tiposMascota = {
    "1": "🐕 Perro",
    "3": "🐱 Gato",
    "4": "🦎 Reptil",
    "5": "🧺 Basket"
  };

  // Formatear la fecha para mostrarla más amigable
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100]">
      <div className="absolute inset-0 bg-gradient-to-br from-blue1/20 to-blue2/20 backdrop-blur-[6px]" />

      <div className="bg-white/90 rounded-3xl shadow-2xl max-w-2xl w-full mx-4 relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 transition-all duration-300 group"
        >
          <X className="text-gray-400 group-hover:text-blue1" size={24} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Detalles de la Cita</h2>

          <div className="space-y-6">
            {/* Estado de la cita */}
            <div className="flex justify-end">
              <span className={`px-4 py-2 rounded-xl text-sm font-medium
                ${cita.estado === 'confirmada' ? 'bg-emerald-100 text-emerald-700' : 
                  cita.estado === 'pendiente' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'}`}>
                {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
              </span>
            </div>

            {/* Información principal */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar size={20} className="text-blue1" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fecha</p>
                    <p className="text-gray-800">{formatearFecha(cita.fecha_cita)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <Clock size={20} className="text-blue1" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Hora</p>
                    <p className="text-gray-800">{cita.hora_cita}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <PawPrint size={20} className="text-blue1" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tipo de Mascota</p>
                    <p className="text-gray-800">{tiposMascota[cita.mascota]}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <User size={20} className="text-blue1" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">ID Cliente</p>
                    <p className="text-gray-800">{cita.cliente}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Razón de la cita */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <FileText size={20} className="text-blue1" />
                <h3 className="font-medium text-gray-800">Razón de la cita</h3>
              </div>
              <p className="text-gray-600">{cita.razon}</p>
            </div>

            {/* Información adicional */}
            <div className="border-t border-gray-100 pt-4 mt-6">
              <p className="text-sm text-gray-500">ID de la cita: {cita.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 