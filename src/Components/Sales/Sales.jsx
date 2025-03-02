import { useState, useEffect } from "react";
import { DollarSign, Package, Calendar, TrendingUp, Users, MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import axiosInstance from "../../../Conexion/AxiosInstance";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Definimos algunos colores consistentes
const THEME = {
  primary: '#6C5DD3',      // Morado principal
  secondary: '#7FE7D9',    // Turquesa claro
  background: '#F7F6FB',   // Gris muy claro/lila
  card: '#FFFFFF',         // Blanco
  text: {
    primary: '#2B3674',    // Azul oscuro
    secondary: '#A3AED0'   // Gris medio
  }
};

export default function Sales() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metricas, setMetricas] = useState({
    totalVentas: 0,
    ingresoTotal: 0,
    promedioVenta: 0,
    ventasPorDia: []
  });
  const [activeMenu, setActiveMenu] = useState(null);

  const fetchVentas = async () => {
    try {
      const response = await axiosInstance.get("/ventas?page=1&limit=10");
      const datos = response.data;
      setVentas(datos);

      // Calcular métricas
      const ingresoTotal = datos.reduce((sum, venta) => sum + parseFloat(venta.precio), 0);
      const promedioVenta = ingresoTotal / datos.length;

      // Agrupar ventas por día para el gráfico
      const ventasPorDia = datos.reduce((acc, venta) => {
        const dia = new Date(venta.fecha || Date.now()).toLocaleDateString('en-US', { weekday: 'short' });
        acc[dia] = (acc[dia] || 0) + parseFloat(venta.precio);
        return acc;
      }, {});

      // Convertir a formato para el gráfico
      const datosGrafico = Object.entries(ventasPorDia).map(([day, sales]) => ({
        day,
        sales
      }));

      setMetricas({
        totalVentas: datos.length,
        ingresoTotal,
        promedioVenta,
        ventasPorDia: datosGrafico
      });

      setLoading(false);
    } catch (error) {
      console.error("Error al obtener ventas:", error);
      setError("Error al cargar los datos");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue1"></div>
      </div>
    );
  }

  if (error) return (
    <div className="p-8 text-red-500 bg-red-50 rounded-lg text-center">
      {error}
    </div>
  );

  const statsCards = [
    {
      title: "Total Ventas",
      value: metricas.totalVentas,
      icon: Package
    },
    {
      title: "Ingreso Total",
      value: `$${metricas.ingresoTotal.toFixed(2)}`,
      icon: DollarSign
    },
    {
      title: "Promedio por Venta",
      value: `$${metricas.promedioVenta.toFixed(2)}`,
      icon: TrendingUp
    },
    {
      title: "Ventas del Día",
      value: ventas.length,
      icon: Calendar
    }
  ];

  // Función para eliminar venta
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta venta?')) {
      try {
        await axiosInstance.delete(`/ventas/${id}`);
        fetchVentas(); // Recargar los datos
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  // Función para editar venta
  const handleEdit = (venta) => {
    // Implementar lógica de edición
    console.log('Editar venta:', venta);
  };

  return (
    <div className="p-8 bg-[#F7F6FB] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#2B3674]">Análisis de Ventas</h1>
            <p className="text-[#A3AED0]">Información General</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-1 rounded-full text-[#A3AED0]">Mes</button>
            <button className="px-4 py-1 rounded-full bg-[#6C5DD3] text-white">Año</button>
          </div>
        </div>

        {/* Gráfico Principal */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-8">
              <div>
                <p className="text-[#A3AED0] text-sm">Total Recaudado</p>
                <h3 className="text-2xl font-bold text-[#6C5DD3]">
                  ${metricas.ingresoTotal.toFixed(2)}
                </h3>
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricas.ventasPorDia} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#A3AED0', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#A3AED0', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="sales" 
                  fill="#6C5DD3"
                  radius={[20, 20, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-[#6C5DD3] bg-opacity-10 rounded-xl">
                  <stat.icon size={24} className="text-[#6C5DD3]" />
                </div>
              </div>
              <h3 className="text-[#A3AED0] text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-[#2B3674]">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabla de Ventas */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#2B3674]">Registro de Ventas</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-4 px-4 text-sm font-medium text-blue2">ID Venta</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-blue2">ID Producto</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-blue2">ID Cliente</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-blue2">Tipo Mascota</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-blue2">Categoría</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-blue2">Precio</th>
                  <th className="text-center py-4 px-4 text-sm font-medium text-blue2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((venta) => (
                  <tr key={venta.id} className="text-sm hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 text-blue1 font-medium">#{venta.id}</td>
                    <td className="py-4 px-4 text-gray-600">{venta.id_producto}</td>
                    <td className="py-4 px-4 text-gray-600">{venta.id_cliente}</td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-blue1 bg-opacity-10 rounded-full text-blue1">
                        {venta.tipo_mascota}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{venta.categoria}</td>
                    <td className="py-4 px-4 text-right font-medium text-blue1">
                      ${parseFloat(venta.precio).toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-center relative">
                      <button
                        onClick={() => setActiveMenu(activeMenu === venta.id ? null : venta.id)}
                        className="p-1.5 hover:bg-gray-100 rounded-full inline-flex items-center justify-center"
                      >
                        <MoreHorizontal size={18} className="text-blue2" />
                      </button>

                      {activeMenu === venta.id && (
                        <div className="absolute right-8 top-4 bg-white rounded-lg shadow-xl py-2 z-10 min-w-[120px] border border-gray-100">
                          <button
                            onClick={() => handleEdit(venta)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-blue1"
                          >
                            <Edit2 size={14} />
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(venta.id)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-500"
                          >
                            <Trash2 size={14} />
                            Eliminar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
