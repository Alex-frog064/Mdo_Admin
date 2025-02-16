import { useState } from 'react';
import { FaFacebook, FaLinkedinIn, FaGoogle, FaRegEnvelope } from 'react-icons/fa';
import { MdLockOutline } from 'react-icons/md';
import { NavLink, useNavigate } from 'react-router-dom';
import axiosInstance from '../../Conexion/AxiosInstance';

export default function User() {
    const [email, setEmail] = useState("");
    const [contraseña, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/veterinario/login', {
                email,
                contraseña
            });
            const { token } = response.data;
            localStorage.setItem('jwt', token);
            navigate('/dates'); // Redirige a la página principal después del login
        } catch (err) {
            setError("Credenciales Incorrectas");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100 px-4">
            <main className="flex flex-col items-center justify-center w-full flex-1 text-center">
                <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl p-6 md:p-10">
                    <div className="w-full md:w-3/5 p-5 flex flex-col items-center">
                        <div className="text-left font-bold text-xl md:text-2xl w-full">
                            <span className="text-blue2">Masco</span>Tico
                        </div>
                        <div className='py-6 text-center w-full'>
                            <h2 className='text-2xl md:text-3xl font-bold mb-4'>
                                <span className='text-blue2'>Masco</span><span>Tico</span> Vet
                            </h2>
                            <div className='border-2 w-10 border-blue1 inline-block mb-4'></div>
                            <p className='text-gray-500 mb-4 text-sm md:text-base'>Gestiona tu clínica veterinaria de manera eficiente y cuida mejor a tus pacientes con nuestra web.</p>
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
                        <form onSubmit={handleLogin}>
                            <div className='w-full flex flex-col items-center'>
                                <p className='text-gray-400 my-3 text-sm md:text-base'>O usa tu cuenta de correo</p>
                                <div className='bg-gray-100 w-full md:w-80 p-3 flex items-center mb-4 rounded-lg'>
                                    <FaRegEnvelope className="text-gray-400 mr-2" />
                                    <input
                                        type="email"
                                        name='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder='Correo'
                                        className='bg-gray-100 outline-none text-sm flex-1'
                                        required
                                    />
                                </div>
                                <div className='bg-gray-100 w-full md:w-80 p-3 flex items-center mb-4 rounded-lg'>
                                    <MdLockOutline className="text-gray-400 mr-2" />
                                    <input
                                        type="password"
                                        name='contraseña'
                                        value={contraseña}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder='Contraseña'
                                        className='bg-gray-100 outline-none text-sm flex-1'
                                        required
                                    />
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <div className='flex justify-between w-full md:w-80 mb-5 text-xs md:text-sm'>
                                    <label className='flex items-center'>
                                        <input type="checkbox" name='remember' className='mr-1' /> Recuérdame
                                    </label>
                                    <a href="#" className='text-blue-500'>¿Olvidaste tu contraseña?</a>
                                </div>
                                <button type="submit" className='border-2 border-blue1 text-blue2 rounded-full px-12 py-2 inline-block font-semibold hover:bg-blue1 hover:text-white text-sm md:text-base'>
                                <NavLink to="/dates">
                                Iniciar sesión
                        </NavLink> 
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="w-2/5 bg-blue1 text-white rounded-tr-2xl rounded-br-2xl py-36 px-12">
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">¡Hola Veterinarios!</h2>
                        <div className="border-2 w-10 border-white inline-block mb-4"></div>
                        <p className="mb-4 text-sm md:text-base">
                            Gestiona tu clínica veterinaria de manera eficiente y cuida mejor a tus pacientes con nuestra web.
                        </p>
                        <NavLink to="/SignOn" className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-blue1 text-sm md:text-base">
                            Regístrate
                        </NavLink>
                    </div>
                </div>
            </main>
        </div>
    );
}
