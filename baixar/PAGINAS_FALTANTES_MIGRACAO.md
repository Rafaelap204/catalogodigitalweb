# Páginas Faltantes na Migração (14 páginas)

## 📊 Análise Comparativa

Com base na comparação entre o PHP original (`public_html`) e o Next.js (`ilink-next/app`), identifiquei as seguintes páginas que ainda **não foram migradas**:

---

## 🎯 Prioridade 1: Páginas Admin Essenciais (7 páginas)

| # | Página PHP Original | Status | Prioridade |
|---|---------------------|--------|------------|
| 1 | `administracao/cidades/` (CRUD) | ❌ Não migrado | 🔴 Alta |
| 2 | `administracao/estados/` (CRUD) | ❌ Não migrado | 🔴 Alta |
| 3 | `administracao/segmentos/` (CRUD) | ❌ Não migrado | 🔴 Alta |
| 4 | `administracao/subdominios/` (CRUD) | ❌ Não migrado | 🔴 Alta |
| 5 | `administracao/vouchers/` (CRUD) | ❌ Não migrado | 🟡 Média |
| 6 | `administracao/banners_marketplace/` (CRUD) | ❌ Não migrado | 🟡 Média |
| 7 | `administracao/captar/` | ❌ Não migrado | 🟡 Média |

---

## 🎯 Prioridade 2: Páginas Painel do Estabelecimento (4 páginas)

| # | Página PHP Original | Status | Prioridade |
|---|---------------------|--------|------------|
| 8 | `painel/banners/` (CRUD) | ❌ Não migrado | 🟡 Média |
| 9 | `painel/cupons/` (CRUD) | ❌ Não migrado | 🟡 Média |
| 10 | `painel/frete/` (CRUD) | ❌ Não migrado | 🟡 Média |
| 11 | `painel/local/` (CRUD) | ❌ Não migrado | 🟢 Baixa |

---

## 🎯 Prioridade 3: Páginas Públicas (3 páginas)

| # | Página PHP Original | Status | Prioridade |
|---|---------------------|--------|------------|
| 12 | `conheca/index.php` | ❌ Não migrado | 🟡 Média |
| 13 | `localizacao/index.php` | ❌ Não migrado | 🟢 Baixa |
| 14 | `gerador/generate.php` | ❌ Não migrado | 🟢 Baixa |

---

## 📋 Resumo por Área

### Área Administrativa
- ✅ **Migrados**: assinaturas, banners, categorias, configuracoes, estabelecimentos, inicio, pedidos, planos, produtos, usuarios, avaliacoes, cupons, etc.
- ❌ **Faltando**: cidades, estados, segmentos, subdominios, vouchers, banners_marketplace, captar, marketplace

### Área Painel (Estabelecimento)
- ✅ **Migrados**: inicio, categorias, produtos, pedidos, perfil, configuracoes (parcial)
- ❌ **Faltando**: banners, cupons, frete, horarios, local, pdv, plano, qrcode, relatorio, validade

### Área Afiliado
- ✅ **Migrados**: inicio, comissoes, dados-bancarios, indicados, link, saques
- ❌ **Faltando**: c_ativos, configuracoes, estabelecimentos, planos, segmentos, vouchers

### Páginas Públicas
- ✅ **Migrados**: login, cadastro, esqueci-senha, index
- ❌ **Faltando**: conheca, localizacao, gerador

---

## 🔧 Plano de Ação Sugerido

### Fase 1: CRUDs Admin (Dias 1-2)
1. `cidades/` - Listar, Adicionar, Editar, Deletar
2. `estados/` - Listar, Adicionar, Editar, Deletar
3. `segmentos/` - Listar, Adicionar, Editar, Deletar
4. `subdominios/` - Listar, Adicionar, Editar, Deletar

### Fase 2: Páginas Admin Complementares (Dia 3)
5. `vouchers/` - Listar, Adicionar, Editar, Deletar
6. `banners_marketplace/` - Listar, Adicionar, Editar, Deletar
7. `captar/` - Página simples

### Fase 3: Páginas Painel (Dias 4-5)
8. `painel/banners/`
9. `painel/cupons/`
10. `painel/frete/`
11. `painel/local/`

### Fase 4: Páginas Públicas (Dia 6)
12. `conheca/` - Landing page
13. `localizacao/` - Página de localização
14. `gerador/` - Gerador de links

---

## ⏱️ Estimativa de Tempo

- **Fase 1**: 2 dias
- **Fase 2**: 1 dia
- **Fase 3**: 2 dias
- **Fase 4**: 1 dia

**Total: 6 dias** para completar as 14 páginas faltantes

---

## ❓ Próximos Passos

1. Quer que eu comece migrando as páginas da **Fase 1** (CRUDs Admin)?
2. Prefere focar em alguma área específica primeiro?
3. Alguma dessas páginas tem prioridade maior que as outras?
