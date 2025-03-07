const initialStores = {
  type: "FeatureCollection",
  features: []
};

// Intentar cargar las ubicaciones guardadas del localStorage
const loadInitialStores = () => {
  try {
    const savedStores = localStorage.getItem('veterinaryStores');
    return savedStores ? JSON.parse(savedStores) : initialStores;
  } catch (error) {
    console.error('Error al cargar las ubicaciones:', error);
    return initialStores;
  }
};

const stores = loadInitialStores();

export default stores;
  