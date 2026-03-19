-- =====================================================
-- LIMPEZA COMPLETA DO BANCO - MANTÉM APENAS ADMIN
-- =====================================================
-- Tabelas existentes no banco (conforme screenshot)
-- =====================================================

-- Desabilitar verificações de FK temporariamente
SET session_replication_role = 'replica';

-- =====================================================
-- TABELAS AUXILIARES
-- =====================================================

-- Limpar logs
TRUNCATE TABLE logs RESTART IDENTITY CASCADE;

-- Limpar validades
TRUNCATE TABLE validades RESTART IDENTITY CASCADE;

-- =====================================================
-- TABELAS DE PAGAMENTOS
-- =====================================================

-- Limpar pagamentos
TRUNCATE TABLE pagamentos RESTART IDENTITY CASCADE;

-- =====================================================
-- TABELAS DE PEDIDOS
-- =====================================================

-- Limpar pedidos
TRUNCATE TABLE pedidos RESTART IDENTITY CASCADE;

-- =====================================================
-- TABELAS DE PRODUTOS E MÍDIA
-- =====================================================

-- Limpar mídia (imagens)
TRUNCATE TABLE midia RESTART IDENTITY CASCADE;

-- Limpar produtos
TRUNCATE TABLE produtos RESTART IDENTITY CASCADE;

-- =====================================================
-- TABELAS DE CATEGORIAS
-- =====================================================

-- Limpar categorias
TRUNCATE TABLE categorias RESTART IDENTITY CASCADE;

-- =====================================================
-- TABELAS DE ESTABELECIMENTOS
-- =====================================================

-- Limpar agendamentos
TRUNCATE TABLE agendamentos RESTART IDENTITY CASCADE;

-- Limpar configuracoes
TRUNCATE TABLE configuracoes RESTART IDENTITY CASCADE;

-- Limpar cupons
TRUNCATE TABLE cupons RESTART IDENTITY CASCADE;

-- Limpar banners
TRUNCATE TABLE banners RESTART IDENTITY CASCADE;

-- Limpar assinaturas
TRUNCATE TABLE assinaturas RESTART IDENTITY CASCADE;

-- Limpar estabelecimentos
TRUNCATE TABLE estabelecimentos RESTART IDENTITY CASCADE;

-- =====================================================
-- TABELAS DE USUÁRIOS
-- =====================================================

-- Limpar dados dos usuários
TRUNCATE TABLE users_data RESTART IDENTITY CASCADE;

-- Deletar TODOS os usuários EXCETO o administrador (ID = 1)
DELETE FROM users WHERE id != 1;

-- =====================================================
-- TABELAS DE MARKETPLACE
-- =====================================================

-- Limpar vouchers
TRUNCATE TABLE vouchers RESTART IDENTITY CASCADE;

-- Limpar subdomínios
TRUNCATE TABLE subdominios RESTART IDENTITY CASCADE;

-- =====================================================
-- TABELAS GEOGRÁFICAS (mantém por padrão)
-- =====================================================

-- Opcional: descomente se quiser limpar também:
-- TRUNCATE TABLE cidades RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE estados RESTART IDENTITY CASCADE;

-- =====================================================
-- TABELAS DE CONFIGURAÇÃO (mantém por padrão)
-- =====================================================

-- Opcional: descomente se quiser limpar também:
-- TRUNCATE TABLE planos RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE segmentos RESTART IDENTITY CASCADE;

-- Reabilitar verificações de FK
SET session_replication_role = 'origin';

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Verificar se o admin ainda existe
SELECT 'Usuário administrador:' as verificacao, id, email, nome 
FROM users 
WHERE id = 1;

-- Contar registros restantes
SELECT 'Total de usuários:' as info, COUNT(*) as total FROM users;
SELECT 'Total de estabelecimentos:' as info, COUNT(*) as total FROM estabelecimentos;
SELECT 'Total de pedidos:' as info, COUNT(*) as total FROM pedidos;
SELECT 'Total de produtos:' as info, COUNT(*) as total FROM produtos;
SELECT 'Total de categorias:' as info, COUNT(*) as total FROM categorias;
SELECT 'Total de assinaturas:' as info, COUNT(*) as total FROM assinaturas;
