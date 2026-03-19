# Plano Técnico - Fase 1: CRUDs Admin

## 📋 Resumo das Páginas a Migrar

### 1. CRUD Cidades (`administracao/cidades/`)
**Estrutura da tabela `cidades`:**
```sql
- id (bigint, PK)
- estado (bigint, FK -> estados.id)
- nome (varchar)
- created_at (timestamp)
```

**Campos do formulário:**
- `estado`: Select com lista de estados (SELECT * FROM estados ORDER BY nome)
- `nome`: Input text (obrigatório)

**Filtros de listagem:**
- Nome (LIKE 'nome%')
- Estado (dropdown select)

**Paginação:** 20 registros por página

---

### 2. CRUD Estados (`administracao/estados/`)
**Estrutura da tabela `estados`:**
```sql
- id (bigint, PK)
- nome (varchar)
- uf (varchar)
- created_at (timestamp)
```

**Campos do formulário:**
- `nome`: Input text (obrigatório)
- `uf`: Input text (obrigatório, 2 caracteres)

**Filtros de listagem:**
- Nome (LIKE 'nome%')

**Paginação:** 20 registros por página

---

### 3. CRUD Segmentos (`administracao/segmentos/`)
**Estrutura da tabela `segmentos`:**
```sql
- id (bigint, PK)
- nome (varchar)
- icone (text - URL da imagem)
- censura (int - 0 ou 1)
- created_at (timestamp)
```

**Campos do formulário:**
- `nome`: Input text (obrigatório)
- `icone`: File upload (imagem)
- `censura`: Select sim/não (0 ou 1)

**Filtros de listagem:**
- Nome (LIKE 'nome%')

**Paginação:** 20 registros por página

---

### 4. CRUD Subdomínios (`administracao/subdominios/`)
**Estrutura da tabela `subdominios`:**
```sql
- id (bigint, PK)
- subdominio (varchar - slug)
- tipo (int: 1=estabelecimento, 2=cidade, 3=url, 4=outro)
- rel_id (bigint - ID relacionado)
- url (text - para tipo 3 e 4)
- created_at (timestamp)
```

**Campos do formulário:**
- `subdominio`: Input text (obrigatório, slug)
- `tipo`: Select (1=Loja/Estabelecimento, 2=Cidade, 3=URL, 4=Outro)
- `estabelecimento_id`: Select de estabelecimentos (mostrar quando tipo=1)
- `cidade_id`: Select de cidades (mostrar quando tipo=2)
- `url`: Input text (obrigatório quando tipo=3 ou 4)

**Filtros de listagem:**
- Subdomínio (LIKE 'subdominio%')
- Tipo (dropdown select)

**Paginação:** 20 registros por página

---

## 🗂️ Estrutura de Arquivos Next.js

```
app/(admin)/administracao/
├── cidades/
│   ├── page.tsx                    # Listagem
│   ├── adicionar/
│   │   └── page.tsx               # Form adicionar
│   ├── editar/
│   │   └── [id]/
│   │       └── page.tsx           # Form editar
│   └── deletar/
│       └── [id]/
│           └── page.tsx           # Confirmação deletar
├── estados/
│   ├── page.tsx
│   ├── adicionar/
│   │   └── page.tsx
│   ├── editar/
│   │   └── [id]/
│   │       └── page.tsx
│   └── deletar/
│       └── [id]/
│           └── page.tsx
├── segmentos/
│   ├── page.tsx
│   ├── adicionar/
│   │   └── page.tsx
│   ├── editar/
│   │   └── [id]/
│   │       └── page.tsx
│   └── deletar/
│       └── [id]/
│           └── page.tsx
└── subdominios/
    ├── page.tsx
    ├── adicionar/
    │   └── page.tsx
    ├── editar/
    │   └── [id]/
    │       └── page.tsx
    └── deletar/
        └── [id]/
            └── page.tsx
```

---

## 🔧 Server Actions Necessárias

### Cidades
```typescript
// lib/server/actions/cidades.ts
- listarCidades(filtros, pagina, limite)
- buscarCidade(id)
- criarCidade(data)
- atualizarCidade(id, data)
- deletarCidade(id)
- contarCidades(filtros)
```

### Estados
```typescript
// lib/server/actions/estados.ts
- listarEstados(filtros, pagina, limite)
- buscarEstado(id)
- criarEstado(data)
- atualizarEstado(id, data)
- deletarEstado(id)
- contarEstados(filtros)
```

### Segmentos
```typescript
// lib/server/actions/segmentos.ts
- listarSegmentos(filtros, pagina, limite)
- buscarSegmento(id)
- criarSegmento(data, iconeFile)
- atualizarSegmento(id, data, iconeFile)
- deletarSegmento(id)
- contarSegmentos(filtros)
```

### Subdomínios
```typescript
// lib/server/actions/subdominios.ts
- listarSubdominios(filtros, pagina, limite)
- buscarSubdominio(id)
- criarSubdominio(data)
- atualizarSubdominio(id, data)
- deletarSubdominio(id)
- contarSubdominios(filtros)
```

---

## 📊 Componentes Reutilizáveis

### Já existentes (usar como base):
- DataTable (de `administracao/categorias/page.tsx`)
- FormField (padrão dos formulários)
- Pagination (componente de paginação)
- FileUpload (para ícones de segmentos)

### Novos componentes necessários:
- SelectEstado (dropdown de estados)
- SelectEstabelecimento (dropdown de estabelecimentos)
- SelectCidade (dropdown de cidades)

---

## 🔒 Permissões

Todas as páginas requerem autenticação de administrador (restrict('1'))

---

## 🎨 Design/UI

Manter o mesmo padrão dos CRUDs já migrados:
- Ícones Lni (Line Icons)
- Classes CSS existentes
- Layout consistente com categorias/usuários

---

## ⚡ Ordem de Implementação Sugerida

1. **Estados** (mais simples, só nome e UF)
2. **Cidades** (depende de estados)
3. **Segmentos** (tem upload de imagem)
4. **Subdomínios** (mais complexo, campos condicionais)

---

## ⏱️ Estimativa

- Estados: 2 horas
- Cidades: 2 horas
- Segmentos: 3 horas (upload de imagem)
- Subdomínios: 3 horas (lógica condicional)

**Total: ~10 horas** (1 dia de trabalho)
