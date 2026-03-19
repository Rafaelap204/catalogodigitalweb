import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { buscarPedido, buscarItensPedido, atualizarStatusPedido } from '@/lib/server/actions/pedidos';
import { getPedidoStatusLabel } from '@/lib/helpers';

interface Props {
  searchParams: Promise<{ 
    id?: string;
    [key: string]: string | undefined;
  }>;
}

export default async function VisualizarPedidoPage({ searchParams }: Props) {
  const session = await getSession();
  
  if (!session || session.nivel !== 1) {
    redirect('/login');
  }

  const params = await searchParams;
  const id = params.id;

  if (!id) {
    redirect('/administracao/pedidos');
  }

  const pedido = await buscarPedido(id);

  if (!pedido) {
    redirect('/administracao/pedidos?error=nao_encontrado');
  }

  const itens = await buscarItensPedido(id);
  const statusInfo = getPedidoStatusLabel(pedido.status);

  async function handleStatusUpdate(formData: FormData) {
    'use server';
    
    const novoStatus = formData.get('status') as string;
    const result = await atualizarStatusPedido(id!, novoStatus);
    
    if (result.success) {
      redirect(`/administracao/pedidos/visualizar?id=${id}&success=status_atualizado`);
    } else {
      redirect(`/administracao/pedidos/visualizar?id=${id}&error=${encodeURIComponent(result.error || 'Erro ao atualizar')}`);
    }
  }

  const statusOptions = [
    { value: 'pendente', label: 'Pendente' },
    { value: 'pago', label: 'Pago' },
    { value: 'processando', label: 'Processando' },
    { value: 'enviado', label: 'Enviado' },
    { value: 'entregue', label: 'Entregue' },
    { value: 'cancelado', label: 'Cancelado' },
  ];

  return (
    <div className="row">
      <div className="col-md-12">
        {/* Header */}
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-md-8">
            <h2>
              <i className="lni lni-delivery"></i> Pedido #{pedido.id}
              <small style={{ display: 'block', fontSize: '14px', color: '#666', marginTop: '5px' }}>
                Visualize os detalhes do pedido
              </small>
            </h2>
          </div>
          <div className="col-md-4 text-right">
            <Link 
              href="/administracao/pedidos" 
              className="btn btn-default"
              style={{ marginTop: '10px' }}
            >
              <i className="lni lni-arrow-left"></i> Voltar
            </Link>
          </div>
        </div>

        <div className="row">
          {/* Coluna Esquerda - Informações */}
          <div className="col-md-8">
            {/* Status e Ações */}
            <div className="box box-white" style={{ marginBottom: '20px' }}>
              <div className="row">
                <div className="col-md-6">
                  <h4 style={{ marginBottom: '15px' }}>
                    <i className="lni lni-flag"></i> Status do Pedido
                  </h4>
                  <p>
                    Status atual: <span className={`badge ${statusInfo.className}`} style={{ fontSize: '14px' }}>{statusInfo.label}</span>
                  </p>
                </div>
                <div className="col-md-6">
                  <form action={handleStatusUpdate}>
                    <div className="form-field">
                      <label>Alterar Status</label>
                      <div className="input-group">
                        <select name="status" className="form-control" defaultValue={pedido.status}>
                          {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <span className="input-group-btn">
                          <button type="submit" className="btn btn-primary">
                            <i className="lni lni-reload"></i> Atualizar
                          </button>
                        </span>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Itens do Pedido */}
            <div className="box box-white" style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '20px' }}>
                <i className="lni lni-cart"></i> Itens do Pedido
              </h4>
              
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th className="text-center">Qtd</th>
                      <th className="text-right">Valor Unit.</th>
                      <th className="text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itens.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center">Nenhum item encontrado</td>
                      </tr>
                    ) : (
                      itens.map((item) => (
                        <tr key={item.id}>
                          <td>{item.produto_nome || `Produto #${item.produto_id}`}</td>
                          <td className="text-center">{item.quantidade}</td>
                          <td className="text-right">R$ {item.valor_unitario.toFixed(2)}</td>
                          <td className="text-right"><strong>R$ {item.valor_total.toFixed(2)}</strong></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="text-right"><strong>Subtotal:</strong></td>
                      <td className="text-right">R$ {pedido.valor_total.toFixed(2)}</td>
                    </tr>
                    {pedido.valor_frete && pedido.valor_frete > 0 && (
                      <tr>
                        <td colSpan={3} className="text-right"><strong>Frete:</strong></td>
                        <td className="text-right">R$ {pedido.valor_frete.toFixed(2)}</td>
                      </tr>
                    )}
                    <tr style={{ fontSize: '16px' }}>
                      <td colSpan={3} className="text-right"><strong>Total:</strong></td>
                      <td className="text-right text-success">
                        <strong>R$ {((pedido.valor_total || 0) + (pedido.valor_frete || 0)).toFixed(2)}</strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Observações */}
            {pedido.observacoes && (
              <div className="box box-white">
                <h4 style={{ marginBottom: '15px' }}>
                  <i className="lni lni-notepad"></i> Observações
                </h4>
                <p>{pedido.observacoes}</p>
              </div>
            )}
          </div>

          {/* Coluna Direita - Cliente e Endereço */}
          <div className="col-md-4">
            {/* Informações do Cliente */}
            <div className="box box-white" style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '15px' }}>
                <i className="lni lni-user"></i> Cliente
              </h4>
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td width="30"><i className="lni lni-user"></i></td>
                    <td><strong>{pedido.cliente_nome || 'N/A'}</strong></td>
                  </tr>
                  {pedido.cliente_telefone && (
                    <tr>
                      <td><i className="lni lni-phone"></i></td>
                      <td>{pedido.cliente_telefone}</td>
                    </tr>
                  )}
                  {pedido.cliente_email && (
                    <tr>
                      <td><i className="lni lni-envelope"></i></td>
                      <td>{pedido.cliente_email}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Endereço de Entrega */}
            <div className="box box-white" style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '15px' }}>
                <i className="lni lni-map-marker"></i> Endereço de Entrega
              </h4>
              <table className="table table-borderless">
                <tbody>
                  {pedido.endereco && (
                    <tr>
                      <td width="30"><i className="lni lni-home"></i></td>
                      <td>
                        {pedido.endereco}{pedido.numero ? `, ${pedido.numero}` : ''}
                        {pedido.complemento && <><br /><small>{pedido.complemento}</small></>}
                      </td>
                    </tr>
                  )}
                  {pedido.bairro && (
                    <tr>
                      <td><i className="lni lni-map"></i></td>
                      <td>{pedido.bairro}</td>
                    </tr>
                  )}
                  {(pedido.cidade || pedido.estado) && (
                    <tr>
                      <td><i className="lni lni-city"></i></td>
                      <td>
                        {pedido.cidade}{pedido.estado ? `/${pedido.estado}` : ''}
                        {pedido.cep && <><br /><small>CEP: {pedido.cep}</small></>}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Forma de Pagamento */}
            <div className="box box-white">
              <h4 style={{ marginBottom: '15px' }}>
                <i className="lni lni-credit-cards"></i> Pagamento
              </h4>
              <p>
                <i className="lni lni-coin"></i>{' '}
                {pedido.forma_pagamento || 'Não informado'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
