import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../index.css";
import stores from "./STORE-LOCATOR/stores";
import { GoArrowRight, GoArrowLeft } from "react-icons/go"; // Importar íconos
import { NavLink } from "react-router-dom";

mapboxgl.accessToken = "pk.eyJ1IjoiYWxleDA2NCIsImEiOiJjbTQyMnVkbnUwNWhiMmtxNzVibHloM2VjIn0.iqhDihNzn8GKQDNfDSqiqA";

const MapsConfig = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [filteredStores, setFilteredStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [appointmentTime, setAppointmentTime] = useState("");
  const [animalDescription, setAnimalDescription] = useState("");
  const [animalType, setAnimalType] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [isSliderOpen, setIsSliderOpen] = useState(false); // Estado para controlar la visibilidad del slider

  useEffect(() => {
    if (selectedStore) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % selectedStore.images.length
        );
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedStore]);

  const getDistance = (coord1, coord2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(coord2[1] - coord1[1]);
    const dLon = toRad(coord2[0] - coord1[0]);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(coord1[1])) * Math.cos(toRad(coord2[1])) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userCoords = [longitude, latitude];

          setUserLocation(userCoords);

          const filtered = stores.features.filter(store =>
            getDistance(userCoords, store.geometry.coordinates) <= 5
          );

          setFilteredStores(filtered);
        },
        () => {
          setUserLocation([-89.616557, 20.967748]); 
        }
      );
    } else {
      setUserLocation([-89.616557, 20.967748]); 
    }
  }, []);

  useEffect(() => {
    if (userLocation && filteredStores.length > 0) {
      const newMap = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/standard",
        center: userLocation,
        zoom: 12,
      });

      new mapboxgl.Marker({ color: "red" })
        .setLngLat(userLocation)
        .addTo(newMap);

      filteredStores.forEach((store) => {
        const el = document.createElement("div");
        el.className = "custom-marker";
        el.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/2934/2934709.png')";
        el.style.width = "40px";
        el.style.height = "40px";
        el.style.backgroundSize = "cover";

        new mapboxgl.Marker(el)
          .setLngLat(store.geometry.coordinates)
          .addTo(newMap);
      });

      setMap(newMap);

      return () => newMap.remove();
    }
  }, [userLocation, filteredStores]);

  const flyToStore = (store) => {
    if (map) {
      map.flyTo({ center: store.geometry.coordinates, zoom: 15 });
      setSelectedStore(store.properties);
      setCurrentImageIndex(0);
    }
  };

  const handleAppointmentSubmit = (e) => {
    e.preventDefault();

    const newAppointment = {
      date: appointmentDate.toISOString().split('T')[0],
      time: appointmentTime,
      animalDescription,
      animalType,
      store: selectedStore.Name,
    };

    const isTimeSlotAvailable = !appointments.some(
      (appt) => appt.date === newAppointment.date && appt.time === newAppointment.time
    );

    if (!isTimeSlotAvailable) {
      alert("Hora ocupada. Por favor, selecciona otra hora.");
      return;
    }

    setAppointments([...appointments, newAppointment]);
    setIsModalOpen(false);
    setShowAppointmentForm(false);
  };

  const handleDateChange = (date) => {
    setAppointmentDate(date);
    setShowAppointmentForm(true);
  };

  return (
    <div className="relative h-screen w-full flex flex-col">
      {/* Slider de ubicaciones cercanas */}
      <div
    className={`absolute top-0 left-0 bg-white shadow-md transform transition-transform duration-300 z-10 ${
      isSliderOpen ? "translate-x-0" : "-translate-x-full"
    }`}
    style={{ width: "300px", marginTop: "60px", height: "calc(104.5vh - 100px)" }}
  >
        <div className="p-4 h-full overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Ubicaciones Cercanas</h2>
          <ul>
            {filteredStores.length > 0 ? (
              filteredStores.map((store, index) => (
                <li
                  key={index}
                  className="p-2 border-b cursor-pointer hover:bg-gray-100"
                  onClick={() => flyToStore(store)}
                >
                  <p className="font-semibold">{store.properties.Name}</p>
                  <p className="text-xs font-light">{store.properties.address}</p>
                  <p className="text-xs font-light text-gray-500">Horario: {store.properties.hour}</p>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500">No hay ubicaciones cercanas</p>
            )}
          </ul>
        </div>
      </div>
    
      {/* Botón para mostrar/ocultar el slider */}
      <button
        className={`absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-20 flex items-center justify-center animate-bounce`}
        onClick={() => setIsSliderOpen(!isSliderOpen)}
      >
        {isSliderOpen ? (
          <GoArrowLeft className="text-xl text-gray-700" />
        ) : (
          <GoArrowRight className="text-xl text-gray-700" />
        )}
      </button>
    
      {/* Mapa de fondo */}
      <div id="map" className="absolute top-0 left-0 right-0 bottom-0 z-0"></div>

      {selectedStore && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-4 md:p-6 shadow-lg flex flex-col md:flex-row items-center justify-between rounded-t-lg z-20 transition-all duration-300 ease-in-out ${isSliderOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-full'}`}
          style={{ marginLeft: '300px' }}  // Ajusta el valor a tu gusto
        >
          <div className="flex flex-col md:flex-row items-center w-full"> 
            <img
              src={selectedStore.images[currentImageIndex]}
              className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-lg mb-4 md:mb-0 md:mr-4 border-2 border-white"
              alt="Imagen de la tienda"
            />
            <div className="flex flex-col items-start text-left w-full">
              <h3 className="text-xl font-bold text-white md:text-left">{selectedStore.Name}</h3>
              <p className="text-sm font-light text-white mt-2">
                <strong>Horario:</strong> {selectedStore.hour}
              </p>
              <p className="text-sm font-light text-white mt-1">
                <strong>Ubicación:</strong> {selectedStore.address}
              </p>
              <p className="text-sm md:text-base text-white mt-3">{selectedStore.description}</p>
            </div>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg shadow-lg transition-all duration-200"
              onClick={() => setIsModalOpen(true)}
            >
              <NavLink to="/Modal" >
              Hacer Cita
              </NavLink>
             
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapsConfig;