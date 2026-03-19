'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { buscarEstado, deletarEstado } from '@/lib/server/actions/estados';

export default function DeletarEstadoPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);
  
  const [loading, setLoading] = useState(true);
  const [deletando, setDeletando] = useState(false);
  const [erro, setErro] = useState('');
  const [estado, setEstado] = useState<{ id: number; nome: string; uf: string } | null>(null);
  
  useEffect(() => {
    carregarEstado();
  }, [id]);
  
  async function carregarEstado() {
    const data = await buscarEstado(id);
    if (data) {
      setEstado(data);
    } else {
      setErro('Estado não encontrado');
    }
    setLoading(false);
  }
  
  async function handleDeletar() {
    setDeletando(true);
    setErro('');
    
    const resultado = await deletarEstado(id);
    
    if (resultado.error) {
      setErro(resultado.error);
      setDeletando(false);
    } else {
      router.push('/administracao/estados');
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto px-4 flex items-center justify-center">
          <div className="text-gray-500">
            <i className="lni lni-spinner lni-spin text-2xl mr-2"></i>
            Carregando...
          </div>
        </div>
      </div>
    );
  }
  
  if (erro && !estado) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <i className="lni lni-warning text-3xl text-red-600"></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{erro}</h2>
            <Link
              href="/administracao/estados"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Voltar para Estados
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <i className="lni lni-trash text-3xl text-red-600"></i>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Confirmar Exclusão
            </h2>
            
            <p className="text-gray-500 mb-6">
              Tem certeza que deseja excluir o estado <strong>{estado?.nome} ({estado?.uf})</strong>?
              <br />
              <span className="text-red-500">Esta ação não pode ser desfeita.</span>
            </p>
            
            {erro && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-red-700">
                  <i className="lni lni-warning"></i>
                  <span>{erro}</span>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/administracao/estados"
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <i className="lni lni-close"></i>
                Cancelar
              </Link>
              
              <button
                onClick={handleDeletar}
                disabled={deletando}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletando ? (
                  <>
                    <i className="lni lni-spinner lni-spin"></i>
                    Excluindo...
                  </>
                ) : (
                  <>
                    <i className="lni lni-trash"></i>
                    Confirmar Exclusão
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
