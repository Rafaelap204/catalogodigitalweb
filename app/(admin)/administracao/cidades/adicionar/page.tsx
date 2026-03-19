'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { criarCidade } from '@/lib/server/actions/cidades';
import { listarTodosEstados, Estado } from '@/lib/server/actions/estados';

export default function AdicionarCidadePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [estados, setEstados] = useState<Estado[]>([]);
  
  useEffect(() => {
    carregarEstados();
  }, []);
  
  async function carregarEstados() {
    const lista = await listarTodosEstados();
    setEstados(lista);
  }
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErro('');
    
    const formData = new FormData(e.currentTarget);
    const resultado = await criarCidade(formData);
    
    if (resultado.error) {
      setErro(resultado.error);
      setLoading(false);
    } else {
      setSucesso(true);
      setTimeout(() => {
        router.push('/administracao/cidades');
      }, 1500);
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <i className="lni lni-pin text-2xl text-blue-600"></i>
            <h1 className="text-2xl font-bold text-gray-900">Adicionar Cidade</h1>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/administracao/inicio" className="hover:text-blue-600">
              <i className="lni lni-home"></i>
            </Link>
            <span>/</span>
            <Link href="/administracao/cidades" className="hover:text-blue-600">Cidades</Link>
            <span>/</span>
            <span className="text-gray-700">Adicionar</span>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Cidade cadastrada com sucesso!</h2>
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
                
                <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? (
                    <><i className="lni lni-spinner lni-spin"></i> Cadastrando...</>
                  ) : (
                    <>Cadastrar <i className="lni lni-chevron-right"></i></>
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
