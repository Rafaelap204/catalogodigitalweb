# Migração MySQL → PostgreSQL/Supabase

## Visão Geral

Este documento descreve o processo de migração do banco de dados MySQL (`ilinkbiocom_banco.sql`) para PostgreSQL/Supabase, dividido em 7 partes lógicas.

## Estrutura dos Arquivos de Migração

### Parte 1 - Tabelas Auxiliares (`migracao_parte1_auxiliares.sql`)
**Status:** ✅ Concluído

Tabelas incluídas:
- `estados` (27 registros) - Todos os estados brasileiros
- `cidades` (~5564 registros) - Todos os municípios brasileiros
- `segmentos` (36 registros) - Segmentos de mercado (Delivery, Comércio, etc.)
- `planos` (4 registros) - Planos de assinatura (Grátis, Trimestral, Anual, Mensal)

### Parte 2 - Tabelas de Usuários (`migracao_parte2_usuarios.sql`)
**Status:** ✅ Concluído

Tabelas incluídas:
- `users` (~174 registros) - Usuários do sistema
- `users_data` (12 registros) - Dados adicionais dos usuários

### Parte 3 - Tabelas Principais (`migracao_parte3_principais.sql`)
**Status:** ⏳ Pendente

Tabelas a incluir:
- `estabelecimentos` - Lojas/empresas cadastradas
- `categorias` - Categorias de produtos
- `produtos` - Produtos das lojas
- `subdominios` - Subdomínios das lojas

### Parte 4 - Pedidos e Pagamentos (`migracao_parte4_pedidos.sql`)
**Status:** ⏳ Pendente

Tabelas a incluir:
- `pedidos` - Pedidos dos clientes
- `pagamentos` - Pagamentos realizados
- `pedidos_para_imprimir` - Pedidos para impressão
- `clientes` - Clientes cadastrados

### Parte 5 - Configuração e Utilitários (`migracao_parte5_config.sql`)
**Status:** ⏳ Pendente

Tabelas a incluir:
- `configuracoes` - Configurações do sistema
- `cupons` - Cupons de desconto
- `vouchers` - Vouchers de desconto
- `validades` - Validades de produtos
- `frete` - Configurações de frete
- `impressao` - Configurações de impressão
- `link` - Links externos
- `logs` - Logs do sistema
- `midia` - Mídias/arquivos

### Parte 6 - Marketing (`migracao_parte6_marketing.sql`)
**Status:** ⏳ Pendente

Tabelas a incluir:
- `banners` - Banners promocionais
- `banners_marketplace` - Banners do marketplace
- `agendamentos` - Agendamentos de ações

### Parte 7 - Assinaturas (`migracao_parte7_assinaturas.sql`)
**Status:** ⏳ Pendente

Tabelas a incluir:
- `assinaturas` - Assinaturas dos planos

## Conversões de Tipo (MySQL → PostgreSQL)

| MySQL | PostgreSQL | Observações |
|-------|------------|-------------|
| `int NOT NULL AUTO_INCREMENT` | `SERIAL PRIMARY KEY` | Auto-incremento |
| `int` | `INTEGER` | Inteiro simples |
| `varchar(n)` | `TEXT` | Texto de tamanho variável |
| `text` | `TEXT` | Texto longo |
| `datetime` | `TIMESTAMP WITH TIME ZONE` | Data e hora com timezone |
| `date` | `DATE` | Apenas data |
| `time` | `TIME` | Apenas hora |
| `decimal(10,2)` | `DECIMAL(10,2)` | Decimal com precisão |
| `ENGINE=MyISAM/InnoDB` | (removido) | Não aplicável no PostgreSQL |
| `CHARACTER SET latin1` | (removido) | PostgreSQL usa UTF-8 nativo |

## Padrão dos INSERTs

Todos os INSERTs utilizam a cláusula `ON CONFLICT (id) DO NOTHING` para evitar duplicação de registros em caso de reexecução:

```sql
INSERT INTO tabela (colunas...) VALUES
(valores...),
(valores...)
ON CONFLICT (id) DO NOTHING;
```

## Como Executar a Migração

### Pré-requisitos
1. Ter uma conta no Supabase criada
2. Ter acesso ao SQL Editor do Supabase

### Passo a Passo

1. **Execute o schema base** (se ainda não existir):
   ```sql
   -- Execute o arquivo schema_supabase.sql primeiro
   ```

2. **Execute as partes em ordem**:
   ```sql
   -- Parte 1: Tabelas Auxiliares
   -- Execute: migracao_parte1_auxiliares.sql
   
   -- Parte 2: Tabelas de Usuários
   -- Execute: migracao_parte2_usuarios.sql
   
   -- Parte 3: Tabelas Principais
   -- Execute: migracao_parte3_principais.sql
   
   -- Parte 4: Pedidos e Pagamentos
   -- Execute: migracao_parte4_pedidos.sql
   
   -- Parte 5: Configuração e Utilitários
   -- Execute: migracao_parte5_config.sql
   
   -- Parte 6: Marketing
   -- Execute: migracao_parte6_marketing.sql
   
   -- Parte 7: Assinaturas
   -- Execute: migracao_parte7_assinaturas.sql
   ```

3. **Verifique os dados**:
   ```sql
   SELECT COUNT(*) FROM estados;
   SELECT COUNT(*) FROM cidades;
   SELECT COUNT(*) FROM usuarios;
   -- etc...
   ```

## Observações Importantes

1. **Dados de cidades**: A tabela `cidades` possui ~5564 registros. No arquivo de exemplo da Parte 1, apenas uma amostra foi incluída. Para migrar todos os dados, é necessário extrair o dump completo.

2. **Senhas**: As senhas dos usuários estão em formato MD5. Para maior segurança, considere implementar um mecanismo de reset de senha após a migração.

3. **Chaves estrangeiras**: As relações entre tabelas são mantidas através de campos `id`. Certifique-se de que as tabelas sejam criadas na ordem correta para respeitar as dependências.

4. **Timezone**: Os campos `TIMESTAMP WITH TIME ZONE` armazenam o timezone. Certifique-se de que o timezone do servidor Supabase esteja configurado corretamente (recomendado: `America/Fortaleza` ou `UTC`).

## Arquivos Gerados

| Arquivo | Descrição | Status |
|---------|-----------|--------|
| `migracao_parte1_auxiliares.sql` | Tabelas auxiliares | ✅ Criado |
| `migracao_parte2_usuarios.sql` | Tabelas de usuários | ✅ Criado |
| `migracao_parte3_principais.sql` | Tabelas principais | ⏳ Pendente |
| `migracao_parte4_pedidos.sql` | Pedidos e pagamentos | ⏳ Pendente |
| `migracao_parte5_config.sql` | Configuração e utilitários | ⏳ Pendente |
| `migracao_parte6_marketing.sql` | Marketing | ⏳ Pendente |
| `migracao_parte7_assinaturas.sql` | Assinaturas | ⏳ Pendente |
| `schema_supabase.sql` | Schema base do Supabase | ✅ Existe |

## Próximos Passos

1. Completar a geração das Partes 3-7
2. Validar os dados migrados
3. Testar a aplicação com o novo banco de dados
4. Realizar o cutover para o Supabase

---
**Data de criação:** 2026-03-13  
**Última atualização:** 2026-03-13
