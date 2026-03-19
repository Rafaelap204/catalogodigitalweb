import { z } from 'zod';

// ============================================
// SCHEMAS DE AUTENTICAÇÃO
// ============================================

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  keepalive: z.boolean().optional(),
});

export const registerSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
  telefone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

// ============================================
// SCHEMAS DE ESTABELECIMENTO
// ============================================

export const estabelecimentoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  subdominio: z.string()
    .min(3, 'Subdomínio deve ter no mínimo 3 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Subdomínio deve conter apenas letras minúsculas, números e hífens'),
  descricao: z.string().optional(),
  segmento_id: z.number().min(1, 'Selecione um segmento'),
  cidade_id: z.number().min(1, 'Selecione uma cidade'),
  estado_id: z.number().min(1, 'Selecione um estado'),
  endereco: z.string().optional(),
  numero: z.string().optional(),
  bairro: z.string().optional(),
  cep: z.string().optional(),
  telefone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  cor: z.string().default('#000000'),
});

// ============================================
// SCHEMAS DE PRODUTO
// ============================================

export const produtoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  descricao: z.string().optional(),
  rel_categorias_id: z.number().min(1, 'Selecione uma categoria'),
  valor: z.number().min(0, 'Valor deve ser maior ou igual a zero'),
  valor_promocional: z.number().min(0).optional(),
  estoque: z.number().int().min(0).default(0),
  posicao: z.number().int().default(0),
  imagem: z.string().optional(),
  destaque: z.boolean().default(false),
  visible: z.boolean().default(true),
});

// ============================================
// SCHEMAS DE CATEGORIA
// ============================================

export const categoriaSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  ordem: z.number().int().default(0),
  visible: z.boolean().default(true),
});

// ============================================
// SCHEMAS DE PEDIDO
// ============================================

export const pedidoSchema = z.object({
  cliente_nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  whatsapp: z.string().min(10, 'WhatsApp inválido'),
  forma_entrega: z.enum(['delivery', 'retirada', 'mesa', 'outros']),
  endereco: z.string().optional(),
  numero: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  complemento: z.string().optional(),
  observacoes: z.string().optional(),
  mesa: z.string().optional(),
});

// ============================================
// SCHEMAS DE PLANO
// ============================================

export const planoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  descricao: z.string().optional(),
  duracao_meses: z.number().int().min(1),
  duracao_dias: z.number().int().min(1),
  valor_total: z.number().min(0),
  valor_mensal: z.number().min(0),
  limite_produtos: z.number().int().min(0),
  funcionalidade_disparador: z.boolean().default(false),
  funcionalidade_marketplace: z.boolean().default(false),
  funcionalidade_variacao: z.boolean().default(false),
  funcionalidade_banners: z.boolean().default(false),
  visible: z.boolean().default(true),
  ordem: z.number().int().default(0),
});

// ============================================
// SCHEMAS DE BANNER
// ============================================

export const bannerSchema = z.object({
  imagem: z.string().min(1, 'Imagem é obrigatória'),
  link: z.string().optional(),
  ordem: z.number().int().default(0),
  visible: z.boolean().default(true),
});

// ============================================
// SCHEMAS DE CUPOM
// ============================================

export const cupomSchema = z.object({
  codigo: z.string().min(3, 'Código deve ter no mínimo 3 caracteres'),
  tipo: z.enum(['percentual', 'valor_fixo']),
  valor: z.number().min(0),
  quantidade_uso: z.number().int().min(1),
  validade: z.string().optional(),
});

// ============================================
// TYPES INFERIDOS
// ============================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type EstabelecimentoInput = z.infer<typeof estabelecimentoSchema>;
export type ProdutoInput = z.infer<typeof produtoSchema>;
export type CategoriaInput = z.infer<typeof categoriaSchema>;
export type PedidoInput = z.infer<typeof pedidoSchema>;
export type PlanoInput = z.infer<typeof planoSchema>;
export type BannerInput = z.infer<typeof bannerSchema>;
export type CupomInput = z.infer<typeof cupomSchema>;
