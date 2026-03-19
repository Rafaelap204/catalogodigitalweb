# Plano de Migração Total - 130+ Páginas

## ⚠️ Situação

Migrar todas as 130+ páginas manualmente é um trabalho extenso (8-16 dias).

## 🎯 Estratégia Proposta

### Fase 1: Estrutura Base (1 dia) ✅
- ✅ Assets CSS/JS copiados
- ✅ Layout base criado
- ✅ Login funcionando
- ✅ Dashboard admin

### Fase 2: CRUDs Principais (3-4 dias)
Criar estrutura reutilizável para:
1. **Estabelecimentos** (listar, adicionar, editar)
2. **Produtos** (listar, adicionar, editar)
3. **Pedidos** (listar, visualizar)
4. **Categorias**
5. **Planos**
6. **Usuários**

### Fase 3: Páginas Secundárias (3-4 dias)
- Banners
- Assinaturas
- Vouchers
- Configurações
- etc.

### Fase 4: Área do Estabelecimento (2-3 dias)
- Layout painel
- Dashboard estabelecimento
- CRUDs do estabelecimento

### Fase 5: Área do Afiliado (1-2 dia)
- Layout afiliado
- Dashboard afiliado

## 🔧 Abordagem Técnica

### Server Actions Reutilizáveis:
```typescript
// lib/server/actions/crud.ts
- listarRegistros(tabela, filtros)
- buscarRegistro(tabela, id)
- criarRegistro(tabela, dados)
- atualizarRegistro(tabela, id, dados)
- deletarRegistro(tabela, id)
```

### Componentes Reutilizáveis:
- DataTable (listagem com filtros)
- FormField (campos de formulário)
- ModalConfirm (confirmação de ações)
- Pagination (paginação)

## ⏱️ Tempo Total Real

Com a abordagem acima: **10-14 dias** (em vez de 16)

## ❓ Pergunta

Como o trabalho é extenso, preciso saber:

1. **Posso continuar agora** migrando as páginas principais?
2. **Prefere que eu pare** e documente o que falta?
3. **Quer focar em algo específico** primeiro?

---

## 📊 Status Atual

| Área | Progresso |
|------|-----------|
| Assets | ✅ 100% |
| Layout Base | ✅ 100% |
| Login | ✅ 100% |
| Dashboard Admin | ✅ 100% |
| Estabelecimentos | ❌ 0% |
| Produtos | ❌ 0% |
| Pedidos | ❌ 0% |
| Demais CRUDs | ❌ 0% |

**Total: ~10% concluído**
