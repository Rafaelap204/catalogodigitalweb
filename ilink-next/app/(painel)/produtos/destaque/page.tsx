import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

export default async function ProdutosDestaquePage() {
  const session = await getSession();
  
  if (!session || session.nivel !== 2) {
    redirect('/login');
  }

  const supabase = await createClient();
  const estabelecimentoId = session.estabelecimento_id || '0';
  
  // Busca produtos em destaque
  const { data: produtos } = await (supabase
    .from('produtos') as any)
    .select('id, nome, preco, preco_promocional, foto, categoria, destaque')
    .eq('estabelecimento_id', estabelecimentoId)
    .eq('destaque', true)
    .order('created', { ascending: false });

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="box box-white">
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <div className="row">
              <div className="col-sm-8">
                <h2><i className="lni lni-star-fill"></i> Produtos em Destaque</h2>
              </div>
              <div className="col-sm-4 text-right">
                <Link href="/painel/produtos" className="btn btn-default">
                  <i className="lni lni-arrow-left"></i> Voltar
                </Link>
              </div>
            </div>
          </div>
          
          <div className="alert alert-info">
            <i className="lni lni-information"></i> Os produtos em destaque aparecem primeiro na sua página de vendas.
          </div>
          
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Preço Promocional</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {!produtos || produtos.length === 0 ? (
                  <tr><td colSpan={5} className="text-center">Nenhum produto em destaque. <Link href="/painel/produtos">Adicione produtos ao destaque!</Link></td></tr>
                ) : (
                  produtos.map((produto: any) => (
                    <tr key={produto.id}>
                      <td>
                        {produto.foto ? (
                          <img src={produto.foto} alt={produto.nome} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '50px', height: '50px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="lni lni-image"></i>
                          </div>
                        )}
                      </td>
                      <td>{produto.nome}</td>
                      <td>R$ {produto.preco?.toFixed(2)}</td>
                      <td>{produto.preco_promocional ? `R$ ${produto.preco_promocional.toFixed(2)}` : '-'}</td>
                      <td className="text-center">
                        <Link href={`/painel/produtos/editar?id=${produto.id}`} className="btn btn-default btn-sm" style={{ marginRight: '5px' }}>
                          <i className="lni lni-pencil"></i> Editar
                        </Link>
                        <Link href={`/painel/produtos/remover-destaque?id=${produto.id}`} className="btn btn-warning btn-sm">
                          <i className="lni lni-star"></i> Remover Destaque
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
