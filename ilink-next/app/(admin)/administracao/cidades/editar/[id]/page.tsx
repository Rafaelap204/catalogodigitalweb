'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { buscarCidade, atualizarCidade, Cidade } from '@/lib/server/actions/cidades';
import { listarTodosEstados, Estado } from '@/lib/server/actions/estados';

export default function EditarCidadePage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);
  
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [cidade, setCidade] = useState<Cidade | null>(null);
  const [estados, setEstados] = useState<Estado[]>([]);
  
  useEffect(() => {
    carregarDados();
  }, [id]);
  
  async function carregarDados() {
    const [cidadeData, estadosData] = await Promise.all([
      buscarCidade(id),
      listarTodosEstados(),
    ]);
    
    if (cidadeData) {
      setCidade(cidadeData);
    } else {
      setErro('Cidade não encontrada');
    }
    setEstados(estadosData);
    setLoading(false);
  }
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSalvando(true);
    setErro('');
    
    const formData = new FormData(e.currentTarget);
    const resultado = await atualizarCidade(id, formData);
    
    if (resultado.error) {
      setErro(resultado.error);
      setSalvando(false);
    } else {
      setSucesso(true);
      setTimeout(() => {
        router.push('/administracao/cidades');
      }, 1500);
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-gray-500">
          <i className="lni lni-spinner lni-spin text-2xl mr-2"></i>
          Carregando...
        </div>
      </div>
    );
  }
  
  if (erro && !cidade) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <i className="lni lni-warning text-3xl text-red-600"></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{erro}</h2>
            <Link href="/administracao/cidades" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Voltar para Cidades
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <i className="lni lni-pin text-2xl text-blue-600"></i>
            <h1 className="text-2xl font-bold text-gray-900">Editar Cidade</h1>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/administracao/inicio" className="hover:text-blue-600">
              <i className="lni lni-home"></i>
            </Link>
            <span>/</span>
            <Link href="/administracao/cidades" className="hover:text-blue-600">Cidades</Link>
            <span>/</span>
            <span className="text-gray-700">Editar</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm">
          {sucesso ? (
            <div className="p-8 text-center">
              <div className="mb-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="lni lni-checkmark text-3xl text-green-600"></i>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Cidade atualizada com sucesso!</h2>
              <p className="text-gray-500">Redirecionando...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6">
              {erro && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <i className="lni lni-warning"></i>
                    <span>{erro}</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">Estado: *</label>
                  <select
                    id="estado"
                    name="estado"
                    required
                    defaultValue={cidade?.estado}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione o estado</option>
                    {estados.map((estado) => (
                      <option key={estado.id} value={estado.id}>
                        {estado.nome} ({estado.uf})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">Nome: *</label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    required
                    defaultValue={cidade?.nome}
                    placeholder="Digite o nome da cidade"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <i className="lni lni-chevron-left"></i>
                  Voltar
                </button>
                
                <button type="submit" disabled={salvando} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  {salvando ? (
                    <><i className="lni lni-spinner lni-spin"></i> Salvando...</>
                  ) : (
                    <>Salvar <i className="lni lni-checkmark"></i></>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
