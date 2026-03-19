'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { buscarBanner, atualizarBanner } from '@/lib/server/actions/banners-marketplace';

export default function EditarBannerPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [banner, setBanner] = useState<any>(null);
  
  useEffect(() => { carregarBanner(); }, [id]);
  async function carregarBanner() {
    const data = await buscarBanner(id);
    if (data) setBanner(data); else setErro('Banner não encontrado');
    setLoading(false);
  }
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSalvando(true);
    setErro('');
    const formData = new FormData(e.currentTarget);
    const resultado = await atualizarBanner(id, formData);
    if (resultado.error) { setErro(resultado.error); setSalvando(false); }
    else { setSucesso(true); setTimeout(() => router.push('/administracao/banners_marketplace'), 1500); }
  }
  
  if (loading) return <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center"><div className="text-gray-500"><i className="lni lni-spinner lni-spin text-2xl mr-2"></i> Carregando...</div></div>;
  if (erro && !banner) return <div className="min-h-screen bg-gray-50 py-8"><div className="max-w-md mx-auto px-4"><div className="bg-white rounded-lg shadow-sm p-8 text-center"><h2 className="text-xl font-semibold text-red-900 mb-2">{erro}</h2><Link href="/administracao/banners_marketplace" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg">Voltar</Link></div></div></div>;
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <i className="lni lni-image text-2xl text-blue-600"></i>
            <h1 className="text-2xl font-bold text-gray-900">Editar Banner</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/administracao/inicio" className="hover:text-blue-600"><i className="lni lni-home"></i></Link>
            <span>/</span>
            <Link href="/administracao/banners_marketplace" className="hover:text-blue-600">Banners</Link>
            <span>/</span>
            <span className="text-gray-700">Editar</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm">
          {sucesso ? (
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"><i className="lni lni-checkmark text-3xl text-green-600"></i></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Banner atualizado!</h2>
              <p className="text-gray-500">Redirecionando...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6">
              {erro && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"><div className="flex items-center gap-2 text-red-700"><i className="lni lni-warning"></i><span>{erro}</span></div></div>}
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">Título: *</label>
                  <input type="text" id="titulo" name="titulo" required defaultValue={banner?.titulo} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label htmlFor="desktop" className="block text-sm font-medium text-gray-700 mb-2">Imagem Desktop (URL): *</label>
                  <input type="url" id="desktop" name="desktop" required defaultValue={banner?.desktop} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">Imagem Mobile (URL):</label>
                  <input type="url" id="mobile" name="mobile" defaultValue={banner?.mobile || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label htmlFor="video_link" className="block text-sm font-medium text-gray-700 mb-2">Vídeo (URL):</label>
                  <input type="url" id="video_link" name="video_link" defaultValue={banner?.video_link || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">Link do Banner:</label>
                  <input type="url" id="link" name="link" defaultValue={banner?.link || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status: *</label>
                  <select id="status" name="status" required defaultValue={banner?.status} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="1">Ativo</option><option value="0">Inativo</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"><i className="lni lni-chevron-left"></i> Voltar</button>
                <button type="submit" disabled={salvando} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50">{salvando ? <><i className="lni lni-spinner lni-spin"></i> Salvando...</> : <><i className="lni lni-checkmark"></i> Salvar</>}</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
