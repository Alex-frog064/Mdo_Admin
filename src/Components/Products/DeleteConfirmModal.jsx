import { AlertTriangle } from "lucide-react";

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, productName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[200]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 relative z-10 animate-scale-up">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Confirmar Eliminación
          </h3>
          
          <p className="text-gray-600 mb-6">
            ¿Estás seguro que deseas eliminar el producto{" "}
            <span className="font-semibold text-blue1">{productName}</span>?
            Esta acción no se puede deshacer.
          </p>

          <div className="flex gap-4 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium
                       hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 rounded-xl bg-red-500 text-white font-medium
                       hover:bg-red-600 transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 