'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { listarEstabelecimentosCaptar, ListarCaptarResult } from '@/lib/server/actions/captar';

const statusLabels: Record<string, { text: string; class: string }> = {
  novo: { text: 'Novo', class: 'bg-blue-100 text-blue-800' },
  contatado: { text: 'Contatado', class: 'bg-yellow-100 text-yellow-800' },
  visitado: { text: 'Visitado', class: 'bg-purple-100 text-purple-800' },
  proposta_enviada: { text: 'Proposta Enviada', class: 'bg-orange-100 text-orange-800' },
  negociacao: { text: 'Em Negociação', class: 'bg-indigo-100 text-indigo-800' },
  convertido: { text: 'Convertido', class: 'bg-green-100 text-green-800' },
  nao_interessado: { text: 'Não Interessado', class: 'bg-red-100 text-red-800' }
};

export default function CaptarPage() {
  const [dados, setDados] = useState<ListarCaptarResult>({
    estabelecimentos: [], total: 0, paginas: 0, paginaAtual: 1
  });
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => { carregarDados(); }, [dados.paginaAtual]);

  async function carregarDados() {
    setLoading(true);
    const result = await listarEstabelecimentosCaptar(dados.paginaAtual, 20, busca, status);
    setDados(result);
    setLoading(false);
  }

  function mudarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= dados.paginas) {
      setDados(prev => ({ ...prev, paginaAtual: pagina }));
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <i className="lni lni-map-marker text-2xl text-blue-600"></i>
              <h1 className="text-2xl font-bold text-gray-900">Captar Estabelecimentos</h1>
            </div>
            <Link href="/administracao/captar/adicionar" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <i className="lni lni-plus"></i> Adicionar
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <div className="relative">
                <i className="lni lni-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Nome, email, responsável..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="novo">Novo</option>
                <option value="contatado">Contatado</option>
                <option value="visitado">Visitado</option>
                <option value="proposta_enviada">Proposta Enviada</option>
                <option value="negociacao">Em Negociação</option>
                <option value="convertido">Convertido</option>
                <option value="nao_interessado">Não Interessado</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={carregarDados}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
              >
                <i className="lni lni-search"></i> Filtrar
              </button>
            </div>
          </div>
        </div>

        {/* Lista */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estabelecimento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Localização</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contato</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Próximo Contato</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500"><i className="lni lni-spinner lni-spin mr-2"></i>Carregando...</td></tr>
                ) : dados.estabelecimentos.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Nenhum estabelecimento encontrado</td></tr>
                ) : (
                  dados.estabelecimentos.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{item.nome}</div>
                        {item.telefone && <div className="text-xs text-gray-500">{item.telefone}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{item.cidade}{item.estado && ` - ${item.estado}`}</div>
                        {item.endereco && <div className="text-xs text-gray-500 truncate max-w-xs">{item.endereco}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{item.responsavel || '-'}</div>
                        {item.telefone_responsavel && <div className="text-xs text-gray-500">{item.telefone_responsavel}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${statusLabels[item.status]?.class || 'bg-gray-100 text-gray-800'}`}>
                          {statusLabels[item.status]?.text || item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.data_retorno ? new Date(item.data_retorno).toLocaleDateString('pt-BR') : '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/administracao/captar/editar/${item.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Editar">
                            <i className="lni lni-pencil"></i>
                          </Link>
                          <Link href={`/administracao/captar/deletar/${item.id}`} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Excluir">
                            <i className="lni lni-trash"></i>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          {dados.paginas > 1 && (
            <div className="px-6 py-4 border-t flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Página {dados.paginaAtual} de {dados.paginas} ({dados.total} total)
              </div>
              <div className="flex gap-2">
                <button onClick={() => mudarPagina(dados.paginaAtual - 1)} disabled={dados.paginaAtual === 1} className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50">
                  <i className="lni lni-chevron-left"></i>
                </button>
                {Array.from({ length: Math.min(5, dados.paginas) }, (_, i) => {
                  let pageNum;
                  if (dados.paginas <= 5) pageNum = i + 1;
                  else if (dados.paginaAtual <= 3) pageNum = i + 1;
                  else if (dados.paginaAtual >= dados.paginas - 2) pageNum = dados.paginas - 4 + i;
                  else pageNum = dados.paginaAtual - 2 + i;
                  return (
                    <button key={pageNum} onClick={() => mudarPagina(pageNum)} className={`px-3 py-1 border rounded ${pageNum === dados.paginaAtual ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}>
                      {pageNum}
                    </button>
                  );
                })}
                <button onClick={() => mudarPagina(dados.paginaAtual + 1)} disabled={dados.paginaAtual === dados.paginas} className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50">
                  <i className="lni lni-chevron-right"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
