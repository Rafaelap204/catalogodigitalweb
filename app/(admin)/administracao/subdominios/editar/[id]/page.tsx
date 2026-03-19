'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { buscarSubdominio, atualizarSubdominio } from '@/lib/server/actions/subdominios';
import { listarTodosEstados } from '@/lib/server/actions/estados';
import { listarTodasCidades } from '@/lib/server/actions/cidades';

const TIPOS = [
  { value: 1, label: 'Estabelecimento' },
  { value: 2, label: 'Cidade' },
  { value: 3, label: 'URL' },
  { value: 4, label: 'Outro' },
];

export default function EditarSubdominioPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string);
  
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [tipo, setTipo] = useState<number>(1);
  const [subdominioData, setSubdominioData] = useState<any>(null);
  const [estados, setEstados] = useState<any[]>([]);
  const [cidades, setCidades] = useState<any[]>([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState('');
  
  useEffect(() => {
    carregarDados();
  }, [id]);
  
  useEffect(() => {
    if (tipo === 2 && estadoSelecionado) {
      carregarCidades(parseInt(estadoSelecionado));
    }
  }, [estadoSelecionado, tipo]);
  
  async function carregarDados() {
    const [subData, estadosData] = await Promise.all([
      buscarSubdominio(id),
      listarTodosEstados(),
    ]);
    
    if (subData) {
      setSubdominioData(subData);
      setTipo(subData.tipo);
      setEstados(estadosData);
    } else {
      setErro('Subdomínio não encontrado');
    }
    setLoading(false);
  }
  
  async function carregarCidades(estadoId: number) {
    const lista = await listarTodasCidades(estadoId);
    setCidades(lista);
  }
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSalvando(true);
    setErro('');
    
    const formData = new FormData(e.currentTarget);
    const resultado = await atualizarSubdominio(id, formData);
    
    if (resultado.error) {
      setErro(resultado.error);
      setSalvando(false);
    } else {
      setSucesso(true);
      setTimeout(() => router.push('/administracao/subdominios'), 1500);
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-gray-500"><i className="lni lni-spinner lni-spin text-2xl mr-2"></i> Carregando...</div>
      </div>
    );
  }
  
  if (erro && !subdominioData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <i className="lni lni-warning text-3xl text-red-600"></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{erro}</h2>
            <Link href="/administracao/subdominios" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Voltar para Subdomínios
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <i className="lni lni-world text-2xl text-blue-600"></i>
            <h1 className="text-2xl font-bold text-gray-900">Editar Subdomínio</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/administracao/inicio" className="hover:text-blue-600"><i className="lni lni-home"></i></Link>
            <span>/</span>
            <Link href="/administracao/subdominios" className="hover:text-blue-600">Subdomínios</Link>
            <span>/</span>
            <span className="text-gray-700">Editar</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm">
          {sucesso ? (
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <i className="lni lni-checkmark text-3xl text-green-600"></i>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Subdomínio atualizado com sucesso!</h2>
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
                  <label htmlFor="subdominio" className="block text-sm font-medium text-gray-700 mb-2">Subdomínio: *</label>
                  <input type="text" id="subdominio" name="subdominio" required defaultValue={subdominioData?.subdominio} placeholder="ex: minhaloja" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 lowercase" />
                </div>
                
                <div>
                  <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">Tipo: *</label>
                  <select id="tipo" name="tipo" required value={tipo} onChange={(e) => setTipo(parseInt(e.target.value))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    {TIPOS.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
                  </select>
                </div>
                
                {tipo === 1 && (
                  <div>
                    <label htmlFor="rel_id" className="block text-sm font-medium text-gray-700 mb-2">ID do Estabelecimento: *</label>
                    <input type="number" id="rel_id" name="rel_id" required defaultValue={subdominioData?.rel_id || ''} placeholder="ID do estabelecimento" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                )}
                
                {tipo === 2 && (
                  <>
                    <div>
                      <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Estado:</label>
                      <select id="estado" value={estadoSelecionado} onChange={(e) => setEstadoSelecionado(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Selecione o estado</option>
                        {estados.map((e: any) => (<option key={e.id} value={e.id}>{e.nome} ({e.uf})</option>))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="rel_id" className="block text-sm font-medium text-gray-700 mb-2">Cidade: *</label>
                      <select id="rel_id" name="rel_id" required disabled={!estadoSelecionado} defaultValue={subdominioData?.rel_id || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100">
                        <option value="">Selecione a cidade</option>
                        {cidades.map((c: any) => (<option key={c.id} value={c.id}>{c.nome}</option>))}
                      </select>
                    </div>
                  </>
                )}
                
                {(tipo === 3 || tipo === 4) && (
                  <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">URL: *</label>
                    <input type="url" id="url" name="url" required defaultValue={subdominioData?.url || ''} placeholder="https://..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                )}
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                  <i className="lni lni-chevron-left"></i> Voltar
                </button>
                <button type="submit" disabled={salvando} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50">
                  {salvando ? <><i className="lni lni-spinner lni-spin"></i> Salvando...</> : <><i className="lni lni-checkmark"></i> Salvar</>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
