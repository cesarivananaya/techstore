import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FiUploadCloud, FiX, FiCheck } from 'react-icons/fi';
import { useCreateProduct } from '../hooks';
import { Input, Select, Button, Card } from '../components/common';
import { CATEGORIAS } from '../utils';
import * as yup from 'yup';

// Schema de validación
const schema = yup.object({
    nombre: yup.string().required('El nombre es requerido'),
    descripcion: yup.string().required('La descripción es requerida'),
    precio: yup.number().positive('Debe ser positivo').required('El precio es requerido'),
    stock: yup.number().integer().min(0).required('El stock es requerido'),
    categoria: yup.string().required('La categoría es requerida'),
    marca: yup.string().required('La marca es requerida'),
    // Imágenes se manejan aparte para simplificar
});

export default function Admin() {
    const { mutate: createProduct, isPending } = useCreateProduct();
    const [images, setImages] = useState([]);
    const [imageUrl, setImageUrl] = useState('');

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = (data) => {
        // Generar SKU automático único
        const sku = `${data.marca.slice(0, 3).toUpperCase()}-${data.categoria.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;

        // Formatear datos para el backend
        const payload = {
            ...data,
            sku,
            precio: Number(data.precio),
            stock: Number(data.stock),
            imagenes: images.map((url, i) => ({ url, esPrincipal: i === 0, alt: data.nombre })),
            especificaciones: {}, // TODO: Agregar campos dinámicos si es necesario
        };

        createProduct(payload, {
            onSuccess: () => {
                reset();
                setImages([]);
            }
        });
    };

    const addImage = () => {
        if (!imageUrl) return;
        setImages([...images, imageUrl]);
        setImageUrl('');
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white py-12">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-black mb-8">Panel de Administración</h1>

                <Card className="p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <FiUploadCloud className="text-violet-400" /> Nuevo Producto
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Nombre del Producto" {...register('nombre')} error={errors.nombre?.message} />
                            <Input label="Marca" {...register('marca')} error={errors.marca?.message} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Precio ($)" type="number" step="0.01" {...register('precio')} error={errors.precio?.message} />
                            <Input label="Stock" type="number" {...register('stock')} error={errors.stock?.message} />
                        </div>

                        <Select label="Categoría" {...register('categoria')} error={errors.categoria?.message}>
                            <option value="">Seleccionar...</option>
                            {CATEGORIAS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                        </Select>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-gray-300">Descripción</label>
                            <textarea
                                {...register('descripcion')}
                                rows="4"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-violet-500 transition-all"
                            />
                            {errors.descripcion && <p className="text-xs text-red-400">{errors.descripcion.message}</p>}
                        </div>

                        {/* Gestión de Imágenes Simple */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-300">Imágenes (URL)</label>
                            <div className="flex gap-2">
                                <Input
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://ejemplo.com/foto.jpg"
                                    className="flex-1"
                                />
                                <Button type="button" onClick={addImage} variant="secondary">Agregar</Button>
                            </div>
                            <p className="text-xs text-gray-500">Pega el enlace directo a una imagen alojada en internet (imgur, cloudinary, etc.)</p>

                            {images.length > 0 && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {images.map((img, i) => (
                                        <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/10 group shrink-0">
                                            <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 transition-all"
                                            >
                                                <FiX size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Button type="submit" loading={isPending} className="w-full">
                            {isPending ? 'Creando...' : 'Publicar Producto'}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
