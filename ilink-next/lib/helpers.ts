/**
 * Funções helper utilitárias (não são server actions)
 */

// Assinaturas
export function getAssinaturaStatusLabel(status: string): { label: string; className: string } {
  const statusMap: Record<string, { label: string; className: string }> = {
    'ativa': { label: 'Ativa', className: 'badge-success' },
    'pendente': { label: 'Pendente', className: 'badge-warning' },
    'cancelada': { label: 'Cancelada', className: 'badge-danger' },
    'expirada': { label: 'Expirada', className: 'badge-default' },
    'suspensa': { label: 'Suspensa', className: 'badge-info' },
  };
  return statusMap[status] || { label: status, className: 'badge-default' };
}

// Avaliações
export function renderStars(nota: number): string {
  return '★'.repeat(Math.floor(nota)) + '☆'.repeat(5 - Math.floor(nota));
}

// Cupons
export function getCupomTipoLabel(tipo: string): string {
  const labels: Record<string, string> = {
    'percentual': 'Percentual (%)',
    'fixo': 'Valor Fixo (R$)',
    'frete_gratis': 'Frete Grátis',
  };
  return labels[tipo] || tipo;
}

// Pedidos
export function getPedidoStatusLabel(status: string): { label: string; className: string } {
  const statusMap: Record<string, { label: string; className: string }> = {
    'pendente': { label: 'Pendente', className: 'badge-warning' },
    'pago': { label: 'Pago', className: 'badge-success' },
    'processando': { label: 'Processando', className: 'badge-info' },
    'enviado': { label: 'Enviado', className: 'badge-primary' },
    'entregue': { label: 'Entregue', className: 'badge-success' },
    'cancelado': { label: 'Cancelado', className: 'badge-danger' },
  };
  return statusMap[status] || { label: status, className: 'badge-default' };
}

// Planos
export function getPeriodicidadeLabel(periodicidade: string | undefined): string {
  if (!periodicidade) return '-';
  const labels: Record<string, string> = {
    'mensal': 'Mensal',
    'trimestral': 'Trimestral',
    'semestral': 'Semestral',
    'anual': 'Anual',
  };
  return labels[periodicidade] || periodicidade;
}

// Usuários
export function getNivelLabel(nivel: number): string {
  const niveis: Record<number, string> = {
    1: 'Administrador',
    2: 'Estabelecimento',
    3: 'Afiliado',
    4: 'Cliente',
  };
  return niveis[nivel] || `Nível ${nivel}`;
}

export function getNivelBadgeClass(nivel: number): string {
  const classes: Record<number, string> = {
    1: 'badge-danger',
    2: 'badge-primary',
    3: 'badge-info',
    4: 'badge-default',
  };
  return classes[nivel] || 'badge-default';
}

// Opções de posições para banners
export const posicoesOptions = [
  { value: 'home_topo', label: 'Home - Topo' },
  { value: 'home_meio', label: 'Home - Meio' },
  { value: 'home_rodape', label: 'Home - Rodapé' },
  { value: 'categoria_topo', label: 'Categoria - Topo' },
  { value: 'produto_topo', label: 'Produto - Topo' },
];
