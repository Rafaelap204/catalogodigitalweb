import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  
  if (!session || session.nivel !== 2) {
    redirect('/login');
  }

  const params = await searchParams;
  const pagina = params.pag ? parseInt(String(params.pag)) : 1;
  const offset = (pagina - 1) * 20;
  
  const supabase = await createClient();
  const estabelecimentoId = session.estabelecimento_id || '0';
  
  // Busca produtos do estabelecimento
  const { data: produtos, error } = await (supabase
    .from('produtos') as any)
    .select('id, nome, preco, foto, categoria, avaliacao, status')
    .eq('estabelecimento_id', estabelecimentoId)
    .order('created', { ascending: false })
    .range(offset, offset + 19);

  if (error) {
    console.error('Erro ao listar produtos:', error);
  }

  // Conta total
  const { count: totalProdutos } = await (supabase
    .from('produtos') as any)
    .select('*', { count: 'exact', head: true })
    .eq('estabelecimento_id', estabelecimentoId);

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="box box-white">
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <div className="row">
              <div className="col-sm-8">
                <h2><i className="lni lni-cart"></i> Meus Produtos</h2>
              </div>
              <div className="col-sm-4 text-right">
                <Link href="/painel/produtos/adicionar" className="btn btn-primary">
                  <i className="lni lni-plus"></i> Adicionar Produto
                </Link>
              </div>
            </div>
          </div>
          
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Categoria</th>
                  <th>Avaliação</th>
                  <th>Status</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {!produtos || produtos.length === 0 ? (
                  <tr><td colSpan={7} className="text-center">Nenhum produto encontrado. <Link href="/painel/produtos/adicionar">Adicione seu primeiro produto!</Link></td></tr>
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
                      <td>{produto.categoria}</td>
                      <td>
                        {[1, 2, 3, 4, 5].map(star => (
                          <i key={star} className={`lni ${star <= (produto.avaliacao || 0) ? 'lni-star-fill' : 'lni-star'}`} style={{ color: star <= (produto.avaliacao || 0) ? '#ffc107' : '#ddd' }}></i>
                        ))}
                      </td>
                      <td>
                        <span className={`badge ${produto.status === 'ativo' ? 'badge-success' : 'badge-danger'}`}>
                          {produto.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="text-center">
                        <Link href={`/painel/produtos/editar?id=${produto.id}`} className="btn btn-default btn-sm" style={{ marginRight: '5px' }}>
                          <i className="lni lni-pencil"></i> Editar
                        </Link>
                        <Link href={`/painel/produtos/deletar?id=${produto.id}`} className="btn btn-danger btn-sm">
                          <i className="lni lni-trash"></i> Deletar
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="row">
            <div className="col-sm-5">
              <p className="text-muted">Mostrando {(produtos as any[])?.length || 0} de {totalProdutos || 0} registros</p>
            </div>
            <div className="col-sm-7 text-right">
              <Link href={`?pag=${Math.max(1, pagina - 1)}`} className={`btn btn-default ${pagina <= 1 ? 'disabled' : ''}`} style={{ marginRight: '5px' }}>
                <i className="lni lni-chevron-left"></i> Anterior
              </Link>
              <span style={{ marginRight: '5px' }}>Página {pagina}</span>
              <Link href={`?pag=${pagina + 1}`} className={`btn btn-default ${(produtos as any[])?.length < 20 ? 'disabled' : ''}`}>
                Próxima <i className="lni lni-chevron-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
