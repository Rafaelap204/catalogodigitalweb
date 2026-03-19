'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { buscarVoucher, deletarVoucher } from '@/lib/server/actions/vouchers';

export default function DeletarVoucherPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);
  
  const [loading, setLoading] = useState(true);
  const [deletando, setDeletando] = useState(false);
  const [erro, setErro] = useState('');
  const [voucher, setVoucher] = useState<{ id: number; codigo: string; descricao: string } | null>(null);
  
  useEffect(() => {
    carregarVoucher();
  }, [id]);
  
  async function carregarVoucher() {
    const data = await buscarVoucher(id);
    if (data) {
      setVoucher({ id: data.id, codigo: data.codigo, descricao: data.descricao });
    } else {
      setErro('Voucher não encontrado');
    }
    setLoading(false);
  }
  
  async function handleDeletar() {
    setDeletando(true);
    setErro('');
    
    const resultado = await deletarVoucher(id);
    
    if (resultado.error) {
      setErro(resultado.error);
      setDeletando(false);
    } else {
      router.push('/administracao/vouchers');
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-gray-500"><i className="lni lni-spinner lni-spin text-2xl mr-2"></i> Carregando...</div>
      </div>
    );
  }
  
  if (erro && !voucher) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <i className="lni lni-warning text-3xl text-red-600"></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{erro}</h2>
            <Link href="/administracao/vouchers" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Voltar para Vouchers</Link>
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
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirmar Exclusão</h2>
            
            <p className="text-gray-500 mb-2">Tem certeza que deseja excluir o voucher:</p>
            <p className="text-lg font-mono font-bold text-blue-600 mb-1">{voucher?.codigo}</p>
            <p className="text-sm text-gray-500 mb-6">{voucher?.descricao}</p>
            <p className="text-red-500 text-sm mb-6">Esta ação não pode ser desfeita.</p>
            
            {erro && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-red-700"><i className="lni lni-warning"></i><span>{erro}</span></div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/administracao/vouchers" className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"><i className="lni lni-close"></i> Cancelar</Link>
              <button onClick={handleDeletar} disabled={deletando} className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-50">{deletando ? <><i className="lni lni-spinner lni-spin"></i> Excluindo...</> : <><i className="lni lni-trash"></i> Confirmar Exclusão</>}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
