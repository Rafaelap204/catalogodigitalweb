'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { listarSubdominios, ListarSubdominiosResult, getTipoSubdominioLabel } from '@/lib/server/actions/subdominios';

const TIPOS = [
  { value: 1, label: 'Estabelecimento' },
  { value: 2, label: 'Cidade' },
  { value: 3, label: 'URL' },
  { value: 4, label: 'Outro' },
];

export default function SubdominiosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [dados, setDados] = useState<ListarSubdominiosResult>({
    subdominios: [],
    total: 0,
    paginas: 0,
    paginaAtual: 1,
  });
  const [loading, setLoading] = useState(true);
  const [filtroSubdominio, setFiltroSubdominio] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  
  const pagina = parseInt(searchParams.get('pagina') || '1');
  
  useEffect(() => {
    carregarSubdominios();
  }, [pagina]);
  
  async function carregarSubdominios() {
    setLoading(true);
    const resultado = await listarSubdominios({
      pagina,
      limite: 20,
      subdominio: filtroSubdominio || undefined,
      tipo: filtroTipo ? parseInt(filtroTipo) : undefined,
    });
    setDados(resultado);
    setLoading(false);
  }
  
  function aplicarFiltro(e: React.FormEvent) {
    e.preventDefault();
    carregarSubdominios();
  }
  
  function mudarPagina(novaPagina: number) {
    if (novaPagina >= 1 && novaPagina <= dados.paginas) {
      router.push(`/administracao/subdominios?pagina=${novaPagina}`);
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <i className="lni lni-world text-2xl text-blue-600"></i>
            <h1 className="text-2xl font-bold text-gray-900">Subdomínios</h1>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/administracao/inicio" className="hover:text-blue-600"><i className="lni lni-home"></i></Link>
            <span>/</span>
            <span className="text-gray-700">Subdomínios</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <form onSubmit={aplicarFiltro} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Buscar subdomínio..."
              value={filtroSubdominio}
              onChange={(e) => setFiltroSubdominio(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os tipos</option>
              {TIPOS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <button type="submit" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              <i className="lni lni-search"></i>
            </button>
            <Link href="/administracao/subdominios/adicionar" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
              <i className="lni lni-plus"></i> Adicionar
            </Link>
          </form>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <i className="lni lni-spinner lni-spin text-2xl mr-2"></i> Carregando...
            </div>
          ) : dados.subdominios.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <i className="lni lni-inbox text-4xl mb-4 block"></i>
              Nenhum subdomínio encontrado
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subdomínio</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destino</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {dados.subdominios.map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{sub.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sub.subdominio}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                            {getTipoSubdominioLabel(sub.tipo)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sub.url ? (
                            <a href={sub.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-xs block">
                              {sub.url}
                            </a>
                          ) : sub.rel_id ? (
                            <span className="text-gray-600">ID: {sub.rel_id}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex justify-end gap-2">
                            <Link href={`/administracao/subdominios/editar/${sub.id}`} className="text-blue-600 hover:text-blue-900 p-2">
                              <i className="lni lni-pencil"></i>
                            </Link>
                            <Link href={`/administracao/subdominios/deletar/${sub.id}`} className="text-red-600 hover:text-red-900 p-2">
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
                    Mostrando {((pagina - 1) * 20) + 1} - {Math.min(pagina * 20, dados.total)} de {dados.total}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => mudarPagina(pagina - 1)} disabled={pagina <= 1} className="px-3 py-1 border rounded-md disabled:opacity-50">
                      <i className="lni lni-chevron-left"></i>
                    </button>
                    {Array.from({ length: Math.min(5, dados.paginas) }, (_, i) => {
                      const pageNum = dados.paginas <= 5 ? i + 1 : pagina <= 3 ? i + 1 : pagina >= dados.paginas - 2 ? dados.paginas - 4 + i : pagina - 2 + i;
                      return (
                        <button key={pageNum} onClick={() => mudarPagina(pageNum)} className={`px-3 py-1 border rounded-md ${pagina === pageNum ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}>
                          {pageNum}
                        </button>
                      );
                    })}
                    <button onClick={() => mudarPagina(pagina + 1)} disabled={pagina >= dados.paginas} className="px-3 py-1 border rounded-md disabled:opacity-50">
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
