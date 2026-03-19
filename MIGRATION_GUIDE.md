# Guia de Migração PHP → Next.js 14

## 1. Estrutura do Projeto

```
ilink-next/
├── app/
│   ├── (public)/               # Rotas públicas
│   │   ├── page.tsx            # Landing page
│   │   ├── layout.tsx
│   │   ├── conheca/
│   │   │   └── page.tsx
│   │   └── comece/
│   │       └── cadastrar/
│   │           └── page.tsx
│   │
│   ├── (auth)/                 # Autenticação
│   │   ├── layout.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── esqueci/
│   │   │   └── page.tsx
│   │   └── novasenha/
│   │       └── page.tsx
│   │
│   ├── (admin)/                # Painel Admin (nível 1)
│   │   ├── layout.tsx          # Protegido: middleware verifica level === 1
│   │   ├── administracao/
│   │   │   ├── inicio/
│   │   │   ├── estabelecimentos/
│   │   │   ├── planos/
│   │   │   ├── segmentos/
│   │   │   └── afiliados/
│   │   └── ...
│   │
│   ├── (afiliado)/             # Painel Afiliado (nível 3)
│   │   ├── layout.tsx          # Protegido: middleware verifica level === 3
│   │   └── afiliado/
│   │       ├── inicio/
│   │       ├── estabelecimentos/
│   │       ├── planos/
│   │       └── ...
│   │
│   ├── (painel)/               # Painel Estabelecimento (nível 2)
│   │   ├── layout.tsx          # Protegido: middleware verifica level === 2
│   │   └── painel/
│   │       ├── inicio/
│   │       ├── pedidos/
│   │       ├── produtos/
│   │       ├── categorias/
│   │       ├── plano/
│   │       ├── relatorio/
│   │       └── configuracoes/
│   │
│   ├── (loja)/                 # Loja Pública (subdomínio)
│   │   ├── layout.tsx
│   │   └── [subdominio]/
│   │       ├── page.tsx
│   │       ├── categoria/
│   │       │   └── [slug]/
│   │       ├── produto/
│   │       │   └── [id]/
│   │       ├── sacola/
│   │       ├── pedido/
│   │       └── obrigado/
│   │
│   ├── api/                    # API Routes
│   │   ├── auth/
│   │   │   └── [...nextauth]/   # Se usar NextAuth (opcional)
│   │   ├── pedidos/
│   │   │   └── route.ts
│   │   ├── produtos/
│   │   │   └── route.ts
│   │   ├── upload/
│   │   │   └── route.ts
│   │   └── webhooks/
│   │       ├── mercadopago/
│   │       ├── pagseguro/
│   │       └── pix/
│   │
│   ├── layout.tsx              # Root layout
│   ├── globals.css
│   └── error.tsx
│
├── components/
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   └── ...
│   │
│   ├── layout/                 # Layouts reutilizáveis
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── MobileNav.tsx
│   │
│   ├── forms/                  # Formulários
│   │   ├── LoginForm.tsx
│   │   ├── ProdutoForm.tsx
│   │   ├── CategoriaForm.tsx
│   │   └── PedidoForm.tsx
│   │
│   ├── loja/                   # Componentes da loja pública
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── CategoryNav.tsx
│   │   ├── ShoppingCart.tsx
│   │   ├── StoreHeader.tsx
│   │   └── StoreFooter.tsx
│   │
│   └── shared/                 # Componentes compartilhados
│       ├── Loading.tsx
│       ├── ErrorBoundary.tsx
│       ├── ImageUpload.tsx
│       └── WhatsAppButton.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server Components
│   │   └── admin.ts            # Admin operations (service role)
│   │
│   ├── utils/
│   │   ├── cn.ts               # Tailwind merge
│   │   ├── formatters.ts       # Formatters (currency, date, etc.)
│   │   ├── validators.ts       # Zod schemas
│   │   └── helpers.ts          # Funções utilitárias
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useStore.ts         # Zustand store
│   │   ├── useCart.ts          # Carrinho
│   │   └── useSubdomain.ts     # Detectar subdomínio
│   │
│   ├── server/
│   │   ├── actions/            # Server Actions
│   │   │   ├── produtos.ts
│   │   │   ├── pedidos.ts
│   │   │   ├── categorias.ts
│   │   │   └── auth.ts
│   │   └── queries/            # Database queries
│   │       ├── estabelecimentos.ts
│   │       ├── produtos.ts
│   │       └── pedidos.ts
│   │
│   └── constants/
│       ├── routes.ts
│       ├── permissions.ts
│       └── config.ts
│
├── types/
│   ├── database.ts             # Tipagens Supabase
│   ├── models.ts               # Interfaces de domínio
│   │   ├── user.ts
│   │   ├── estabelecimento.ts
│   │   ├── produto.ts
│   │   ├── pedido.ts
│   │   └── ...
│   └── api.ts                  # Tipagens de API
│
├── store/                      # Zustand stores
│   ├── cartStore.ts
│   ├── authStore.ts
│   └── uiStore.ts
│
├── public/
│   ├── uploads/                # Uploads de imagens
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                   # Service Worker
│   └── icons/
│
├── middleware.ts               # Auth + Subdomínio routing
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 2. Configurações

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    domains: ['localhost', 'ilinkbio.com.br'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: '(?<subdominio>[^.]+)\.ilinkbio\.com\.br',
            },
          ],
          destination: '/loja/:subdominio/:path*',
        },
      ],
    };
  },
};

module.exports = nextConfig;
```

### middleware.ts
```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas protegidas por nível
const PROTECTED_ROUTES = {
  '/administracao': 1,    // Admin
  '/painel': 2,           // Estabelecimento
  '/afiliado': 3,         // Afiliado
};

// Rotas públicas (não precisam de auth)
const PUBLIC_ROUTES = ['/', '/conheca', '/comece', '/login', '/esqueci', '/novasenha'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  
  // Detectar subdomínio
  const isSubdomain = hostname.includes('.ilinkbio.com.br') && 
                      !hostname.startsWith('www.') && 
                      hostname !== 'ilinkbio.com.br';
  
  if (isSubdomain) {
    const subdomain = hostname.split('.')[0];
    
    // Verificar se subdomínio existe no banco
    // Se não existir, redirecionar para 404
    
    // Reescrever URL para /loja/[subdominio]
    const url = request.nextUrl.clone();
    url.pathname = `/loja/${subdomain}${pathname}`;
    return NextResponse.rewrite(url);
  }
  
  // Verificar autenticação para rotas protegidas
  const isProtected = Object.keys(PROTECTED_ROUTES).some(route => 
    pathname.startsWith(route)
  );
  
  if (isProtected) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Verificar nível de acesso
    const userLevel = session.user.user_metadata.level;
    const requiredLevel = Object.entries(PROTECTED_ROUTES).find(([route]) => 
      pathname.startsWith(route)
    )?.[1];
    
    if (requiredLevel && userLevel !== requiredLevel) {
      // Redirecionar para página apropriada baseada no nível
      if (userLevel === 1) {
        return NextResponse.redirect(new URL('/administracao/inicio', request.url));
      } else if (userLevel === 2) {
        return NextResponse.redirect(new URL('/painel/inicio', request.url));
      } else if (userLevel === 3) {
        return NextResponse.redirect(new URL('/afiliado/inicio', request.url));
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};
```

## 3. Tipagens TypeScript

### types/models.ts
```typescript
// Enums
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

// Interfaces principais
export interface User {
  id: number;
  email: string;
  nome: string;
  nivel: UserLevel;
  telefone?: string;
  cidade?: number;
  estado?: number;
  created_at: string;
  last_login?: string;
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
  status: number;
  excluded: boolean;
  funcionamento: number;
  minimo_entrega_gratis?: number;
  taxa_delivery?: number;
  created_at: string;
  updated_at: string;
}

export interface Categoria {
  id: number;
  rel_estabelecimentos_id: number;
  nome: string;
  ordem: number;
  visible: boolean;
  status: number;
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
  status: number;
  last_modified: string;
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
  status: number;
  ordem: number;
}

export interface Assinatura {
  id: number;
  rel_planos_id: number;
  rel_estabelecimentos_id: number;
  afiliado?: number;
  nome: string;
  descricao?: string;
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
  status: number;
}
```

## 4. Server Actions

### lib/server/actions/produtos.ts
```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import { Produto } from '@/types/models';
import { produtoSchema } from '@/lib/utils/validators';

export async function criarProduto(data: Omit<Produto, 'id' | 'created_at'>) {
  const supabase = createServerClient();
  
  // Validar dados
  const validated = produtoSchema.parse(data);
  
  const { data: produto, error } = await supabase
    .from('produtos')
    .insert(validated)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Erro ao criar produto: ${error.message}`);
  }
  
  revalidatePath(`/painel/produtos`);
  return produto;
}

export async function atualizarProduto(id: number, data: Partial<Produto>) {
  const supabase = createServerClient();
  
  const { data: produto, error } = await supabase
    .from('produtos')
    .update({ ...data, last_modified: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Erro ao atualizar produto: ${error.message}`);
  }
  
  revalidatePath(`/painel/produtos`);
  return produto;
}

export async function deletarProduto(id: number) {
  const supabase = createServerClient();
  
  const { error } = await supabase
    .from('produtos')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(`Erro ao deletar produto: ${error.message}`);
  }
  
  revalidatePath(`/painel/produtos`);
}

export async function alternarVisibilidadeProduto(id: number, visible: boolean) {
  return atualizarProduto(id, { visible });
}

export async function alternarStatusProduto(id: number, status: number) {
  return atualizarProduto(id, { status });
}
```

## 5. Componentes

### components/ui/ (shadcn/ui)
Instalar via CLI:
```bash
npx shadcn add button input card dialog dropdown-menu table tabs badge avatar select textarea
```

### components/layout/Sidebar.tsx
```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

interface SidebarProps {
  items: {
    href: string;
    label: string;
    icon: React.ReactNode;
  }[];
}

export function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();
  
  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white">
      <nav className="p-4">
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  pathname === item.href
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
```

## 6. Stores (Zustand)

### store/cartStore.ts
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  produto_id: number;
  nome: string;
  valor: number;
  quantidade: number;
  imagem?: string;
}

interface CartStore {
  items: CartItem[];
  estabelecimentoId: number | null;
  addItem: (item: CartItem) => void;
  removeItem: (produto_id: number) => void;
  updateQuantity: (produto_id: number, quantidade: number) => void;
  clearCart: () => void;
  setEstabelecimentoId: (id: number) => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      estabelecimentoId: null,
      
      addItem: (item) => {
        const { items, estabelecimentoId } = get();
        
        // Verificar se é do mesmo estabelecimento
        if (estabelecimentoId && estabelecimentoId !== item.estabelecimento_id) {
          // Limpar carrinho se mudar de loja
          set({ items: [], estabelecimentoId: item.estabelecimento_id });
        }
        
        const existingItem = items.find((i) => i.produto_id === item.produto_id);
        
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.produto_id === item.produto_id
                ? { ...i, quantidade: i.quantidade + item.quantidade }
                : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },
      
      removeItem: (produto_id) => {
        set({ items: get().items.filter((i) => i.produto_id !== produto_id) });
      },
      
      updateQuantity: (produto_id, quantidade) => {
        if (quantidade <= 0) {
          get().removeItem(produto_id);
          return;
        }
        
        set({
          items: get().items.map((i) =>
            i.produto_id === produto_id ? { ...i, quantidade } : i
          ),
        });
      },
      
      clearCart: () => set({ items: [], estabelecimentoId: null }),
      
      setEstabelecimentoId: (id) => set({ estabelecimentoId: id }),
      
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.valor * item.quantidade, 0);
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantidade, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
```

## 7. Páginas

### app/(public)/page.tsx
```typescript
import { Metadata } from 'next';
import { Hero } from '@/components/public/Hero';
import { Features } from '@/components/public/Features';
import { Pricing } from '@/components/public/Pricing';

export const metadata: Metadata = {
  title: 'Catálogo Digital - ilinkbio',
  description: 'Crie seu catálogo digital e venda pelo WhatsApp',
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Features />
      <Pricing />
    </main>
  );
}
```

### app/(loja)/[subdominio]/page.tsx
```typescript
import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { EstabelecimentoHeader } from '@/components/loja/StoreHeader';
import { ProductGrid } from '@/components/loja/ProductGrid';
import { CategoryNav } from '@/components/loja/CategoryNav';

interface LojaPageProps {
  params: {
    subdominio: string;
  };
  searchParams: {
    categoria?: string;
    busca?: string;
  };
}

export async function generateMetadata({ params }: LojaPageProps) {
  const estabelecimento = await getEstabelecimentoBySubdominio(params.subdominio);
  
  if (!estabelecimento) {
    return { title: 'Loja não encontrada' };
  }
  
  return {
    title: estabelecimento.nome,
    description: estabelecimento.descricao,
  };
}

async function getEstabelecimentoBySubdominio(subdominio: string) {
  const supabase = createServerClient();
  
  const { data } = await supabase
    .from('estabelecimentos')
    .select('*')
    .eq('subdominio', subdominio)
    .eq('excluded', false)
    .single();
  
  return data;
}

async function getProdutos(estabelecimentoId: number, categoriaId?: string) {
  const supabase = createServerClient();
  
  let query = supabase
    .from('produtos')
    .select('*')
    .eq('rel_estabelecimentos_id', estabelecimentoId)
    .eq('visible', true)
    .eq('status', 1)
    .order('posicao', { ascending: true });
  
  if (categoriaId) {
    query = query.eq('rel_categorias_id', categoriaId);
  }
  
  const { data } = await query;
  return data || [];
}

async function getCategorias(estabelecimentoId: number) {
  const supabase = createServerClient();
  
  const { data } = await supabase
    .from('categorias')
    .select('*')
    .eq('rel_estabelecimentos_id', estabelecimentoId)
    .eq('visible', true)
    .order('ordem', { ascending: true });
  
  return data || [];
}

export default async function LojaPage({ params, searchParams }: LojaPageProps) {
  const estabelecimento = await getEstabelecimentoBySubdominio(params.subdominio);
  
  if (!estabelecimento) {
    notFound();
  }
  
  const [produtos, categorias] = await Promise.all([
    getProdutos(estabelecimento.id, searchParams.categoria),
    getCategorias(estabelecimento.id),
  ]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <EstabelecimentoHeader estabelecimento={estabelecimento} />
      <CategoryNav categorias={categorias} estabelecimentoSubdominio={params.subdominio} />
      <main className="container mx-auto px-4 py-8">
        <ProductGrid produtos={produtos} estabelecimento={estabelecimento} />
      </main>
    </div>
  );
}
```

## 8. Scripts de Setup

### setup.sh
```bash
#!/bin/bash

# Criar projeto Next.js
echo "Criando projeto Next.js..."
npx create-next-app@latest ilink-next --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"

cd ilink-next

# Instalar dependências
echo "Instalando dependências..."
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs zustand zod react-hook-form @hookform/resolvers lucide-react

# Instalar shadcn/ui
echo "Configurando shadcn/ui..."
npx shadcn@latest init -d

# Instalar componentes shadcn
echo "Instalando componentes..."
npx shadcn@latest add button input card dialog dropdown-menu table tabs badge avatar select textarea label sheet scroll-area separator skeleton

echo "Setup completo!"
```

## 9. Checklist de Migração

### Core
- [ ] Setup Next.js 14 + TypeScript
- [ ] Configurar Tailwind CSS
- [ ] Configurar shadcn/ui
- [ ] Configurar Supabase
- [ ] Criar tipagens TypeScript
- [ ] Configurar middleware de auth

### Autenticação
- [ ] Página de login
- [ ] Recuperação de senha
- [ ] Middleware de proteção de rotas
- [ ] Logout

### Páginas Públicas
- [ ] Landing page (/)
- [ ] Página "Conheça" (/conheca)
- [ ] Cadastro (/comece/cadastrar)

### Loja Pública
- [ ] Router de subdomínio
- [ ] Página da loja
- [ ] Categorias
- [ ] Produtos
- [ ] Carrinho (Zustand)
- [ ] Checkout
- [ ] Confirmação (obrigado)

### Painel Estabelecimento
- [ ] Dashboard
- [ ] Produtos (CRUD)
- [ ] Categorias (CRUD)
- [ ] Pedidos
- [ ] Relatórios
- [ ] Configurações
- [ ] Plano/Assinatura

### Painel Admin
- [ ] Dashboard
- [ ] Estabelecimentos
- [ ] Planos
- [ ] Segmentos
- [ ] Afiliados

### Painel Afiliado
- [ ] Dashboard
- [ ] Estabelecimentos vinculados
- [ ] Comissões

### Sistemas
- [ ] Upload de imagens
- [ ] Integração PIX
- [ ] Integração MercadoPago
- [ ] Integração PagSeguro
- [ ] Webhooks
- [ ] Notificações WhatsApp

### Polish
- [ ] SEO (metadata)
- [ ] PWA (manifest, sw)
- [ ] Error boundaries
- [ ] Loading states
- [ ] Responsividade
- [ ] Testes

## 10. Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Lint
npm run lint

# Adicionar componente shadcn
npx shadcn@latest add <componente>

# Gerar tipagens do Supabase
npx supabase gen types typescript --project-id <project-id> --schema public > types/database.ts
```
