'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { buscarEstabelecimentoCaptar, atualizarEstabelecimentoCaptar } from '@/lib/server/actions/captar';

export default function EditarCaptarPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [item, setItem] = useState<any>(null);

  useEffect(() => { carregarDados(); }, [id]);
  async function carregarDados() {
    const data = await buscarEstabelecimentoCaptar(id);
    if (data) setItem(data); else setErro('Estabelecimento não encontrado');
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSalvando(true);
    setErro('');
    const formData = new FormData(e.currentTarget);
    const resultado = await atualizarEstabelecimentoCaptar(id, formData);
    if (resultado.error) { setErro(resultado.error); setSalvando(false); }
    else { setSucesso(true); setTimeout(() => router.push('/administracao/captar'), 1500); }
  }

  if (loading) return <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center"><div className="text-gray-500"><i className="lni lni-spinner lni-spin text-2xl mr-2"></i> Carregando...</div></div>;
  if (erro && !item) return <div className="min-h-screen bg-gray-50 py-8"><div className="max-w-md mx-auto px-4"><div className="bg-white rounded-lg shadow-sm p-8 text-center"><h2 className="text-xl font-semibold text-red-900 mb-2">{erro}</h2><Link href="/administracao/captar" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg">Voltar</Link></div></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <i className="lni lni-map-marker text-2xl text-blue-600"></i>
            <h1 className="text-2xl font-bold text-gray-900">Editar Estabelecimento</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/administracao/inicio" className="hover:text-blue-600"><i className="lni lni-home"></i></Link>
            <span>/</span>
            <Link href="/administracao/captar" className="hover:text-blue-600">Captar</Link>
            <span>/</span>
            <span className="text-gray-700">Editar</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {sucesso ? (
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"><i className="lni lni-checkmark text-3xl text-green-600"></i></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Estabelecimento atualizado!</h2>
              <p className="text-gray-500">Redirecionando...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6">
              {erro && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"><div className="flex items-center gap-2 text-red-700"><i className="lni lni-warning"></i><span>{erro}</span></div></div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">Nome do Estabelecimento: *</label>
                  <input type="text" id="nome" name="nome" required defaultValue={item?.nome} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-2">Endereço:</label>
                  <input type="text" id="endereco" name="endereco" defaultValue={item?.endereco || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                  <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-2">Cidade:</label>
                  <input type="text" id="cidade" name="cidade" defaultValue={item?.cidade || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                  <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">Estado:</label>
                  <input type="text" id="estado" name="estado" maxLength={2} defaultValue={item?.estado || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 uppercase" />
                </div>

                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">Telefone:</label>
                  <input type="tel" id="telefone" name="telefone" defaultValue={item?.telefone || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email:</label>
                  <input type="email" id="email" name="email" defaultValue={item?.email || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="border-t pt-6 md:col-span-2"><h3 className="text-lg font-medium text-gray-900 mb-4">Responsável</h3></div>

                <div>
                  <label htmlFor="responsavel" className="block text-sm font-medium text-gray-700 mb-2">Nome:</label>
                  <input type="text" id="responsavel" name="responsavel" defaultValue={item?.responsavel || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                  <label htmlFor="telefone_responsavel" className="block text-sm font-medium text-gray-700 mb-2">Telefone:</label>
                  <input type="tel" id="telefone_responsavel" name="telefone_responsavel" defaultValue={item?.telefone_responsavel || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="email_responsavel" className="block text-sm font-medium text-gray-700 mb-2">Email:</label>
                  <input type="email" id="email_responsavel" name="email_responsavel" defaultValue={item?.email_responsavel || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="border-t pt-6 md:col-span-2"><h3 className="text-lg font-medium text-gray-900 mb-4">Localização GPS</h3></div>

                <div>
                  <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">Latitude:</label>
                  <input type="number" step="any" id="latitude" name="latitude" defaultValue={item?.latitude || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                  <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">Longitude:</label>
                  <input type="number" step="any" id="longitude" name="longitude" defaultValue={item?.longitude || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="border-t pt-6 md:col-span-2"><h3 className="text-lg font-medium text-gray-900 mb-4">Status e Acompanhamento</h3></div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status: *</label>
                  <select id="status" name="status" required defaultValue={item?.status || 'novo'} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="novo">Novo</option>
                    <option value="contatado">Contatado</option>
                    <option value="visitado">Visitado</option>
                    <option value="proposta_enviada">Proposta Enviada</option>
                    <option value="negociacao">Em Negociação</option>
                    <option value="convertido">Convertido</option>
                    <option value="nao_interessado">Não Interessado</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="data_retorno" className="block text-sm font-medium text-gray-700 mb-2">Próximo Contato:</label>
                  <input type="date" id="data_retorno" name="data_retorno" defaultValue={item?.data_retorno ? item.data_retorno.substring(0, 10) : ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-2">Observações:</label>
                  <textarea id="observacoes" name="observacoes" rows={4} defaultValue={item?.observacoes || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"><i className="lni lni-chevron-left"></i> Voltar</button>
                <button type="submit" disabled={salvando} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50">{salvando ? <><i className="lni lni-spinner lni-spin"></i> Salvando...</> : <><i className="lni lni-checkmark"></i> Salvar Alterações</>}</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
