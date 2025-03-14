import { useState } from 'react';
import { FaFacebook, FaLinkedinIn, FaGoogle, FaRegEnvelope } from 'react-icons/fa';
import { MdLockOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../Conexion/AxiosInstance';

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [contraseña, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/veterinario/login', { email, contraseña });

            console.log("Respuesta de la API:", response.data);

            // Extraer el token y los datos del usuario de la respuesta
            const { JWT, ...usuarioData } = response.data; 

            // Guardar en localStorage
            localStorage.setItem('jwt', JWT);  // Guardamos solo el JWT
            localStorage.setItem('usuario', JSON.stringify(usuarioData)); // Guardamos el resto de los datos

            // Redirigir al dashboard
            navigate('/dashboard/help');
        } catch (err) {
            setError("Credenciales Incorrectas");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100 px-4">
            <main className="flex flex-col items-center justify-center w-full flex-1 text-center">
                <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl p-6 md:p-10">
                    
                    {/* Sección de Inicio de Sesión */}
                    <div className="w-full md:w-3/5 p-5 flex flex-col items-center">
                        <div className="text-left font-bold text-xl md:text-2xl w-full">
                            <span className="text-blue2">Masco</span>Tico
                        </div>
                        <div className='py-6 text-center w-full'>
                            <h2 className='text-2xl md:text-3xl font-bold mb-4'>
                                <span className='text-blue2'>Masco</span><span>Tico</span> Vet
                            </h2>
                            <div className='border-2 w-10 border-blue1 inline-block mb-4'></div>
                            <p className='text-gray-500 mb-4 text-sm md:text-base'>
                                Gestiona tu clínica veterinaria de manera eficiente y cuida mejor a tus pacientes con nuestra web.
                            </p>
                            <div className='flex justify-center my-4'>
                                <a href="#" className='border-2 border-gray-200 rounded-full p-3 mx-2'>
                                    <FaFacebook className='text-lg' />
                                </a>
                                <a href="#" className='border-2 border-gray-200 rounded-full p-3 mx-2'>
                                    <FaLinkedinIn className='text-lg' />
                                </a>
                                <a href="#" className='border-2 border-gray-200 rounded-full p-3 mx-2'>
                                    <FaGoogle className='text-lg' />
                                </a>
                            </div>
                        </div>
                        
                        {/* Formulario de Inicio de Sesión */}
                        <form onSubmit={handleLogin} className="w-full flex flex-col items-center">
                            <p className='text-gray-400 my-3 text-sm md:text-base'>O usa tu cuenta de correo</p>

                            {/* Input de Email */}
                            <div className='bg-gray-100 w-full md:w-80 p-3 flex items-center mb-4 rounded-lg'>
                                <FaRegEnvelope className="text-gray-400 mr-2" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='Correo'
                                    className='bg-gray-100 outline-none text-sm flex-1'
                                    required
                                />
                            </div>

                            {/* Input de Contraseña */}
                            <div className='bg-gray-100 w-full md:w-80 p-3 flex items-center mb-4 rounded-lg'>
                                <MdLockOutline className="text-gray-400 mr-2" />
                                <input
                                    type="password"
                                    value={contraseña}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder='Contraseña'
                                    className='bg-gray-100 outline-none text-sm flex-1'
                                    required
                                />
                            </div>

                            {/* Mensaje de error */}
                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            {/* Recordarme y Olvidé mi contraseña */}
                            <div className='flex justify-between w-full md:w-80 mb-5 text-xs md:text-sm'>
                                <label className='flex items-center'>
                                    <input type="checkbox" name='remember' className='mr-1' /> Recuérdame
                                </label>
                                <a href="#" className='text-blue-500'>¿Olvidaste tu contraseña?</a>
                            </div>

                            {/* Botón de Iniciar Sesión */}
                            <button 
                                type="submit" 
                                className='border-2 border-blue1 text-blue2 rounded-full px-12 py-2 inline-block font-semibold hover:bg-blue1 hover:text-white text-sm md:text-base'>
                                Iniciar sesión
                            </button>
                        </form>
                    </div>

                    {/* Sección Derecha */}
                    <div className="w-2/5 bg-blue1 text-white rounded-tr-2xl rounded-br-2xl py-36 px-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">¡Hola Veterinarios!</h2>
                        <div className="border-2 w-10 border-white inline-block mb-4"></div>
                        <p className="mb-4 text-sm md:text-base">
                            Gestiona tu clínica veterinaria de manera eficiente y cuida mejor a tus pacientes con nuestra web.
                        </p>
                        <a href="/SignOn" className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-blue1 text-sm md:text-base">
                            Regístrate
                        </a>
                    </div>

                </div>
            </main>
        </div>
    );
}
