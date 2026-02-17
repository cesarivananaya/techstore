import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiZap } from 'react-icons/fi';
import { useAuth } from '../hooks';
import { Button, Input } from '../components/common';

const loginSchema = yup.object({
    email: yup.string().email('Email inválido').required('Requerido'),
    password: yup.string().min(6, 'Mínimo 6 caracteres').required('Requerido'),
});

export default function Login() {
    const { login, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/';

    useEffect(() => { if (isAuthenticated()) navigate(from, { replace: true }); }, []);

    const { register, handleSubmit, setError, formState: { errors } } = useForm({ resolver: yupResolver(loginSchema) });

    const onSubmit = async (data) => {
        const res = await login(data.email, data.password);
        if (!res.success) setError('root', { message: res.message });
        else navigate(from, { replace: true });
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <FiZap className="w-8 h-8 text-violet-400" />
                        <span className="text-2xl font-black bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">TechStore</span>
                    </div>
                    <h1 className="text-3xl font-black text-white">Bienvenido</h1>
                    <p className="text-gray-400 mt-2">Inicia sesión en tu cuenta</p>
                </div>

                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <Input label="Email" type="email" placeholder="tu@email.com" {...register('email')} error={errors.email?.message} />
                        <Input label="Contraseña" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />

                        {errors.root && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
                                {errors.root.message}
                            </div>
                        )}

                        <Button type="submit" variant="primary" size="lg" loading={isLoading} className="w-full">
                            Iniciar Sesión
                        </Button>
                    </form>

                    <div className="mt-4 p-3 bg-violet-500/10 border border-violet-500/20 rounded-xl text-xs text-violet-300">
                        <strong>Demo:</strong> demo@techstore.com / Demo1234
                    </div>

                    <p className="text-center text-sm text-gray-400 mt-6">
                        ¿No tienes cuenta?{' '}
                        <Link to="/register" className="text-violet-400 hover:text-violet-300 font-semibold">Regístrate</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
