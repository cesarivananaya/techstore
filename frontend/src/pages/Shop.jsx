import { useState, useLayoutEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks';
import { ProductGrid } from '../components/product';
import { CATEGORIAS, SORT_OPTIONS } from '../utils';

export default function Shop() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        categoria: searchParams.get('categoria') || '',
        precioMin: searchParams.get('precioMin') || '',
        precioMax: searchParams.get('precioMax') || '',
        sort: 'createdAt:DESC',
        page: 1,
    });

    // Sincronizar filtros con URL params
    useLayoutEffect(() => {
        setFilters(f => ({
            ...f,
            search: searchParams.get('search') || '',
            categoria: searchParams.get('categoria') || '',
            precioMin: searchParams.get('precioMin') || '',
            precioMax: searchParams.get('precioMax') || '',
            page: 1
        }));
    }, [searchParams]);

    const [sortOrd, sortDir] = filters.sort.split(':');
    const { data, isLoading } = useProducts({
        search: filters.search,
        categoria: filters.categoria || undefined,
        precioMin: filters.precioMin || undefined,
        precioMax: filters.precioMax || undefined,
        ordenar: sortOrd,
        dir: sortDir,
        page: filters.page,
        limit: 12,
    });

    const setFilter = (key, val) => {
        const newParams = new URLSearchParams(searchParams);
        if (val) {
            newParams.set(key, val);
        } else {
            newParams.delete(key);
        }
        newParams.set('page', '1'); // Reset page on filter change
        setSearchParams(newParams);
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white py-10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-4xl font-black mb-2">
                        {filters.categoria
                            ? CATEGORIAS.find(c => c.id === filters.categoria)?.label || 'Productos'
                            : 'Todos los Productos'}
                    </h1>
                    {data && (
                        <p className="text-gray-400">
                            Mostrando {data.data?.length || 0} de {data.meta?.total} resultados
                            {filters.search && ` para "${filters.search}"`}
                        </p>
                    )}
                </div>

                {/* Controles */}
                <div className="flex flex-wrap gap-3 mb-8 items-center">
                    {/* Categorías */}
                    <div className="flex gap-2 flex-wrap flex-1">
                        <button
                            onClick={() => setFilter('categoria', '')}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!filters.categoria ? 'bg-violet-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                        >
                            Todas
                        </button>
                        {CATEGORIAS.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => setFilter('categoria', c.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filters.categoria === c.id ? 'bg-violet-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>

                    {/* Ordenar */}
                    <select
                        value={filters.sort}
                        onChange={(e) => {
                            const newParams = new URLSearchParams(searchParams);
                            newParams.set('sort', e.target.value);
                            setSearchParams(newParams);
                        }}
                        className="bg-gray-800 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-violet-500"
                    >
                        {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </div>

                <ProductGrid products={data?.data} loading={isLoading} />

                {/* Paginación */}
                {data?.meta?.totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-12">
                        {Array.from({ length: data.meta.totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => {
                                    const newParams = new URLSearchParams(searchParams);
                                    newParams.set('page', p.toString());
                                    setSearchParams(newParams);
                                }}
                                className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${filters.page === p ? 'bg-violet-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
