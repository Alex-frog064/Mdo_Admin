import { useState } from "react";
import { Search, HelpCircle, Book, DollarSign, Calendar, Package, Settings, Users, FileText, AlertCircle } from "lucide-react";
import Profile from "../../Profile/Profile";

export default function Help() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showProfile, setShowProfile] = useState(false);

  const categories = [
    { id: "all", name: "Todas las categorías", icon: HelpCircle },
    { id: "profile_settings", name: "Perfil y Configuración", icon: Settings },
    { id: "financial", name: "Finanzas y Pagos", icon: DollarSign },
    { id: "appointments", name: "Citas y Agenda", icon: Calendar },
    { id: "inventory", name: "Inventario y Productos", icon: Package },
    { id: "clients", name: "Gestión de Clientes", icon: Users },
    { id: "reports", name: "Reportes y Estadísticas", icon: FileText },
    { id: "blogs", name: "Blogs y Contenido", icon: Book },
  ];

  const faqs = [
    {
      category: "financial",
      question: "¿Cómo se calculan las comisiones por servicios veterinarios?",
      answer: "Las comisiones varían según el tipo de procedimiento veterinario:\n\n" +
        "1. Cirugías especializadas (3% de comisión):\n" +
        "   • Cirugías ortopédicas (fracturas, ligamentos)\n" +
        "   • Cirugías abdominales complejas\n" +
        "   • Neurocirugías y procedimientos especiales\n" +
        "   • Cirugías oncológicas\n\n" +
        "2. Cirugías rutinarias (2.5% de comisión):\n" +
        "   • Esterilizaciones (OVH, orquiectomías)\n" +
        "   • Extracciones dentales y limpiezas\n" +
        "   • Extirpación de tumores superficiales\n" +
        "   • Cesáreas programadas\n\n" +
        "3. Consultas y procedimientos básicos (2% de comisión):\n" +
        "   • Consultas generales y urgencias\n" +
        "   • Vacunaciones y desparasitaciones\n" +
        "   • Procedimientos ambulatorios\n" +
        "   • Controles postoperatorios\n\n" +
        "Las comisiones se calculan sobre el valor final del servicio y se descuentan automáticamente en el reporte mensual."
    },
    {
      category: "inventory",
      question: "¿Cómo gestiono el inventario de mi clínica veterinaria?",
      answer: "El sistema de inventario está diseñado específicamente para clínicas veterinarias:\n\n" +
        "1. Gestión de medicamentos:\n" +
        "   • Control de medicamentos controlados\n" +
        "   • Fechas de caducidad\n" +
        "   • Lotes y proveedores\n" +
        "   • Alertas de stock mínimo\n" +
        "   • Registro de temperaturas (vacunas)\n\n" +
        "2. Insumos médicos:\n" +
        "   • Material quirúrgico\n" +
        "   • Vendajes y materiales de curación\n" +
        "   • Sueros y soluciones\n" +
        "   • Instrumental médico\n\n" +
        "3. Productos de venta:\n" +
        "   • Alimentos y suplementos\n" +
        "   • Accesorios y juguetes\n" +
        "   • Productos de higiene\n" +
        "   • Antiparasitarios\n\n" +
        "4. Reportes especializados:\n" +
        "   • Consumo por tipo de procedimiento\n" +
        "   • Rotación de medicamentos\n" +
        "   • Rentabilidad por producto\n" +
        "   • Alertas de reabastecimiento"
    },
    {
      category: "blogs",
      question: "¿Qué tipo de contenido puedo crear en el blog veterinario?",
      answer: "Recomendaciones para contenido veterinario efectivo:\n\n" +
        "1. Artículos educativos:\n" +
        "   • Prevención de enfermedades comunes\n" +
        "   • Nutrición por especie y edad\n" +
        "   • Calendario de vacunación\n" +
        "   • Cuidados postoperatorios\n\n" +
        "2. Casos clínicos interesantes:\n" +
        "   • Procedimientos realizados\n" +
        "   • Evolución del paciente\n" +
        "   • Técnicas innovadoras\n" +
        "   • Resultados obtenidos\n\n" +
        "3. Consejos prácticos:\n" +
        "   • Primeros auxilios para mascotas\n" +
        "   • Signos de alarma\n" +
        "   • Cuidados estacionales\n" +
        "   • Comportamiento animal\n\n" +
        "4. Novedades de la clínica:\n" +
        "   • Nuevos servicios\n" +
        "   • Equipamiento adquirido\n" +
        "   • Casos de éxito\n" +
        "   • Eventos y campañas"
    },
    {
      category: "appointments",
      question: "¿Cómo organizo mi agenda veterinaria?",
      answer: "Sistema de gestión de citas veterinarias:\n\n" +
        "1. Tipos de citas:\n" +
        "   • Consultas rutinarias (30 min)\n" +
        "   • Vacunaciones (15 min)\n" +
        "   • Cirugías programadas (2-3 horas)\n" +
        "   • Urgencias (tiempo variable)\n\n" +
        "2. Organización diaria:\n" +
        "   • Bloque quirúrgico (mañanas)\n" +
        "   • Consultas generales\n" +
        "   • Espacio para urgencias\n" +
        "   • Seguimientos postoperatorios\n\n" +
        "3. Gestión de pacientes:\n" +
        "   • Historial clínico digital\n" +
        "   • Recordatorios automáticos\n" +
        "   • Seguimiento de tratamientos\n" +
        "   • Programación de controles"
    },
    {
      category: "clients",
      question: "¿Cómo gestiono los expedientes clínicos veterinarios?",
      answer: "Sistema integral de expedientes:\n\n" +
        "1. Ficha del paciente:\n" +
        "   • Datos básicos (especie, raza, edad)\n" +
        "   • Historial de vacunación\n" +
        "   • Alergias y condiciones crónicas\n" +
        "   • Cirugías previas\n" +
        "   • Medicamentos habituales\n\n" +
        "2. Seguimiento clínico:\n" +
        "   • Evolución de tratamientos\n" +
        "   • Resultados de laboratorio\n" +
        "   • Imágenes diagnósticas\n" +
        "   • Notas de progreso\n\n" +
        "3. Comunicación con propietarios:\n" +
        "   • Recordatorios de vacunas\n" +
        "   • Instrucciones post-consulta\n" +
        "   • Recetas digitales\n" +
        "   • Presupuestos de tratamientos"
    },
    {
      category: "reports",
      question: "¿Qué tipos de reportes veterinarios puedo generar?",
      answer: "Reportes especializados para clínicas veterinarias:\n\n" +
        "1. Estadísticas clínicas:\n" +
        "   • Patologías más frecuentes\n" +
        "   • Tasa de éxito en tratamientos\n" +
        "   • Procedimientos realizados\n" +
        "   • Índice de recuperación\n\n" +
        "2. Análisis financiero:\n" +
        "   • Ingresos por tipo de servicio\n" +
        "   • Rentabilidad por procedimiento\n" +
        "   • Control de costos médicos\n" +
        "   • Proyecciones de crecimiento\n\n" +
        "3. Gestión de calidad:\n" +
        "   • Satisfacción del cliente\n" +
        "   • Tiempo de espera\n" +
        "   • Tasa de retorno\n" +
        "   • Efectividad de tratamientos"
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    if (selectedCategory === "profile_settings") return false;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-blue1 mb-4">
            {selectedCategory === "profile_settings" ? "Configuración de Perfil" : "Centro de Ayuda para Veterinarios"}
          </h1>
          {selectedCategory !== "profile_settings" && (
            <p className="text-gray-600">
              Encuentra respuestas detalladas a las preguntas más frecuentes sobre la gestión de tu clínica
            </p>
          )}
        </div>

        {/* Barra de búsqueda - solo mostrar si no estamos en perfil */}
        {selectedCategory !== "profile_settings" && (
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Buscar en la ayuda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 pl-12 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue1 border-0"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        )}

        {/* Categorías */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setShowProfile(category.id === "profile_settings");
                }}
                className={`p-4 rounded-xl flex items-center gap-3 transition-all duration-200
                  ${selectedCategory === category.id 
                    ? "bg-blue1 text-white shadow-lg" 
                    : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Contenido condicional: Profile o FAQs */}
        {selectedCategory === "profile_settings" ? (
          <div className="bg-white rounded-2xl shadow-lg">
            <Profile />
          </div>
        ) : (
          <div className="space-y-6">
            {filteredFaqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold text-blue1 mb-4 flex items-center gap-2">
                  <AlertCircle size={20} />
                  {faq.question}
                </h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {faq.answer}
                </p>
              </div>
            ))}

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">No se encontraron resultados para tu búsqueda</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 