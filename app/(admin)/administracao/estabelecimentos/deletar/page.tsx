import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';
import { deletarEstabelecimento } from '@/lib/server/actions/estabelecimentos';

export default async function DeletarEstabelecimentoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    redirect('/login');
  }

  const params = await searchParams;
  const id = params.id;
  
  if (!id) {
    redirect('/administracao/estabelecimentos');
  }

  const supabase = await createClient();
  
  const { data: estabelecimento } = await (supabase
    .from('estabelecimentos') as any)
    .select('id, nome')
    .eq('id', id)
    .single();

  if (!estabelecimento) {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="alert alert-danger">
            <i className="lni lni-close"></i> Estabelecimento não encontrado.
          </div>
          <Link href="/administracao/estabelecimentos" className="btn btn-default">
            <i className="lni lni-arrow-left"></i> Voltar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-md-6 col-md-offset-3">
        <div className="box box-white">
          <div className="text-center" style={{ padding: '20px' }}>
            <i className="lni lni-warning" style={{ fontSize: '64px', color: '#dc3545' }}></i>
            <h2>Confirmar Exclusão</h2>
            <p>Tem certeza que deseja excluir o estabelecimento <strong>{estabelecimento.nome}</strong>?</p>
            <p className="text-danger">Esta ação não pode ser desfeita!</p>
          </div>
          
          <form action="/api/admin/estabelecimentos/deletar" method="POST" className="text-center">
            <input type="hidden" name="id" value={id} />
            <Link href="/administracao/estabelecimentos" className="btn btn-default btn-lg" style={{ marginRight: '10px' }}>
              <i className="lni lni-close"></i> Cancelar
            </Link>
            <button type="submit" className="btn btn-danger btn-lg">
              <i className="lni lni-trash"></i> Sim, Excluir
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
