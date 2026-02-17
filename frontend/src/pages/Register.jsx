import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiZap } from 'react-icons/fi';
import { useAuth } from '../hooks';
import { Button, Input } from '../components/common';

const registerSchema = yup.object({
    nombre: yup.string().min(2).required('Requerido'),
    email: yup.string().email('Email inválido').required('Requerido'),
    password: yup.string().min(8).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Debe incluir mayúscula, minúscula y número').required('Requerido'),
});

export default function Register() {
    const { register: registerUser, isLoading } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, setError, formState: { errors } } = useForm({ resolver: yupResolver(registerSchema) });

    const onSubmit = async (data) => {
        const res = await registerUser(data);
        if (!res.success) setError('root', { message: res.message });
        else navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <FiZap className="w-8 h-8 text-violet-400" />
                        <span className="text-2xl font-black bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">TechStore</span>
                    </div>
                    <h1 className="text-3xl font-black text-white">Crear Cuenta</h1>
                    <p className="text-gray-400 mt-2">Únete a TechStore hoy</p>
                </div>
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <Input label="Nombre completo" placeholder="Tu Nombre" {...register('nombre')} error={errors.nombre?.message} />
                        <Input label="Email" type="email" placeholder="tu@email.com" {...register('email')} error={errors.email?.message} />
                        <Input label="Contraseña" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />
                        {errors.root && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">{errors.root.message}</div>}
                        <Button type="submit" variant="primary" size="lg" loading={isLoading} className="w-full">Crear Cuenta</Button>
                    </form>
                    <p className="text-center text-sm text-gray-400 mt-6">
                        ¿Ya tienes cuenta? <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold">Inicia sesión</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
