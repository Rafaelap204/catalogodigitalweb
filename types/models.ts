// ============================================
// ENUMS
// ============================================

export enum UserLevel {
  ADMIN = 1,
  ESTABELECIMENTO = 2,
  AFILIADO = 3,
}

export enum PedidoStatus {
  PENDENTE = 1,
  ACEITO = 2,
  PREPARANDO = 3,
  PRONTO = 4,
  ENTREGUE = 5,
  CANCELADO = 6,
}

export enum FormaEntrega {
  DELIVERY = 'delivery',
  RETIRADA = 'retirada',
  MESA = 'mesa',
  OUTROS = 'outros',
}

export enum StatusAtivo {
  INATIVO = 0,
  ATIVO = 1,
}

export enum StatusFuncionamento {
  FECHADO = 0,
  ABERTO = 1,
}

export enum TipoEntrega {
  FIXO = 1,
  COMBINAR = 2,
}

// ============================================
// INTERFACES PRINCIPAIS
// ============================================

export interface User {
  id: number;
  email: string;
  password?: string;
  nivel: UserLevel;
  nome: string;
  keepalive?: string;
  last_login?: string;
  recover_key?: string;
  created_at: string;
}

export interface UserData {
  id: number;
  rel_users_id: number;
  telefone?: string;
  cidade?: number;
  estado?: number;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cep?: string;
}

export interface Estabelecimento {
  id: number;
  nome: string;
  subdominio: string;
  rel_users_id: number;
  cidade_id: number;
  estado_id: number;
  segmento_id: number;
  perfil?: string;
  capa?: string;
  descricao?: string;
  cor: string;
  whatsapp?: string;
  email?: string;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cep?: string;
  telefone?: string;
  status: StatusAtivo;
  excluded: boolean;
  afiliado?: number;
  funcionamento: StatusFuncionamento;
  acompanhamento_finalizacao?: string;
  minimo_entrega_gratis?: number;
  taxa_delivery?: number;
  created_at: string;
  updated_at: string;
  
  // Campos adicionais para funcionamento
  horario_funcionamento?: string;
  pedido_minimo?: number;
  entrega_entrega?: number;
  entrega_entrega_tipo?: TipoEntrega;
  entrega_entrega_valor?: number;
  endereco_rua?: string;
  endereco_numero?: string;
  endereco_bairro?: string;
  endereco_cep?: string;
  endereco_referencia?: string;
  contato_whatsapp?: string;
  contato_email?: string;
  contato_facebook?: string;
  contato_instagram?: string;
  contato_youtube?: string;
  estatisticas_analytics?: string;
  estatisticas_pixel?: string;
  html?: string;
  funcionalidade_banners?: boolean;
  funcionalidade_variacao?: boolean;
  funcionalidade_marketplace?: boolean;
  delivery?: number;
  balcao?: number;
  mesa?: number;
  outros?: number;
  nomeoutros?: string;
  chave_pix?: string;
  beneficiario_pix?: string;
  exibicao?: string;
}

export interface Categoria {
  id: number;
  rel_estabelecimentos_id: number;
  nome: string;
  ordem: number;
  visible: boolean;
  status: StatusAtivo;
}

export interface Produto {
  id: number;
  rel_estabelecimentos_id: number;
  rel_categorias_id: number;
  nome: string;
  descricao?: string;
  valor: number;
  valor_promocional?: number;
  estoque: number;
  posicao: number;
  imagem?: string;
  destaque: boolean;
  visible: boolean;
  status: StatusAtivo;
  last_modified: string;
}

export interface ProdutoVariacao {
  id: number;
  rel_produtos_id: number;
  nome: string;
  valor_adicional: number;
  estoque: number;
}

export interface Pedido {
  id: number;
  rel_estabelecimentos_id: number;
  cliente_nome: string;
  whatsapp: string;
  v_pedido: number;
  forma_entrega: FormaEntrega;
  valor_frete: number;
  endereco?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  complemento?: string;
  observacoes?: string;
  cupom?: string;
  status: PedidoStatus;
  comprovante?: string;
  data: string;
  tipo?: string;
  mesa?: string;
}

export interface PedidoItem {
  id: number;
  rel_pedidos_id: number;
  rel_produtos_id: number;
  produto_nome: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
}

export interface Plano {
  id: number;
  nome: string;
  descricao?: string;
  duracao_meses: number;
  duracao_dias: number;
  valor_total: number;
  valor_mensal: number;
  limite_produtos: number;
  funcionalidade_disparador: boolean;
  funcionalidade_marketplace: boolean;
  funcionalidade_variacao: boolean;
  funcionalidade_banners: boolean;
  visible: boolean;
  status: StatusAtivo;
  ordem: number;
}

export interface Assinatura {
  id: number;
  rel_planos_id: number;
  rel_estabelecimentos_id: number;
  afiliado?: number;
  nome: string;
  descricao?: string;
  comissionamento?: string;
  duracao_meses: number;
  duracao_dias: number;
  valor_total: number;
  valor_mensal: number;
  expiration: string;
  gateway_ref?: string;
  gateway_payment?: string;
  gateway_transaction?: string;
  voucher?: string;
  mode?: string;
  termos?: string;
  limite_produtos: number;
  funcionalidade_disparador: boolean;
  funcionalidade_marketplace: boolean;
  funcionalidade_variacao: boolean;
  funcionalidade_banners: boolean;
  status: number;
  used: number;
  created_at: string;
}

export interface Banner {
  id: number;
  rel_estabelecimentos_id: number;
  imagem: string;
  link?: string;
  ordem: number;
  visible: boolean;
}

export interface Cidade {
  id: number;
  nome: string;
  estado_id: number;
  subdominio?: string;
}

export interface Estado {
  id: number;
  nome: string;
  uf: string;
}

export interface Segmento {
  id: number;
  nome: string;
  icone?: string;
  status: StatusAtivo;
}

export interface Cupom {
  id: number;
  rel_estabelecimentos_id: number;
  codigo: string;
  tipo: 'percentual' | 'valor_fixo';
  valor: number;
  quantidade_uso: number;
  quantidade_usado: number;
  validade?: string;
  status: StatusAtivo;
}

export interface Voucher {
  id: number;
  codigo: string;
  rel_planos_id?: number;
  desconto_percentual?: number;
  desconto_valor?: number;
  quantidade_uso: number;
  quantidade_usado: number;
  validade?: string;
  status: StatusAtivo;
}

export interface Agendamento {
  id: number;
  rel_estabelecimentos_id: number;
  sun: boolean;
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
  hora: string;
  acao: 1 | 2; // 1 = abertura, 2 = fechamento
}

export interface Log {
  id: number;
  rel_users_id?: number;
  rel_lojas_id?: number;
  info: string;
  date_time: string;
}

// ============================================
// TIPOS AUXILIARES
// ============================================

export interface CartItem {
  produto_id: number;
  nome: string;
  valor: number;
  quantidade: number;
  imagem?: string;
  variacao_id?: number;
  variacao_nome?: string;
}

export interface SessionUser {
  id: number;
  email: string;
  nome: string;
  nivel: UserLevel;
}

export interface DashboardStats {
  totalPedidos: number;
  totalVendas: number;
  pedidosHoje: number;
  vendasHoje: number;
}
