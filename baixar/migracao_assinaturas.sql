-- ============================================
-- MIGRACAO TABELA: assinaturas
-- ============================================

CREATE TABLE IF NOT EXISTS assinaturas (
  id SERIAL PRIMARY KEY,
  rel_planos_id TEXT,
  rel_estabelecimentos_id TEXT,
  rel_estabelecimentos_nome TEXT,
  rel_estabelecimentos_subdominio TEXT,
  afiliado TEXT,
  nome TEXT,
  descricao TEXT,
  comissionamento TEXT,
  duracao_meses TEXT,
  duracao_dias TEXT,
  valor_total DECIMAL(10,2),
  valor_recebido DECIMAL(10,2),
  valor_mensal DECIMAL(10,2),
  termos TEXT,
  funcionalidade_disparador TEXT DEFAULT '0',
  funcionalidade_marketplace TEXT,
  funcionalidade_variacao TEXT,
  funcionalidade_banners TEXT,
  gateway_ref TEXT,
  gateway_link TEXT,
  gateway_transaction TEXT,
  gateway_payable DATE,
  gateway_expiration DATE,
  gateway_payment TEXT,
  mode TEXT,
  voucher TEXT,
  status TEXT,
  used TEXT,
  expiration DATE,
  created TIMESTAMP,
  excluded TEXT,
  limite_produtos TEXT
);

INSERT INTO assinaturas (id, rel_planos_id, rel_estabelecimentos_id, rel_estabelecimentos_nome, rel_estabelecimentos_subdominio, afiliado, nome, descricao, comissionamento, duracao_meses, duracao_dias, valor_total, valor_recebido, valor_mensal, termos, funcionalidade_disparador, funcionalidade_marketplace, funcionalidade_variacao, funcionalidade_banners, gateway_ref, gateway_link, gateway_transaction, gateway_payable, gateway_expiration, gateway_payment, mode, voucher, status, used, expiration, created, excluded, limite_produtos) VALUES
(39, '9', '28', NULL, NULL, '', 'Disparador Anual', 'Banner Promocional', '2', '12', '365', 997.00, NULL, 97.00, 'Termos...', '1', '1', '1', '1', NULL, NULL, NULL, NULL, NULL, NULL, '2', '1JKC-C9G4-KAHK-H211', '3', '3', '2025-04-11', '2024-04-11 17:16:29', NULL, '1000'),
(41, '9', '39', NULL, NULL, '', 'Disparador Anual', 'Banner Promocional', '2', '12', '365', 997.00, NULL, 97.00, 'Termos...', '1', '1', '1', '1', NULL, NULL, NULL, NULL, NULL, NULL, '2', 'GGEJ-GGD8-2AGK-BCIH', '3', '3', '2025-04-11', '2024-04-11 17:17:27', NULL, '1000')
ON CONFLICT (id) DO NOTHING;
