import React, { useState } from "react";

export default function Dates() {
  const [expanded, setExpanded] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "add" | "edit" | "delete"
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointments, setAppointments] = useState([
    { title: "Consulta", date: "14 ene 2025", animal: "Perro", raza: "Labrador", peso: 20, tipo: "Vacunación", hora: "10:00 AM", images: [] },
    { title: "Consulta", date: "14 ene 2025", animal: "Gato", raza: "Siames", peso: 5, tipo: "Consulta", hora: "12:00 PM", images: [] },
  ]);

  const templates = [
    { title: "Crear Formulario", image: "https://i.pinimg.com/736x/6c/01/60/6c0160583758b154b89e5483efc08ac1.jpg" },
  ];

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const handleAddAppointment = () => {
    setModalType("add");
    setShowModal(true);
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setModalType("edit");
    setShowModal(true);
  };

  const handleDeleteAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setModalType("delete");
    setShowModal(true);
  };

  const handleFinalizeAppointment = (appointment) => {
    setAppointments(appointments.filter((appt) => appt !== appointment));
  };

  const saveAppointment = (newAppointment) => {
    if (modalType === "add") {
      setAppointments([...appointments, newAppointment]);
    } else if (modalType === "edit") {
      setAppointments(
        appointments.map((appt) =>
          appt === selectedAppointment ? newAppointment : appt
        )
      );
    }
    setShowModal(false);
    setSelectedAppointment(null);
  };

  const deleteAppointment = () => {
    setAppointments(appointments.filter((appt) => appt !== selectedAppointment));
    setShowModal(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 animate-slideIn">
            <h2 className="text-lg font-bold mb-4">
              {modalType === "add" ? "Agregar Cita" : modalType === "edit" ? "Editar Cita" : "Eliminar Cita"}
            </h2>
            {modalType === "delete" ? (
              <div>
                <p>¿Estás seguro de que deseas eliminar esta cita?</p>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={deleteAppointment}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const newAppointment = {
                    title: `Cita ${appointments.length + 1}`,
                    date: formData.get("date"),
                    animal: formData.get("animal"),
                    raza: formData.get("raza"),
                    peso: Number(formData.get("peso")),
                    tipo: formData.get("tipo"),
                    hora: formData.get("hora"),
                    images: [formData.get("image")],
                  };
                  saveAppointment(newAppointment);
                }}
              >
                <div className="space-y-4">
                  <input
                    type="text"
                    name="animal"
                    placeholder="Animal"
                    defaultValue={selectedAppointment?.animal || ""}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                  <input
                    type="text"
                    name="raza"
                    placeholder="Animal"
                    defaultValue={selectedAppointment?.raza || ""}
                    className="w-full border rounded px-3 py-2"
                  />
                  <input
                    type="number"
                    name="peso"
                    placeholder="Peso en kg"
                    defaultValue={selectedAppointment?.peso || ""}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                  <select
                    name="tipo"
                    defaultValue={selectedAppointment?.tipo || ""}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="Vacunación">Consulta General</option>
                    <option value="Consulta">Vacuna Antirabica</option>
                    <option value="Cirugía">Cirugía</option>
                  </select>
                  <input
                    type="time"
                    name="hora"
                    defaultValue={selectedAppointment?.hora || ""}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                  <input
                    type="date"
                    name="date"
                    defaultValue={selectedAppointment?.date || ""}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                  <select
                    name="image"
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="https://i.pinimg.com/736x/70/8f/4f/708f4f855a96968d8361b07a4e7e9de9.jpg">Perro</option>
                    <option value="https://i.pinimg.com/736x/c6/a5/9d/c6a59d8d6d52f8de04291edb4b74ed5c.jpg">Gato</option>
                    <option value="https://i.pinimg.com/736x/7e/a3/c8/7ea3c88922c006c9764c37d44989ab4a.jpg">Otros</option>
                  </select>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Sección: Iniciar un formulario nuevo */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Agregar Cita</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {templates.map((template, index) => (
            <div
              key={index}
              className={`flex flex-col items-center text-center bg-white shadow-sm rounded-lg p-3 transition-all duration-300 ${
                expanded === index ? "bg-blue-100 scale-105" : ""
              }`}
              onClick={() => {
                toggleExpand(index);
                handleAddAppointment();
              }}
            >
              <div
                className="w-full h-20 bg-gray-200 rounded-md mb-2"
                style={{
                  backgroundImage: `url(${template.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                aria-label={`Imagen de ${template.title}`}
              ></div>
              <p className="text-sm font-medium">{template.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sección: Formularios recientes */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Citas Pendientes</h2>
        <div className="flex flex-wrap gap-4">
          {appointments.map((form, index) => (
            <div
              key={index}
              className="w-64 bg-white shadow-sm rounded-lg overflow-hidden relative"
            >
              <div
                className="w-full h-28 bg-gray-200"
                style={{
                  backgroundImage: `url(${form.images[0] || ""})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{form.title}</h3>
                <p>{form.date}</p>
                <p>Animal: {form.animal}</p>
                <p>Raza: {form.raza}</p>
                <p>Peso: {form.peso} kg</p>
                <p>Tipo: {form.tipo}</p>
              </div>
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleEditAppointment(form)}
                  className="bg-yellow-300 px-3 py-1 rounded text-xs"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteAppointment(form)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => handleFinalizeAppointment(form)}
                  className="bg-green-500 text-white px-3 py-1 rounded text-xs"
                >
                  Finalizar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
