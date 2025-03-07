import stores from './UbicStore';

export const saveToStoresFile = (newStore) => {
  try {
    // Agregar nueva ubicación al array de stores
    stores.features.push(newStore);
    
    // Guardar en localStorage para persistencia
    localStorage.setItem('veterinaryStores', JSON.stringify(stores));
    
    return true;
  } catch (error) {
    console.error('Error al guardar la ubicación:', error);
    return false;
  }
};

export const loadStores = () => {
  try {
    const savedStores = localStorage.getItem('veterinaryStores');
    return savedStores ? JSON.parse(savedStores) : stores;
  } catch (error) {
    console.error('Error al cargar las ubicaciones:', error);
    return stores;
  }
}; 