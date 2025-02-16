import { FaFacebook, FaLinkedinIn, FaGoogle, FaRegEnvelope } from 'react-icons/fa';
import { MdLockOutline } from 'react-icons/md';
import { NavLink } from 'react-router-dom';

export default function Register() {
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
                        <NavLink to="/SignIn" className="border-2 border-white rounded-full px-10 py-2 inline-block font-semibold hover:bg-white hover:text-blue1 text-sm md:text-base">Iniciar sesión</NavLink>
                    </div>
                    <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col items-center">
                        <div className="text-left font-bold text-xl md:text-2xl w-full">
                            <span className="text-blue2">Masco</span>Tico
                        </div>
                        <div className='py-6 text-center w-full'>
                            <h2 className='text-2xl md:text-3xl font-bold mb-4'>
                                <span className='text-blue2'>Masco</span><span>Tico</span> Vet
                            </h2>
                            <div className='border-2 w-10 border-blue1 inline-block mb-4'></div>
                            <p className='text-gray-500 mb-4 text-sm md:text-base'>Regístrate y comienza a gestionar tu clínica veterinaria de manera eficiente.</p>
                            <div className='flex justify-center my-4'>
                                <a href="#" className='border-2 border-gray-200 rounded-full p-3 mx-2'>
                                    <FaFacebook className='text-lg'/>
                                </a>
                                <a href="#" className='border-2 border-gray-200 rounded-full p-3 mx-2'>
                                    <FaLinkedinIn className='text-lg'/>
                                </a>
                                <a href="#" className='border-2 border-gray-200 rounded-full p-3 mx-2'>
                                    <FaGoogle className='text-lg'/>
                                </a>
                            </div>
                        </div>
                        <div className='w-full flex flex-col items-center'>
                            <p className='text-gray-400 my-3 text-sm md:text-base'>O usa tu correo para registrarte</p>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full'>
                                <input type="text" name='nombre' placeholder='Nombre' className='bg-gray-100 p-3 rounded-lg outline-none text-sm w-full' />
                                <input type="text" name='apellido' placeholder='Apellido' className='bg-gray-100 p-3 rounded-lg outline-none text-sm w-full' />
                                <input type="text" name='dni' placeholder='DNI' className='bg-gray-100 p-3 rounded-lg outline-none text-sm w-full' />
                                <input type="text" name='grado_estudio' placeholder='Grado de estudio' className='bg-gray-100 p-3 rounded-lg outline-none text-sm w-full' />
                                <input type="text" name='especialidad' placeholder='Especialidad' className='bg-gray-100 p-3 rounded-lg outline-none text-sm w-full' />
                                <input type="text" name='imagen_perfil' placeholder='URL de imagen de perfil' className='bg-gray-100 p-3 rounded-lg outline-none text-sm w-full' />
                            </div>
                            <div className='bg-gray-100 w-full p-3 flex items-center my-4 rounded-lg'>
                                <FaRegEnvelope className="text-gray-400 mr-2"/>
                                <input type="email" name='email' placeholder='Correo' className='bg-gray-100 outline-none text-sm flex-1' />
                            </div>
                            <div className='bg-gray-100 w-full p-3 flex items-center mb-4 rounded-lg'>
                                <MdLockOutline className="text-gray-400 mr-2"/>
                                <input type="password" name='password' placeholder='Contraseña' className='bg-gray-100 outline-none text-sm flex-1' />
                            </div>
                            <a className='border-2 border-blue1 text-blue2 rounded-full px-12 py-2 inline-block font-semibold hover:bg-blue1 hover:text-white text-sm md:text-base'>  <NavLink to="/">Registrarse </NavLink></a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
