import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFacebook, FaLinkedinIn, FaGoogle, FaRegEnvelope, FaRegImage, FaUpload } from 'react-icons/fa';
import { MdLockOutline } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import axiosInstance from '../../Conexion/AxiosInstance';

export default function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        grado_estudio: '',
        especialidad: '',
        nombre: '',
        apellido: '',
        dni: '',
        email: '',
        contraseña: '',
        imagen_perfil: null,
        acceptTerm: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            if (file) {
                setPreviewImage(URL.createObjectURL(file));
                setFormData(prev => ({
                    ...prev,
                    imagen_perfil: file
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };

    const validarFormulario = () => {
        if (!formData.email.includes('@')) {
            alert('Por favor ingresa un email válido');
            return false;
        }
        if (formData.contraseña.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            return false;
        }
        if (!formData.nombre || !formData.apellido || !formData.dni) {
            alert('Por favor completa todos los campos obligatorios');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.acceptTerm) {
            alert('Debes aceptar los términos y condiciones.');
            return;
        }

        setLoading(true);
        try {
            // Crear el objeto exactamente como lo espera la API
            const datosParaEnviar = {
                grado_estudio: formData.grado_estudio || "",
                especialidad: formData.especialidad || "",
                nombre: formData.nombre,
                apellido: formData.apellido,
                dni: formData.dni,
                email: formData.email.toLowerCase(),
                contraseña: formData.contraseña,
                imagen_perfil: "string"
            };

            // Validar datos requeridos
            const camposRequeridos = ['nombre', 'apellido', 'dni', 'email', 'contraseña'];
            const camposFaltantes = camposRequeridos.filter(campo => !datosParaEnviar[campo]);
            
            if (camposFaltantes.length > 0) {
                alert(`Por favor completa los siguientes campos: ${camposFaltantes.join(', ')}`);
                setLoading(false);
                return;
            }

            console.log('Datos a enviar:', datosParaEnviar);

            const response = await axiosInstance.post('/veterinario/register', datosParaEnviar);

            console.log('Respuesta exitosa:', response.data);

            if (response.data) {
                // Guardar token si existe
                if (response.data.token) {
                    localStorage.setItem('jwt', response.data.token);
                }
                
                // Guardar datos del usuario
                localStorage.setItem('usuario', JSON.stringify(response.data));
                
                // Mostrar modal de éxito
                setShowModal(true);
                
                // Redirigir después de 2 segundos
                setTimeout(() => {
                    navigate('/SignIn');
                }, 2000);
            }
        } catch (error) {
            console.error('Error detallado:', {
                mensaje: error.message,
                respuesta: error.response?.data,
                estado: error.response?.status
            });

            // Mensaje de error más específico
            let mensajeError = 'Error al registrar: ';
            if (error.response?.data?.message) {
                mensajeError += error.response.data.message;
            } else if (error.response?.status === 500) {
                mensajeError += 'Error interno del servidor. Por favor, intenta más tarde.';
            } else {
                mensajeError += error.message;
            }
            
            alert(mensajeError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100 px-4">
            {/* Modal de éxito */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                    <div className="bg-white rounded-2xl p-6 shadow-xl z-10 transform animate-fadeIn">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Registro Exitoso!</h3>
                            <p className="text-gray-500">Redirigiendo al inicio de sesión...</p>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex flex-col items-center justify-center w-full flex-1 text-center">
                <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-5xl p-6 md:p-12">
                    <div className="w-full md:w-2/5 bg-blue1 text-white rounded-tl-2xl rounded-bl-2xl py-36 px-8 md:px-12 flex flex-col items-center justify-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">¡Bienvenido de nuevo!</h2>
                        <div className="border-2 w-10 border-white inline-block mb-4"></div>
                        <p className="mb-4 text-sm md:text-base text-center">
                            ¿Ya tienes una cuenta? Inicia sesión para acceder a tu clínica veterinaria.
                        </p>
                        <NavLink to="/SignIn" className="border-2 border-white rounded-full px-10 py-2 inline-block font-semibold hover:bg-white hover:text-blue1 text-sm md:text-base">
                            Iniciar sesión
                        </NavLink>
                    </div>
                    <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col items-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">MascoTico Vet</h2>
                        <div className="border-2 w-10 border-blue1 inline-block mb-4"></div>
                        <p className="text-gray-500 mb-4 text-sm md:text-base">
                            Regístrate y comienza a gestionar tu clínica veterinaria de manera eficiente.
                        </p>

                        <div className="w-full space-y-6">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Imagen de Perfil
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue1 transition-colors">
                                    <div className="space-y-1 text-center">
                                        {previewImage ? (
                                            <div className="relative inline-block">
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    className="h-32 w-32 object-cover rounded-full"
                                                />
                                                <button
                                                    onClick={() => {
                                                        setPreviewImage(null);
                                                        setFormData(prev => ({ ...prev, imagen_perfil: null }));
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="flex text-sm text-gray-600">
                                                    <label
                                                        htmlFor="imagen_perfil"
                                                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue1 hover:text-blue2 focus-within:outline-none"
                                                    >
                                                        <span>Sube una foto</span>
                                                        <input
                                                            id="imagen_perfil"
                                                            name="imagen_perfil"
                                                            type="file"
                                                            className="sr-only"
                                                            accept="image/*"
                                                            onChange={handleChange}
                                                        />
                                                    </label>
                                                    <p className="pl-1">o arrastra y suelta</p>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    PNG, JPG, GIF hasta 10MB
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {["nombre", "apellido", "dni", "grado_estudio", "especialidad"].map((field) => (
                                    <input
                                        key={field}
                                        type="text"
                                        name={field}
                                        placeholder={field.replace("_", " ").toUpperCase()}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        className="bg-gray-100 p-3 rounded-lg outline-none text-sm w-full"
                                    />
                                ))}
                            </div>

                            <div className="space-y-4">
                                <div className="bg-gray-100 w-full p-3 flex items-center rounded-lg">
                                    <FaRegEnvelope className="text-gray-400 mr-2" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Correo"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="bg-gray-100 outline-none text-sm flex-1"
                                    />
                                </div>

                                <div className="bg-gray-100 w-full p-3 flex items-center rounded-lg">
                                    <MdLockOutline className="text-gray-400 mr-2" />
                                    <input
                                        type="password"
                                        name="contraseña"
                                        placeholder="Contraseña"
                                        value={formData.contraseña}
                                        onChange={handleChange}
                                        className="bg-gray-100 outline-none text-sm flex-1"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="acceptTerm"
                                    checked={formData.acceptTerm}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                <label className="text-sm text-gray-600">
                                    Acepto los términos y condiciones
                                </label>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`w-full bg-blue1 text-white rounded-xl px-12 py-3 font-semibold
                                    hover:bg-blue2 transition-colors duration-300 flex items-center justify-center
                                    ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Registrando...
                                    </div>
                                ) : (
                                    'Crear cuenta'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
