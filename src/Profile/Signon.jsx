import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFacebook, FaLinkedinIn, FaGoogle, FaRegEnvelope } from 'react-icons/fa';
import { MdLockOutline } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import axiosInstance from '../../Conexion/AxiosInstance';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        grado_estudio: '',
        especialidad: '',
        nombre: '',
        apellido: '',
        dni: '',
        email: '',
        contraseña: '',
        imagen_perfil: '',
        acceptTerm: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.acceptTerm) {
            alert('Debes aceptar los términos y condiciones.');
            return;
        }

        try {
            const response = await axiosInstance.post('/veterinario/register', {
                grado_estudio: formData.grado_estudio,
                especialidad: formData.especialidad,
                nombre: formData.nombre,
                apellido: formData.apellido,
                dni: formData.dni,
                email: formData.email,
                contraseña: formData.contraseña,
                imagen_perfil: formData.imagen_perfil,
            });

            localStorage.setItem('jwt', response.data.token);
            alert('¡Cuenta creada exitosamente!');
            navigate('/SignIn');
        } catch (error) {
            console.error('Error al registrar:', error);
            alert('Ocurrió un error al registrar tu cuenta. Inténtalo de nuevo.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100 px-4">
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
                        <p className="text-gray-500 mb-4 text-sm md:text-base">Regístrate y comienza a gestionar tu clínica veterinaria de manera eficiente.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            {["nombre", "apellido", "dni", "grado_estudio", "especialidad", "imagen_perfil"].map((field) => (
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

                        <div className="bg-gray-100 w-full p-3 flex items-center my-4 rounded-lg">
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

                        <div className="bg-gray-100 w-full p-3 flex items-center mb-4 rounded-lg">
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

                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                name="acceptTerm"
                                checked={formData.acceptTerm}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            <label className="text-sm text-gray-600">Acepto los términos y condiciones</label>
                        </div>

                        <button onClick={handleSubmit} className="border-2 border-blue1 text-blue2 rounded-full px-12 py-2 inline-block font-semibold hover:bg-blue1 hover:text-white text-sm md:text-base">
                            Registrarse
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
