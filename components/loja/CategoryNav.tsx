'use client';

import Link from 'next/link';
import { Categoria } from '@/types/models';
import { cn } from '@/lib/utils/cn';

interface CategoryNavProps {
  categorias: Categoria[];
  estabelecimentoSubdominio: string;
  categoriaAtiva?: string;
}

export function CategoryNav({
  categorias,
  estabelecimentoSubdominio,
  categoriaAtiva,
}: CategoryNavProps) {
  if (categorias.length === 0) return null;

  return (
    <nav className="bg-white border-b sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
          <Link
            href={`/loja/${estabelecimentoSubdominio}`}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              !categoriaAtiva
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            Todos
          </Link>
          
          {categorias.map((categoria) => (
            <Link
              key={categoria.id}
              href={`/loja/${estabelecimentoSubdominio}?categoria=${categoria.id}`}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                categoriaAtiva === categoria.id.toString()
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {categoria.nome}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
