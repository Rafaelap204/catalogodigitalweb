'use client';

import Image from 'next/image';
import { Estabelecimento } from '@/types/models';
import { MapPin, Phone, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';

interface StoreHeaderProps {
  estabelecimento: Estabelecimento;
}

export function StoreHeader({ estabelecimento }: StoreHeaderProps) {
  const isOpen = estabelecimento.funcionamento === 1;

  return (
    <header className="bg-white shadow-sm">
      {/* Cover Image */}
      <div className="relative h-32 md:h-48 bg-gray-200">
        {estabelecimento.capa ? (
          <Image
            src={estabelecimento.capa}
            alt={estabelecimento.nome}
            fill
            className="object-cover"
          />
        ) : (
          <div 
            className="w-full h-full"
            style={{ backgroundColor: estabelecimento.cor || '#3b82f6' }}
          />
        )}
      </div>

      {/* Store Info */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-12 md:-mt-16 flex flex-col md:flex-row md:items-end gap-4 pb-6">
          {/* Avatar */}
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
            {estabelecimento.perfil ? (
              <Image
                src={estabelecimento.perfil}
                alt={estabelecimento.nome}
                fill
                className="object-cover"
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center text-white text-2xl font-bold"
                style={{ backgroundColor: estabelecimento.cor || '#3b82f6' }}
              >
                {estabelecimento.nome.charAt(0)}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 md:pb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {estabelecimento.nome}
            </h1>
            
            {estabelecimento.descricao && (
              <p className="text-gray-600 mt-1 line-clamp-2">
                {estabelecimento.descricao}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
              {estabelecimento.endereco && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {estabelecimento.endereco}
                  {estabelecimento.numero && `, ${estabelecimento.numero}`}
                </span>
              )}
              
              {estabelecimento.telefone && (
                <span className="flex items-center gap-1">
                  <Phone size={14} />
                  {estabelecimento.telefone}
                </span>
              )}

              <span className="flex items-center gap-1">
                <Clock size={14} />
                <span className={isOpen ? 'text-green-600' : 'text-red-600'}>
                  {isOpen ? 'Aberto' : 'Fechado'}
                </span>
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="md:pb-2">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                isOpen
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isOpen ? 'bg-green-600' : 'bg-red-600'
                }`}
              />
              {isOpen ? 'Aceitando pedidos' : 'Fechado'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
