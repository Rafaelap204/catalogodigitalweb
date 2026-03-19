'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { listarCidades, ListarCidadesResult } from '@/lib/server/actions/cidades';
import { listarTodosEstados, Estado } from '@/lib/server/actions/estados';

export default function CidadesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [dados, setDados] = useState<ListarCidadesResult>({
    cidades: [],
    total: 0,
    paginas: 0,
    paginaAtual: 1,
  });
  const [estados, setEstados] = useState<Estado[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  
  const pagina = parseInt(searchParams.get('pagina') || '1');
  
  useEffect(() => {
    carregarEstados();
    carregarCidades();
  }, [pagina]);
  
  async function carregarEstados() {
    const lista = await listarTodosEstados();
    setEstados(lista);
  }
  
  async function carregarCidades() {
    setLoading(true);
    const resultado = await listarCidades({
      pagina,
      limite: 20,
      nome: filtroNome || undefined,
      estado: filtroEstado ? parseInt(filtroEstado) : undefined,
    });
    setDados(resultado);
    setLoading(false);
  }
  
  function aplicarFiltro(e: React.FormEvent) {
    e.preventDefault();
    carregarCidades();
  }
  
  function mudarPagina(novaPagina: number) {
    if (novaPagina >= 1 && novaPagina <= dados.paginas) {
      router.push(`/administracao/cidades?pagina=${novaPagina}`);
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <i className="lni lni-pin text-2xl text-blue-600"></i>
            <h1 className="text-2xl font-bold text-gray-900">Cidades</h1>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/administracao/inicio" className="hover:text-blue-600">
              <i className="lni lni-home"></i>
            </Link>
            <span>/</span>
            <span className="text-gray-700">Cidades</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <form onSubmit={aplicarFiltro} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Buscar cidade..."
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os estados</option>
              {estados.map((estado) => (
                <option key={estado.id} value={estado.id}>
                  {estado.nome} ({estado.uf})
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <i className="lni lni-search"></i>
            </button>
            <Link
              href="/administracao/cidades/adicionar"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <i className="lni lni-plus"></i>
              Adicionar
            </Link>
          </form>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <i className="lni lni-spinner lni-spin text-2xl mr-2"></i>
              Carregando...
            </div>
          ) : dados.cidades.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <i className="lni lni-inbox text-4xl mb-4 block"></i>
              Nenhuma cidade encontrada
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {dados.cidades.map((cidade) => (
                      <tr key={cidade.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{cidade.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cidade.nome}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                            {cidade.estado_uf || '-'} - {cidade.estado_nome || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <Link href={`/administracao/cidades/editar/${cidade.id}`} className="text-blue-600 hover:text-blue-900 p-2" title="Editar">
                              <i className="lni lni-pencil"></i>
                            </Link>
                            <Link href={`/administracao/cidades/deletar/${cidade.id}`} className="text-red-600 hover:text-red-900 p-2" title="Deletar">
                              <i className="lni lni-trash"></i>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {dados.paginas > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Mostrando {((pagina - 1) * 20) + 1} - {Math.min(pagina * 20, dados.total)} de {dados.total} resultados
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => mudarPagina(pagina - 1)} disabled={pagina <= 1} className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50">
                      <i className="lni lni-chevron-left"></i>
                    </button>
                    {Array.from({ length: Math.min(5, dados.paginas) }, (_, i) => {
                      let pageNum = dados.paginas <= 5 ? i + 1 : pagina <= 3 ? i + 1 : pagina >= dados.paginas - 2 ? dados.paginas - 4 + i : pagina - 2 + i;
                      return (
                        <button key={pageNum} onClick={() => mudarPagina(pageNum)} className={`px-3 py-1 border rounded-md ${pagina === pageNum ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'}`}>
                          {pageNum}
                        </button>
                      );
                    })}
                    <button onClick={() => mudarPagina(pagina + 1)} disabled={pagina >= dados.paginas} className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50">
                      <i className="lni lni-chevron-right"></i>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
