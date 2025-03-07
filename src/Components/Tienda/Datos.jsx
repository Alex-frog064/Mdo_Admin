import { useState, useEffect } from 'react';
import { loadStores } from './StoreUtils';
import { FaEdit, FaTrash, FaMapMarkerAlt, FaClock, FaPlus } from 'react-icons/fa';

const Datos = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedStores = loadStores();
    console.log('Loaded stores:', loadedStores); // Para debugging
    setStores(loadedStores?.features || []);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-emerald-500">Cargando...</div>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Veterinarias Registradas
          </h2>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <p className="text-gray-500 mb-4">No hay veterinarias registradas aún</p>
            <button 
              className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              <FaPlus className="mr-2" />
              Agregar Veterinaria
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Veterinarias Registradas
          </h2>
          <button 
            className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <FaPlus className="mr-2" />
            Agregar Veterinaria
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02]"
            >
              <div className="relative h-48">
                <img
                  src={store.properties.images?.[0] || 'https://via.placeholder.com/400x200?text=No+Image'}
                  alt={store.properties.Name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 space-x-2">
                  <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                    <FaEdit className="text-emerald-500 w-5 h-5" />
                  </button>
                  <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                    <FaTrash className="text-red-500 w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {store.properties.Name || 'Sin nombre'}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="w-5 h-5 text-emerald-500 mr-2" />
                    <p className="text-sm">{store.properties.address || 'Sin dirección'}</p>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <FaClock className="w-5 h-5 text-emerald-500 mr-2" />
                    <p className="text-sm">{store.properties.hour || 'Horario no disponible'}</p>
                  </div>

                  <p className="text-gray-600 text-sm mt-4">
                    {store.properties.description || 'Sin descripción'}
                  </p>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm font-medium text-emerald-600">
                      {store.properties.city || 'Mérida, Yuc.'}
                    </span>
                    <button 
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600 transition-colors"
                    >
                      Ver en mapa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Datos;
