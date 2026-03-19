'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { criarBanner } from '@/lib/server/actions/banners-marketplace';

export default function AdicionarBannerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErro('');
    const formData = new FormData(e.currentTarget);
    const resultado = await criarBanner(formData);
    if (resultado.error) { setErro(resultado.error); setLoading(false); }
    else { setSucesso(true); setTimeout(() => router.push('/administracao/banners_marketplace'), 1500); }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <i className="lni lni-image text-2xl text-blue-600"></i>
            <h1 className="text-2xl font-bold text-gray-900">Adicionar Banner</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/administracao/inicio" className="hover:text-blue-600"><i className="lni lni-home"></i></Link>
            <span>/</span>
            <Link href="/administracao/banners_marketplace" className="hover:text-blue-600">Banners</Link>
            <span>/</span>
            <span className="text-gray-700">Adicionar</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm">
          {sucesso ? (
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"><i className="lni lni-checkmark text-3xl text-green-600"></i></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Banner criado com sucesso!</h2>
              <p className="text-gray-500">Redirecionando...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6">
              {erro && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"><div className="flex items-center gap-2 text-red-700"><i className="lni lni-warning"></i><span>{erro}</span></div></div>}
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">Título: *</label>
                  <input type="text" id="titulo" name="titulo" required placeholder="Título do banner" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div>
                  <label htmlFor="desktop" className="block text-sm font-medium text-gray-700 mb-2">Imagem Desktop (URL): *</label>
                  <input type="url" id="desktop" name="desktop" required placeholder="https://..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">Imagem Mobile (URL):</label>
                  <input type="url" id="mobile" name="mobile" placeholder="https://..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div>
                  <label htmlFor="video_link" className="block text-sm font-medium text-gray-700 mb-2">Vídeo (URL):</label>
                  <input type="url" id="video_link" name="video_link" placeholder="https://..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div>
                  <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">Link do Banner:</label>
                  <input type="url" id="link" name="link" placeholder="https://..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status: *</label>
                  <select id="status" name="status" required defaultValue="1" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="1">Ativo</option><option value="0">Inativo</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"><i className="lni lni-chevron-left"></i> Voltar</button>
                <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50">{loading ? <><i className="lni lni-spinner lni-spin"></i> Criando...</> : <><i className="lni lni-plus"></i> Criar Banner</>}</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
