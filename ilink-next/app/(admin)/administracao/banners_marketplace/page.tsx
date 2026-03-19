'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { listarBanners, ListarBannersResult } from '@/lib/server/actions/banners-marketplace';

export default function BannersMarketplacePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dados, setDados] = useState<ListarBannersResult>({ banners: [], total: 0, paginas: 0, paginaAtual: 1 });
  const [loading, setLoading] = useState(true);
  const [filtroTitulo, setFiltroTitulo] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const pagina = parseInt(searchParams.get('pagina') || '1');
  
  useEffect(() => { carregarBanners(); }, [pagina]);
  
  async function carregarBanners() {
    setLoading(true);
    const resultado = await listarBanners({ pagina, limite: 20, titulo: filtroTitulo || undefined, status: filtroStatus ? parseInt(filtroStatus) : undefined });
    setDados(resultado);
    setLoading(false);
  }
  
  function aplicarFiltro(e: React.FormEvent) { e.preventDefault(); carregarBanners(); }
  function mudarPagina(novaPagina: number) { if (novaPagina >= 1 && novaPagina <= dados.paginas) router.push(`/administracao/banners_marketplace?pagina=${novaPagina}`); }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <i className="lni lni-image text-2xl text-blue-600"></i>
            <h1 className="text-2xl font-bold text-gray-900">Banners Marketplace</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/administracao/inicio" className="hover:text-blue-600"><i className="lni lni-home"></i></Link>
            <span>/</span>
            <span className="text-gray-700">Banners</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <form onSubmit={aplicarFiltro} className="flex flex-col sm:flex-row gap-4">
            <input type="text" placeholder="Título..." value={filtroTitulo} onChange={(e) => setFiltroTitulo(e.target.value)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Todos</option><option value="1">Ativo</option><option value="0">Inativo</option>
            </select>
            <button type="submit" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"><i className="lni lni-search"></i></button>
            <Link href="/administracao/banners_marketplace/adicionar" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"><i className="lni lni-plus"></i> Adicionar</Link>
          </form>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500"><i className="lni lni-spinner lni-spin text-2xl mr-2"></i> Carregando...</div>
          ) : dados.banners.length === 0 ? (
            <div className="p-8 text-center text-gray-500"><i className="lni lni-inbox text-4xl mb-4 block"></i>Nenhum banner encontrado</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imagem</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Link</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {dados.banners.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{b.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {b.desktop && <img src={b.desktop} alt={b.titulo} className="h-12 w-24 object-cover rounded" />}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.titulo}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {b.link ? <a href={b.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-xs block">{b.link}</a> : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${b.status === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {b.status === 1 ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/administracao/banners_marketplace/editar/${b.id}`} className="text-blue-600 hover:text-blue-900 p-2"><i className="lni lni-pencil"></i></Link>
                            <Link href={`/administracao/banners_marketplace/deletar/${b.id}`} className="text-red-600 hover:text-red-900 p-2"><i className="lni lni-trash"></i></Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {dados.paginas > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-500">Mostrando {((pagina - 1) * 20) + 1} - {Math.min(pagina * 20, dados.total)} de {dados.total}</div>
                  <div className="flex gap-2">
                    <button onClick={() => mudarPagina(pagina - 1)} disabled={pagina <= 1} className="px-3 py-1 border rounded-md disabled:opacity-50"><i className="lni lni-chevron-left"></i></button>
                    {Array.from({ length: Math.min(5, dados.paginas) }, (_, i) => {
                      const pageNum = dados.paginas <= 5 ? i + 1 : pagina <= 3 ? i + 1 : pagina >= dados.paginas - 2 ? dados.paginas - 4 + i : pagina - 2 + i;
                      return <button key={pageNum} onClick={() => mudarPagina(pageNum)} className={`px-3 py-1 border rounded-md ${pagina === pageNum ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}>{pageNum}</button>;
                    })}
                    <button onClick={() => mudarPagina(pagina + 1)} disabled={pagina >= dados.paginas} className="px-3 py-1 border rounded-md disabled:opacity-50"><i className="lni lni-chevron-right"></i></button>
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
