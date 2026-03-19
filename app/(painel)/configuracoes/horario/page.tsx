import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { createClient } from '@/lib/supabase/server';

const diasSemana = [
  { id: 'domingo', nome: 'Domingo' },
  { id: 'segunda', nome: 'Segunda-feira' },
  { id: 'terca', nome: 'Terça-feira' },
  { id: 'quarta', nome: 'Quarta-feira' },
  { id: 'quinta', nome: 'Quinta-feira' },
  { id: 'sexta', nome: 'Sexta-feira' },
  { id: 'sabado', nome: 'Sábado' },
];

export default async function ConfiguracoesHorarioPage() {
  const session = await getSession();
  
  if (!session || session.nivel !== 2) {
    redirect('/login');
  }

  const supabase = await createClient();
  const estabelecimentoId = session.estabelecimento_id || '0';
  
  // Busca horários de funcionamento
  const { data: horarios } = await (supabase
    .from('horarios_funcionamento') as any)
    .select('dia_semana, hora_abertura, hora_fechamento, fechado')
    .eq('estabelecimento_id', estabelecimentoId);

  const horariosMap = horarios?.reduce((acc: any, h: any) => {
    acc[h.dia_semana] = h;
    return acc;
  }, {});

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="box box-white">
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
            <div className="row">
              <div className="col-sm-8">
                <h2><i className="lni lni-calendar"></i> Horário de Funcionamento</h2>
              </div>
              <div className="col-sm-4 text-right">
                <Link href="/painel" className="btn btn-default">
                  <i className="lni lni-arrow-left"></i> Voltar
                </Link>
              </div>
            </div>
          </div>
          
          <form action="/api/painel/configuracoes/horario" method="POST" className="form-horizontal">
            {diasSemana.map((dia) => {
              const horario = horariosMap?.[dia.id];
              return (
                <div key={dia.id} className="row" style={{ marginBottom: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '5px' }}>
                  <div className="col-md-3">
                    <h4>{dia.nome}</h4>
                  </div>
                  <div className="col-md-3">
                    <div className="checkbox">
                      <label>
                        <input 
                          type="checkbox" 
                          name={`${dia.id}_fechado`} 
                          defaultChecked={horario?.fechado}
                        /> Fechado
                      </label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <input 
                      type="time" 
                      name={`${dia.id}_abertura`} 
                      className="form-control" 
                      defaultValue={horario?.hora_abertura || '08:00'}
                    />
                  </div>
                  <div className="col-md-3">
                    <input 
                      type="time" 
                      name={`${dia.id}_fechamento`} 
                      className="form-control" 
                      defaultValue={horario?.hora_fechamento || '18:00'}
                    />
                  </div>
                </div>
              );
            })}

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <div className="col-sm-12 text-right">
                <button type="submit" className="btn btn-success">
                  <i className="lni lni-checkmark"></i> Salvar Horários
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
