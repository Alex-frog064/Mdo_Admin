//asquile proxiamemnete ya me fastidie
import { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import stores from "../STORE-LOCATOR/stores";
import { saveToStoresFile } from "../utils/storeUtils";

const Sopas = () => {
  const [searchData, setSearchData] = useState({
    calle: "",
    numero: "",
    colonia: "",
    codigoPostal: "",
  });
  const [searchResults, setSearchResults] = useState(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [newLocation, setNewLocation] = useState({
    name: "",
    address: "",
    hour: "",
    coordinates: [],
  });

  // Inicializar el mapa
  useEffect(() => {
    const newMap = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-89.616557, 20.967748], // Mérida
      zoom: 12,
    });

    // Habilitar el arrastre del mapa
    newMap.dragPan.enable();

    // Agregar evento de doble clic al mapa
    newMap.on('dblclick', async (e) => {
      const { lng, lat } = e.lngLat;

      // Obtener la dirección a partir de las coordenadas
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}&country=mx&types=address&limit=1`
        );
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const place = data.features[0];
          setSearchResults([place]);

          if (marker) {
            marker.remove();
          }

          const el = document.createElement('div');
          el.className = 'custom-marker';
          el.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/2934/2934709.png')";
          el.style.width = '40px';
          el.style.height = '40px';
          el.style.backgroundSize = 'cover';

          const newMarker = new mapboxgl.Marker(el)
            .setLngLat([lng, lat])
            .addTo(newMap);
          
          setMarker(newMarker);

          newMap.flyTo({
            center: [lng, lat],
            zoom: 16
          });

          // Actualizar los campos de búsqueda con la nueva ubicación
          const address = place.place_name.split(', ');
          setSearchData({
            calle: address[0] || "",
            numero: "",
            colonia: address[1] || "",
            codigoPostal: address[2] || "",
          });
        }
      } catch (error) {
        console.error("Error al obtener la dirección:", error);
      }
    });

    setMap(newMap);

    return () => newMap.remove();
  }, []);

  const handleSearch = async () => {
    try {
      // Construir la dirección completa
      const searchText = `${searchData.calle} ${searchData.numero}, ${searchData.colonia}, ${searchData.codigoPostal}, Mérida, Yucatán, México`;
      
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchText)}.json?proximity=-89.616557,20.967748&access_token=${mapboxgl.accessToken}&country=mx&types=address&limit=5`
      );
      const data = await response.json();
      setSearchResults(data.features);

      if (data.features && data.features.length > 0) {
        if (marker) {
          marker.remove();
        }

        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/2934/2934709.png')";
        el.style.width = '40px';
        el.style.height = '40px';
        el.style.backgroundSize = 'cover';

        const newMarker = new mapboxgl.Marker(el)
          .setLngLat(data.features[0].center)
          .addTo(map);
        
        setMarker(newMarker);

        map.flyTo({
          center: data.features[0].center,
          zoom: 16
        });
      }
    } catch (error) {
      console.error("Error al buscar ubicación:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveLocation = () => {
    if (!searchResults || !newLocation.name || !newLocation.hour) {
      alert("Por favor completa todos los campos");
      return;
    }

    const selectedLocation = searchResults[0];
    
    const newStore = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: selectedLocation.center,
      },
      properties: {
        Name: newLocation.name,
        address: selectedLocation.place_name,
        city: "Merida, Yuc.",
        hour: newLocation.hour,
        images: [
          "https://i.pinimg.com/736x/d4/99/b2/d499b2610570183b28fd47eeb24d022a.jpg",
          "https://i.pinimg.com/736x/23/bf/3c/23bf3c6fd40e10cdfb82457f04fdd62b.jpg",
          "https://i.pinimg.com/736x/f7/a8/52/f7a85222bf5e6a2ebbb769238b0dfd5c.jpg"
        ],
        description: "Clínica veterinaria con más de 10 años de experiencia en el cuidado de mascotas."
      },
    };

    // Agregar la nueva ubicación al archivo stores
    stores.features.push(newStore);
    
    // Limpiar el formulario
    setSearchData({
      calle: "",
      numero: "",
      colonia: "",
      codigoPostal: "",
    });
    setSearchResults(null);
    
    if (marker) {
      marker.remove();
    }

    alert("Ubicación guardada exitosamente");
  };

  return (
    <div className="relative h-screen w-full">
      {/* Mapa de fondo */}
      <div id="map" className="absolute top-0 left-0 w-full h-full z-0"></div>

      {/* Panel de búsqueda */}
      <div className="absolute top-32 left-4 w-96 z-10">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Formulario de búsqueda */}
          <div className="p-4">
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <input
                    type="text"
                    name="calle"
                    value={searchData.calle}
                    onChange={handleInputChange}
                    placeholder="Calle (ej: Calle 19-A)"
                    className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-1">
                  <input
                    type="text"
                    name="numero"
                    value={searchData.numero}
                    onChange={handleInputChange}
                    placeholder="# (ej: 237)"
                    className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <input
                type="text"
                name="colonia"
                value={searchData.colonia}
                onChange={handleInputChange}
                placeholder="Colonia (ej: Paseos de Vergel)"
                className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />

              <input
                type="text"
                name="codigoPostal"
                value={searchData.codigoPostal}
                onChange={handleInputChange}
                placeholder="Código Postal (ej: 97173)"
                className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />

              <button
                onClick={handleSearch}
                className="w-full bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Buscar
              </button>
            </div>

            {/* Indicadores */}
            <div className="flex gap-2 mt-4">
              <button className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm">
                Ubicación
              </button>
              <button className="bg-gray-100 text-gray-600 px-4 py-1 rounded-full text-sm">
                Guardar
              </button>
            </div>
          </div>

          {/* Resultados de búsqueda */}
          {searchResults && searchResults.length > 0 && (
            <div className="border-t border-gray-100">
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <p className="text-sm text-gray-600">Ubicación encontrada</p>
                  </div>
                  
                  <div className="pl-4 border-l-2 border-emerald-500">
                    <p className="text-sm font-medium">{searchResults[0].place_name}</p>
                    <p className="text-xs text-gray-500">
                      {searchResults[0].center.join(", ")}
                    </p>
                  </div>

                  {/* Formulario para guardar */}
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={newLocation.name}
                      onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                      placeholder="Nombre del establecimiento"
                      className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={newLocation.hour}
                      onChange={(e) => setNewLocation({...newLocation, hour: e.target.value})}
                      placeholder="Horario (ej: 9:00-18:00)"
                      className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSaveLocation}
                      className="w-full bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600 transition-colors text-sm"
                    >
                      Guardar Ubicación
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sopas;z