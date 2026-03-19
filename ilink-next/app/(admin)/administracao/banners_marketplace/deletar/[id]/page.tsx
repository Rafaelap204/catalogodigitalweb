'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { buscarBanner, deletarBanner } from '@/lib/server/actions/banners-marketplace';

export default function DeletarBannerPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);
  const [loading, setLoading] = useState(true);
  const [deletando, setDeletando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [banner, setBanner] = useState<any>(null);
  
  useEffect(() => { carregarBanner(); }, [id]);
  async function carregarBanner() {
    const data = await buscarBanner(id);
    if (data) setBanner(data); else setErro('Banner não encontrado');
    setLoading(false);
  }
  
  async function handleDeletar() {
    setDeletando(true);
    const resultado = await deletarBanner(id);
    if (resultado.error) { setErro(resultado.error); setDeletando(false); }
    else { setSucesso(true); setTimeout(() => router.push('/administracao/banners_marketplace'), 1500); }
  }
  
  if (loading) return <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center"><div className="text-gray-500"><i className="lni lni-spinner lni-spin text-2xl mr-2"></i> Carregando...</div></div>;
  if (erro && !banner) return <div className="min-h-screen bg-gray-50 py-8"><div className="max-w-md mx-auto px-4"><div className="bg-white rounded-lg shadow-sm p-8 text-center"><h2 className="text-xl font-semibold text-red-900 mb-2">{erro}</h2><Link href="/administracao/banners_marketplace" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg">Voltar</Link></div></div></div>;
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {sucesso ? (
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"><i className="lni lni-checkmark text-3xl text-green-600"></i></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Banner deletado!</h2>
              <p className="text-gray-500">Redirecionando...</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"><i className="lni lni-trash text-3xl text-red-600"></i></div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirmar Exclusão</h1>
                <p className="text-gray-600">Tem certeza que deseja deletar este banner?</p>
              </div>
              
              {erro && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"><div className="flex items-center gap-2 text-red-700"><i className="lni lni-warning"></i><span>{erro}</span></div></div>}
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Título</h3>
                <p className="text-lg font-semibold text-gray-900">{banner?.titulo}</p>
                <div className="mt-4"><span className={`inline-flex px-3 py-1 text-sm rounded-full font-medium ${banner?.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{banner?.status ? 'Ativo' : 'Inativo'}</span></div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/administracao/banners_marketplace" className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-center flex items-center justify-center gap-2"><i className="lni lni-close"></i> Cancelar</Link>
                <button onClick={handleDeletar} disabled={deletando} className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-50">{deletando ? <><i className="lni lni-spinner lni-spin"></i> Deletando...</> : <><i className="lni lni-trash"></i> Confirmar Exclusão</>}</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
