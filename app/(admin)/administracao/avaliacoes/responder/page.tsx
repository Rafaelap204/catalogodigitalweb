import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { buscarAvaliacao, responderAvaliacao } from '@/lib/server/actions/avaliacoes';
import { renderStars } from '@/lib/helpers';

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function ResponderAvaliacaoPage({ searchParams }: Props) {
  const session = await getSession();
  if (!session || session.nivel !== 1) redirect('/login');

  const { id } = await searchParams;
  if (!id) redirect('/administracao/avaliacoes');

  const avaliacao = await buscarAvaliacao(id);
  if (!avaliacao) redirect('/administracao/avaliacoes?error=nao_encontrada');

  async function handleSubmit(formData: FormData) {
    'use server';
    const resposta = formData.get('resposta') as string;
    const result = await responderAvaliacao(id!, resposta);
    if (result.success) redirect('/administracao/avaliacoes?success=respondida');
    else redirect(`/administracao/avaliacoes/responder?id=${id}&error=${encodeURIComponent(result.error || 'Erro')}`);
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-md-8"><h2><i className="lni lni-reply"></i> Responder Avaliação</h2></div>
          <div className="col-md-4 text-right">
            <Link href="/administracao/avaliacoes" className="btn btn-default" style={{ marginTop: '10px' }}><i className="lni lni-arrow-left"></i> Voltar</Link>
          </div>
        </div>

        <div className="box box-white" style={{ marginBottom: '20px' }}>
          <div className="media">
            <div className="media-left">
              <div style={{ width: '60px', height: '60px', background: '#007bff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px' }}>
                <i className="lni lni-user"></i>
              </div>
            </div>
            <div className="media-body">
              <h4 className="media-heading">{avaliacao.cliente_nome || 'Anônimo'}</h4>
              <p><span style={{ color: '#ffc107', fontSize: '18px' }}>{renderStars(avaliacao.nota)}</span></p>
              <p style={{ fontSize: '16px' }}>{avaliacao.comentario}</p>
              <p className="text-muted"><small>{avaliacao.created ? new Date(avaliacao.created).toLocaleDateString('pt-BR') : '-'}</small></p>
            </div>
          </div>
        </div>

        <div className="box box-white">
          <form action={handleSubmit}>
            <div className="form-field">
              <label>Sua Resposta</label>
              <textarea name="resposta" className="form-control" rows={5} defaultValue={avaliacao.resposta || ''} placeholder="Digite sua resposta à avaliação do cliente..." required />
            </div>

            <div className="row" style={{ marginTop: '30px' }}>
              <div className="col-md-12">
                <hr />
                <button type="submit" className="btn btn-success"><i className="lni lni-checkmark"></i> Enviar Resposta</button>
                <Link href="/administracao/avaliacoes" className="btn btn-default" style={{ marginLeft: '10px' }}>Cancelar</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
