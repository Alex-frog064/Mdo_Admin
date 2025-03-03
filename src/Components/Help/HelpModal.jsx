import { X, HelpCircle } from "lucide-react";

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const faqs = [
    {
      question: "¿Cómo se calculan las comisiones por cita?",
      answer: "Las comisiones varían entre 2-3% dependiendo del tipo de servicio:\n" +
        "• Cirugías complejas: 3% de comisión\n" +
        "• Cirugías menores: 2.5% de comisión\n" +
        "• Consultas generales: 2% de comisión\n" +
        "El descuento se aplica automáticamente al registrar la cita."
    },
    {
      question: "¿Cómo puedo agregar nuevos productos a mi inventario?",
      answer: "Para agregar productos:\n" +
        "1. Ve a la sección 'Productos'\n" +
        "2. Haz clic en '+ Agregar Producto'\n" +
        "3. Completa los detalles requeridos (nombre, precio, stock, etc.)\n" +
        "4. Opcionalmente agrega una imagen\n" +
        "5. Guarda los cambios"
    },
    {
      question: "¿Es obligatorio crear blogs?",
      answer: "No, la creación de blogs es completamente opcional. Sin embargo, recomendamos crearlos ya que:\n" +
        "• Mejora la visibilidad de tu perfil\n" +
        "• Aumenta la confianza de los clientes\n" +
        "• Permite compartir tu experiencia y conocimientos\n" +
        "• Ayuda a educar a los dueños de mascotas"
    },
    {
      question: "¿Cómo gestiono mi disponibilidad horaria?",
      answer: "En la sección 'Disponibilidad' puedes:\n" +
        "• Establecer horarios semanales o mensuales\n" +
        "• Bloquear días específicos\n" +
        "• Configurar horarios personalizados por día\n" +
        "• Sincronizar con tu calendario personal"
    },
    {
      question: "¿Cómo funciona el sistema de citas?",
      answer: "El sistema de citas permite:\n" +
        "• Ver citas programadas y su estado\n" +
        "• Confirmar o rechazar solicitudes\n" +
        "• Gestionar cancelaciones\n" +
        "• Ver historial de citas pasadas\n" +
        "• Recibir notificaciones de nuevas solicitudes"
    },
    {
      question: "¿Cómo se manejan los pagos y facturación?",
      answer: "El sistema gestiona automáticamente:\n" +
        "• Cálculo de comisiones por servicio\n" +
        "• Generación de facturas\n" +
        "• Reportes de ingresos\n" +
        "• Historial de transacciones\n" +
        "Los pagos se procesan al finalizar cada servicio."
    },
    {
      question: "¿Puedo personalizar mi perfil profesional?",
      answer: "Sí, puedes personalizar:\n" +
        "• Información profesional\n" +
        "• Foto de perfil\n" +
        "• Especialidades y servicios\n" +
        "• Horarios de atención\n" +
        "• Tarifas por servicio"
    },
    {
      question: "¿Cómo gestiono mi inventario de productos?",
      answer: "El sistema de inventario permite:\n" +
        "• Agregar/eliminar productos\n" +
        "• Actualizar stock\n" +
        "• Establecer alertas de stock bajo\n" +
        "• Ver historial de ventas\n" +
        "• Generar reportes de inventario"
    }
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[200]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl mx-4 p-6 relative z-10 max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="text-gray-400" size={20} />
        </button>

        <div className="mb-6 flex items-center gap-3">
          <HelpCircle className="text-blue1" size={28} />
          <h3 className="text-2xl font-bold text-gray-800">Centro de Ayuda</h3>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <h4 className="text-lg font-semibold text-blue1 mb-2">
                {faq.question}
              </h4>
              <p className="text-gray-600 whitespace-pre-line">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 