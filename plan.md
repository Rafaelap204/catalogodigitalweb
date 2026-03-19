# Plano de Migração: PHP → Next.js 14

## Visão Geral

Migração completa de uma plataforma de catálogo digital/e-commerce de PHP/MySQL para Next.js 14 + TypeScript + Supabase.

## Estrutura do Projeto Original (PHP)

### Áreas do Sistema

```
public_html/
├── index.php                    # Router principal e landing page
├── login/                       # Autenticação
├── logout/                      # Logout
├── esqueci/                     # Recuperação de senha
├── novasenha/                   # Nova senha
├── conheca/                     # Landing page de vendas
├── comece/cadastrar/            # Cadastro de estabelecimento
├── administracao/               # Painel Admin (nível 1)
├── afiliado/                    # Painel Afiliado (nível 3)
├── painel/                      # Painel Estabelecimento (nível 2)
├── app/estabelecimento/         # Loja pública (subdomínio)
└── _core/_includes/             # Funções e configurações
```

### Níveis de Usuário

| Nível | Tipo | Acesso |
|-------|------|--------|
| 1 | Administrador | administracao/ |
| 2 | Estabelecimento | painel/ |
| 3 | Afiliado | afiliado/ |

### Funcionalidades Principais

1. **Catálogo Digital**
   - Subdomínios personalizados (loja.ilinkbio.com.br)
   - Categorias de produtos
   - Produtos com variações
   - Banners promocionais

2. **Pedidos**
   - Delivery
   - Retirada/Balcão
   - Mesa
   - Outros (personalizado)

3. **Pagamentos**
   - PIX
   - MercadoPago
   - PagSeguro
   - GetNet

4. **Assinaturas**
   - Planos (Grátis, Mensal, Trimestral, Anual)
   - Controle de validade
   - Limites por plano

5. **Marketing**
   - Banners
   - Cupons
   - Vouchers
   - Integração WhatsApp

## Arquitetura Next.js 14

### Estrutura de Pastas

```
ilink-next/
├── app/
│   ├── (public)/               # Grupo de rotas públicas
│   │   ├── page.tsx            # Landing page
│   │   ├── conheca/
│   │   └── comece/
│   │       └── cadastrar/
│   ├── (auth)/                 # Grupo de autenticação
│   │   ├── login/
│   │   ├── esqueci/
│   │   └── novasenha/
│   ├── (admin)/                # Grupo admin
│   │   ├── administracao/
│   │   │   └── inicio/
│   │   ├── layout.tsx          # Layout protegido admin
│   │   └── ...
│   ├── (afiliado)/             # Grupo afiliado
│   │   ├── afiliado/
│   │   │   └── inicio/
│   │   ├── layout.tsx          # Layout protegido afiliado
│   │   └── ...
│   ├── (painel)/               # Grupo painel estabelecimento
│   │   ├── painel/
│   │   │   └── inicio/
│   │   ├── layout.tsx          # Layout protegido painel
│   │   └── ...
│   ├── (loja)/                 # Loja pública por subdomínio
│   │   ├── [subdominio]/
│   │   │   ├── page.tsx        # Página principal da loja
│   │   │   ├── categoria/
│   │   │   ├── produto/
│   │   │   ├── sacola/
│   │   │   └── pedido/
│   │   └── layout.tsx
│   ├── api/                    # API Routes
│   │   ├── auth/
│   │   ├── pedidos/
│   │   ├── produtos/
│   │   └── ...
│   ├── layout.tsx              # Root layout
│   └── globals.css
├── components/
│   ├── ui/                     # Componentes base (shadcn)
│   ├── layout/                 # Layouts reutilizáveis
│   ├── forms/                  # Formulários
│   └── loja/                   # Componentes da loja pública
├── lib/
│   ├── supabase/               # Cliente Supabase
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client
│   │   └── admin.ts            # Admin client
│   ├── utils/
│   ├── hooks/                  # Custom hooks
│   └── constants/
├── types/
│   ├── database.ts             # Tipagens do Supabase
│   ├── models.ts               # Interfaces de dados
│   └── api.ts                  # Tipagens de API
├── public/
│   ├── uploads/                # Uploads de imagens
│   └── manifest.json
└── middleware.ts               # Auth middleware + subdomínio routing
```

### Database Schema (Supabase/PostgreSQL)

Baseado no schema existente em `schema_supabase.sql`:

```typescript
// Tabelas principais
- users
- users_data
- estabelecimentos
- categorias
- produtos
- pedidos
- pedidos_itens
- assinaturas
- planos
- cidades
- estados
- segmentos
- banners
- cupons
- vouchers
- logs
```

### Middleware

```typescript
// middleware.ts
// 1. Detectar subdomínio e redirecionar para rota dinâmica
// 2. Verificar autenticação por área
// 3. Verificar permissões por nível de usuário
```

### Autenticação

Usar **Supabase Auth** com:
- Email/Password
- Session management
- Row Level Security (RLS)

### Server Actions

Migrar todas as operações CRUD para Server Actions:

```typescript
// app/(painel)/painel/produtos/actions.ts
'use server'

export async function criarProduto(data: ProdutoInput) { ... }
export async function atualizarProduto(id: number, data: ProdutoInput) { ... }
export async function deletarProduto(id: number) { ... }
```

### Subdomínio Routing

```typescript
// Middleware detecta subdomínio e reescreve URL
// Ex: loja.ilinkbio.com.br → /loja/loja
```

## Mapeamento de Rotas PHP → Next.js

| PHP Route | Next.js Route | Tipo |
|-----------|---------------|------|
| `/index.php` | `/` | Page |
| `/conheca/index.php` | `/conheca` | Page |
| `/comece/cadastrar/index.php` | `/comece/cadastrar` | Page |
| `/login/index.php` | `/login` | Page |
| `/administracao/inicio/index.php` | `/administracao/inicio` | Page (protected) |
| `/afiliado/inicio/index.php` | `/afiliado/inicio` | Page (protected) |
| `/painel/inicio/index.php` | `/painel/inicio` | Page (protected) |
| `/app/estabelecimento/index.php` | `/[subdominio]` | Page |
| `/app/estabelecimento/sacola.php` | `/[subdominio]/sacola` | Page |
| `/app/estabelecimento/pedido.php` | `/[subdominio]/pedido` | Page |
| `/app/estabelecimento/produto.php` | `/[subdominio]/produto/[id]` | Page |

## Stack Tecnológico

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **State:** Zustand (carrinho)
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React
- **PWA:** next-pwa

## Fases de Implementação

### Fase 1: Setup (1-2 dias)
- Criar projeto Next.js 14
- Configurar Tailwind CSS
- Configurar shadcn/ui
- Setup Supabase client
- Criar tipagens TypeScript

### Fase 2: Autenticação (2-3 dias)
- Login page
- Recuperação de senha
- Middleware de proteção
- Session management

### Fase 3: Loja Pública (3-4 dias)
- Subdomínio routing
- Página da loja
- Catálogo de produtos
- Carrinho (Zustand)
- Checkout/PDV

### Fase 4: Painel Estabelecimento (4-5 dias)
- Dashboard
- Produtos CRUD
- Categorias CRUD
- Pedidos
- Configurações

### Fase 5: Painel Admin (3-4 dias)
- Gestão de estabelecimentos
- Gestão de planos
- Gestão de afiliados
- Relatórios

### Fase 6: Painel Afiliado (2-3 dias)
- Dashboard
- Estabelecimentos vinculados
- Comissões

### Fase 7: Sistemas Auxiliares (3-4 dias)
- Pagamentos
- Assinaturas
- Upload de imagens
- Notificações WhatsApp

### Fase 8: Polish (2-3 dias)
- SEO
- PWA
- Performance
- Testes

## Notas Importantes

1. **Zero Data Loss:** Manter exatamente o mesmo schema de dados
2. **URL Compatibility:** Preservar todas as URLs existentes
3. **Feature Parity:** Todas as funcionalidades devem ser migradas
4. **Progressive Enhancement:** Funcionar sem JS, melhorar com JS
