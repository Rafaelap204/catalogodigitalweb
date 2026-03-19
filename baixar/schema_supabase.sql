-- ============================================
-- SCHEMA PARA SUPABASE
-- Migração MySQL → PostgreSQL
-- ============================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELAS AUXILIARES (criar primeiro)
-- ============================================

-- Estados
CREATE TABLE estados (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  uf TEXT NOT NULL UNIQUE
);

-- Cidades
CREATE TABLE cidades (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  estado_id INTEGER REFERENCES estados(id),
  subdominio TEXT UNIQUE
);

-- Segmentos
CREATE TABLE segmentos (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  icone TEXT,
  status INTEGER DEFAULT 1
);

-- Planos
CREATE TABLE planos (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  duracao_meses INTEGER,
  duracao_dias INTEGER,
  valor_total DECIMAL(10,2),
  valor_mensal DECIMAL(10,2),
  limite_produtos INTEGER,
  funcionalidade_disparador BOOLEAN DEFAULT false,
  funcionalidade_marketplace BOOLEAN DEFAULT false,
  funcionalidade_variacao BOOLEAN DEFAULT false,
  funcionalidade_banners BOOLEAN DEFAULT false,
  visible BOOLEAN DEFAULT true,
  status INTEGER DEFAULT 1,
  ordem INTEGER DEFAULT 0
);

-- ============================================
-- TABELAS DE USUÁRIOS
-- ============================================

-- Users (tabela auxiliar para migração, idealmente use auth.users)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  nivel TEXT DEFAULT 'usuario',
  nome TEXT,
  keepalive TEXT,
  last_login TIMESTAMP WITH TIME ZONE,
  recover_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dados adicionais dos usuários
CREATE TABLE users_data (
  id SERIAL PRIMARY KEY,
  rel_users_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  telefone TEXT,
  cidade INTEGER,
  estado INTEGER,
  endereco TEXT,
  numero TEXT,
  bairro TEXT,
  cep TEXT
);

-- ============================================
-- TABELAS PRINCIPAIS
-- ============================================

-- Estabelecimentos
CREATE TABLE estabelecimentos (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  subdominio TEXT UNIQUE NOT NULL,
  rel_users_id INTEGER REFERENCES users(id),
  cidade_id INTEGER REFERENCES cidades(id),
  estado_id INTEGER REFERENCES estados(id),
  segmento_id INTEGER REFERENCES segmentos(id),
  perfil TEXT,
  capa TEXT,
  descricao TEXT,
  cor TEXT DEFAULT '#000000',
  whatsapp TEXT,
  email TEXT,
  endereco TEXT,
  numero TEXT,
  bairro TEXT,
  cep TEXT,
  telefone TEXT,
  status INTEGER DEFAULT 1,
  excluded BOOLEAN DEFAULT false,
  afiliado INTEGER,
  funcionamento INTEGER DEFAULT 1,
  acompanhamento_finalizacao TEXT,
  minimo_entrega_gratis DECIMAL(10,2),
  taxa_delivery DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categorias
CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  rel_estabelecimentos_id INTEGER REFERENCES estabelecimentos(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  status INTEGER DEFAULT 1
);

-- Produtos
CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  rel_estabelecimentos_id INTEGER REFERENCES estabelecimentos(id) ON DELETE CASCADE,
  rel_categorias_id INTEGER REFERENCES categorias(id),
  nome TEXT NOT NULL,
  descricao TEXT,
  valor DECIMAL(10,2),
  valor_promocional DECIMAL(10,2),
  estoque INTEGER DEFAULT 0,
  posicao INTEGER DEFAULT 0,
  imagem TEXT,
  destaque BOOLEAN DEFAULT false,
  visible BOOLEAN DEFAULT true,
  status INTEGER DEFAULT 1,
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pedidos
CREATE TABLE pedidos (
  id SERIAL PRIMARY KEY,
  rel_estabelecimentos_id INTEGER REFERENCES estabelecimentos(id),
  cliente_nome TEXT,
  whatsapp TEXT,
  v_pedido DECIMAL(10,2),
  forma_entrega TEXT,
  valor_frete DECIMAL(10,2),
  endereco TEXT,
  numero TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  complemento TEXT,
  observacoes TEXT,
  cupom TEXT,
  status INTEGER DEFAULT 1,
  comprovante TEXT,
  data TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assinaturas
CREATE TABLE assinaturas (
  id SERIAL PRIMARY KEY,
  rel_planos_id INTEGER REFERENCES planos(id),
  rel_estabelecimentos_id INTEGER REFERENCES estabelecimentos(id),
  afiliado INTEGER,
  nome TEXT,
  descricao TEXT,
  comissionamento TEXT,
  duracao_meses INTEGER,
  duracao_dias INTEGER,
  valor_total DECIMAL(10,2),
  valor_mensal DECIMAL(10,2),
  expiration DATE,
  gateway_ref TEXT,
  gateway_payment TEXT,
  gateway_transaction TEXT,
  voucher TEXT,
  mode TEXT,
  termos TEXT,
  limite_produtos INTEGER,
  funcionalidade_disparador BOOLEAN DEFAULT false,
  funcionalidade_marketplace BOOLEAN DEFAULT false,
  funcionalidade_variacao BOOLEAN DEFAULT false,
  funcionalidade_banners BOOLEAN DEFAULT false,
  status INTEGER DEFAULT 0,
  used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Banners
CREATE TABLE banners (
  id SERIAL PRIMARY KEY,
  rel_estabelecimentos_id INTEGER REFERENCES estabelecimentos(id) ON DELETE CASCADE,
  titulo TEXT,
  imagem TEXT NOT NULL,
  link TEXT,
  video_link TEXT,
  ordem INTEGER DEFAULT 0,
  status INTEGER DEFAULT 1
);

-- Cupons
CREATE TABLE cupons (
  id SERIAL PRIMARY KEY,
  rel_estabelecimentos_id INTEGER REFERENCES estabelecimentos(id) ON DELETE CASCADE,
  codigo TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT,
  valor DECIMAL(10,2),
  quantidade INTEGER,
  validade DATE,
  status INTEGER DEFAULT 1
);

-- Vouchers
CREATE TABLE vouchers (
  id SERIAL PRIMARY KEY,
  rel_planos_id INTEGER REFERENCES planos(id),
  rel_assinaturas_id INTEGER,
  codigo TEXT UNIQUE NOT NULL,
  descricao TEXT,
  status INTEGER DEFAULT 1
);

-- Subdomínios
CREATE TABLE subdominios (
  id SERIAL PRIMARY KEY,
  rel_id INTEGER,
  subdominio TEXT UNIQUE NOT NULL,
  status INTEGER DEFAULT 1
);

-- Frete
CREATE TABLE frete (
  id SERIAL PRIMARY KEY,
  rel_estabelecimentos_id INTEGER REFERENCES estabelecimentos(id) ON DELETE CASCADE,
  nome TEXT,
  valor DECIMAL(10,2),
  outros BOOLEAN DEFAULT false,
  status INTEGER DEFAULT 1
);

-- Mídia (imagens dos produtos)
CREATE TABLE midia (
  id SERIAL PRIMARY KEY,
  type INTEGER DEFAULT 1,
  rel_estabelecimentos_id INTEGER REFERENCES estabelecimentos(id) ON DELETE CASCADE,
  rel_id INTEGER,
  url TEXT
);

-- Agendamentos
CREATE TABLE agendamentos (
  id SERIAL PRIMARY KEY,
  rel_estabelecimentos_id INTEGER REFERENCES estabelecimentos(id) ON DELETE CASCADE,
  acao INTEGER,
  hora TIME,
  dom INTEGER DEFAULT 0,
  seg INTEGER DEFAULT 0,
  ter INTEGER DEFAULT 0,
  qua INTEGER DEFAULT 0,
  qui INTEGER DEFAULT 0,
  sex INTEGER DEFAULT 0,
  sab INTEGER DEFAULT 0
);

-- Pagamentos
CREATE TABLE pagamentos (
  id SERIAL PRIMARY KEY,
  estabelecimento INTEGER,
  pedido INTEGER,
  data DATE,
  hora TIME,
  valor DECIMAL(10,2),
  gateway TEXT,
  codigo TEXT,
  status TEXT
);

-- Links (redes sociais, etc)
CREATE TABLE link (
  id SERIAL PRIMARY KEY,
  nome TEXT,
  link TEXT
);

-- Logs
CREATE TABLE logs (
  id SERIAL PRIMARY KEY,
  rel_users_id INTEGER,
  rel_lojas_id INTEGER,
  info TEXT,
  date_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX idx_estabelecimentos_subdominio ON estabelecimentos(subdominio);
CREATE INDEX idx_estabelecimentos_rel_users_id ON estabelecimentos(rel_users_id);
CREATE INDEX idx_estabelecimentos_status ON estabelecimentos(status);
CREATE INDEX idx_estabelecimentos_excluded ON estabelecimentos(excluded);
CREATE INDEX idx_produtos_rel_estabelecimentos_id ON produtos(rel_estabelecimentos_id);
CREATE INDEX idx_produtos_rel_categorias_id ON produtos(rel_categorias_id);
CREATE INDEX idx_produtos_status ON produtos(status);
CREATE INDEX idx_pedidos_rel_estabelecimentos_id ON pedidos(rel_estabelecimentos_id);
CREATE INDEX idx_pedidos_whatsapp ON pedidos(whatsapp);
CREATE INDEX idx_pedidos_status ON pedidos(status);
CREATE INDEX idx_categorias_rel_estabelecimentos_id ON categorias(rel_estabelecimentos_id);
CREATE INDEX idx_assinaturas_rel_estabelecimentos_id ON assinaturas(rel_estabelecimentos_id);
CREATE INDEX idx_assinaturas_status ON assinaturas(status);
CREATE INDEX idx_banners_rel_estabelecimentos_id ON banners(rel_estabelecimentos_id);
CREATE INDEX idx_cupons_rel_estabelecimentos_id ON cupons(rel_estabelecimentos_id);
CREATE INDEX idx_cupons_codigo ON cupons(codigo);
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- FUNÇÕES ÚTEIS
-- ============================================

-- Função para atualizar o updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para estabelecimentos
CREATE TRIGGER update_estabelecimentos_updated_at
    BEFORE UPDATE ON estabelecimentos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();