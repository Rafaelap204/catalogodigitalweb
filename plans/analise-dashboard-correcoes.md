# Análise Técnica e Plano de Correções - Dashboard Administrativo

## Data da Análise
17 de Março de 2026

## Resumo Executivo

Análise técnica completa do dashboard administrativo do Catálogo Digital Web identificou 5 problemas críticos de interface e funcionalidade que afetam a experiência do usuário, acessibilidade e manutenibilidade do código.

---

## 1. Problemas Identificados

### 1.1 Textos Ilegíveis e Tipografia Inadequada

**Arquivos afetados:**
- `Sidebar.tsx` - Navegação lateral
- `DataTable.tsx` - Tabela de dados com cabeçalhos truncados

**Problemas observados:**
- Tamanho de fonte inconsistente entre elementos de navegação
- Contraste insuficiente em modo escuro (texto cinza sobre fundo escuro)
- Hierarquia visual confusa entre headings e body text
- Segunda imagem mostra cabeçalhos de tabela truncados ("Cliente ↑↓", "Loja ↑↓", etc.)

**Impacto:** Baixa legibilidade, dificuldade de navegação, não conformidade com WCAG 2.1 AA

### 1.2 Inconsistências de Design no Header

**Arquivos afetados:**
- `Header.tsx` - Cabeçalho administrativo

**Problemas observados:**
- Ausência da logo da marca no header
- Spacing inconsistente entre elementos de ação
- Fundo com transparência pode causar problemas de legibilidade
- Cores não totalmente alinhadas com a paleta oficial

**Impacto:** Identidade visual fragmentada, percepção de baixa qualidade

### 1.3 Ausência da Logo da Marca

**Arquivos afetados:**
- `Sidebar.tsx` - Usa placeholder "CD" em vez da logo real
- `Header.tsx` - Não possui logo

**Problemas observados:**
- Logo atual é um placeholder textual ("CD")
- Não há fallback para carregamento da imagem
- Não há suporte a lazy loading

**Impacto:** Identidade da marca comprometida

### 1.4 Dados Mockados nos Widgets

**Arquivos afetados:**
- `MetricCards.tsx` - Dados estáticos em `defaultMetrics`
- `ChartsSection.tsx` - Dados de exemplo em `salesData`, `ordersData`, `usersData`
- `page.tsx` (admin/inicio) - Dados mockados em `recentOrders`

**Problemas observados:**
- Valores hardcoded (2,543 usuários, R$ 12.450, etc.)
- Gráficos usam dados estáticos de demonstração
- Tabela de pedidos recentes usa dados fictícios

**Impacto:** Sistema não reflete estado real, dados enganosos para administradores

### 1.5 Bugs Visuais na Sidebar

**Arquivos afetados:**
- `Sidebar.tsx` - Componente de navegação lateral
- `use-sidebar.tsx` - Hook de estado

**Problemas observados:**
- Estados ativos/inativos podem ter contraste insuficiente
- Ícones podem ficar desalinhados quando sidebar está colapsada
- Comportamento responsivo em mobile (breakpoint md:768px) precisa de ajustes
- Tooltips podem ter delay inadequado

**Impacto:** Navegação confusa, experiência inconsistente entre dispositivos

---

## 2. Design System - Especificações Oficiais

### Paleta de Cores
```
--primary: #22C55E (Verde Neon)
--primary-dark: #16A34A
--dark: #1A1A1A (Preto Profundo)
--gray-100: #F3F4F6
--gray-700: #374151
```

### Escala Tipográfica
```
--font-size-xs: 12px (apenas para labels secundários)
--font-size-sm: 14px (mínimo para texto legível)
--font-size-base: 16px (body text)
--font-size-lg: 18px (subtítulos)
--font-size-xl: 24px (títulos de seção)
--font-size-2xl: 32px (headlines)
```

### Espaçamento
```
--spacing-base: 24px (entre elementos principais)
--spacing-sm: 12px (entre elementos relacionados)
--spacing-xs: 8px (padding interno)
```

### Critérios WCAG 2.1 AA
- Contraste mínimo 4.5:1 para textos normais
- Contraste mínimo 3:1 para textos grandes (18px+)
- Navegação por teclado funcional em todos os elementos interativos
- Estados de foco visíveis

---

## 3. Plano de Correções

### Fase 1: Fundação (Variáveis CSS e Componente Logo)

#### 3.1.1 Atualizar `globals.css`
- Adicionar variáveis CSS customizadas
- Garantir contraste adequado em modo escuro
- Adicionar classes utilitárias para acessibilidade

#### 3.1.2 Criar `Logo.tsx`
- Componente com lazy loading otimizado (next/image)
- Fallback para SVG quando imagem não carrega
- Suporte a diferentes tamanhos (sm, md, lg)
- Props: `size`, `collapsed`, `className`

### Fase 2: Correções de Layout (Sidebar e Header)

#### 3.2.1 Atualizar `Sidebar.tsx`
- Corrigir tamanhos de fonte (mínimo 14px)
- Melhorar contraste dos estados ativos/inativos
- Ajustar alinhamento de ícones
- Adicionar integração com componente Logo
- Melhorar responsividade mobile

#### 3.2.2 Atualizar `Header.tsx`
- Adicionar componente Logo
- Ajustar spacing para 24px entre elementos
- Integrar paleta de cores oficial
- Melhorar alinhamento vertical

### Fase 3: Correção de Dados (Widgets e Tabelas)

#### 3.3.1 Atualizar `MetricCards.tsx`
- Substituir `defaultMetrics` por estrutura de dados real
- Adicionar prop `data` para receber métricas da API
- Manter estados de loading com Skeleton
- Adicionar indicadores visuais quando dados não disponíveis

#### 3.3.2 Atualizar `ChartsSection.tsx`
- Substituir dados mockados por estrutura real
- Adicionar props para receber dados dos gráficos
- Manter estados de loading
- Adicionar mensagens educativas quando sem dados

#### 3.3.3 Atualizar `DataTable.tsx`
- Corrigir layout dos cabeçalhos (evitar truncamento)
- Ajustar altura mínima das células
- Melhorar contraste das linhas alternadas
- Garantir navegação por teclado

#### 3.3.4 Atualizar `page.tsx` (admin/inicio)
- Integrar chamadas a API para dados reais
- Adicionar estado de loading global
- Substituir dados mockados por estrutura dinâmica

### Fase 4: Testes e Validação

- Verificar contraste em modo claro e escuro
- Testar navegação por teclado
- Validar responsividade em diferentes breakpoints
- Verificar carregamento otimizado da logo

---

## 4. Arquitetura dos Componentes Corrigidos

### 4.1 Componente Logo
```
interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  collapsed?: boolean
  className?: string
  showText?: boolean
}
```

### 4.2 Estrutura de Dados - Métricas
```typescript
interface DashboardMetrics {
  totalUsers: number
  totalStores: number
  todayOrders: number
  monthlyRevenue: number
  trends: {
    users: { value: number; isPositive: boolean }
    stores: { value: number; isPositive: boolean }
    orders: { value: number; isPositive: boolean }
    revenue: { value: number; isPositive: boolean }
  }
}
```

### 4.3 Estrutura de Dados - Gráficos
```typescript
interface ChartData {
  sales: Array<{ name: string; value: number }>
  orders: Array<{ name: string; value: number }>
  users: Array<{ name: string; value: number }>
}
```

---

## 5. Dependências

- Next.js Image (para lazy loading da logo)
- Framer Motion (animações já em uso)
- Tailwind CSS (estilização)
- Lucide React (ícones)

---

## 6. Notas de Implementação

1. **Lazy Loading da Logo:** Usar `next/image` com `priority` para logo acima do fold
2. **Fallback SVG:** Criar SVG inline que replica a identidade visual quando imagem falha
3. **Acessibilidade:** Adicionar `aria-label` e `aria-current` para navegação
4. **Responsividade:** Usar breakpoint `md:` (768px) para comportamento mobile
5. **Estados Vazios:** Quando não houver dados, mostrar mensagem educativa ao invés de zeros

---

## 7. Lista de Arquivos a Serem Modificados

1. `ilink-next/app/globals.css` - Variáveis CSS e acessibilidade
2. `ilink-next/components/admin/Logo.tsx` - Novo componente
3. `ilink-next/components/admin/Sidebar.tsx` - Tipografia e layout
4. `ilink-next/components/admin/Header.tsx` - Logo e spacing
5. `ilink-next/components/admin/MetricCards.tsx` - Dados reais
6. `ilink-next/components/admin/ChartsSection.tsx` - Dados reais
7. `ilink-next/components/admin/DataTable.tsx` - Layout da tabela
8. `ilink-next/app/(admin)/administracao/inicio/page.tsx` - Integração de dados
9. `ilink-next/components/admin/index.ts` - Exportar Logo

---

## Conclusão

As correções propostas resolverão todos os problemas identificados, garantindo:
- ✅ Tipografia legível e hierárquica
- ✅ Design consistente com a identidade visual
- ✅ Logo da marca presente em todos os pontos necessários
- ✅ Dados reais ou estados educativos claros
- ✅ Sidebar responsiva e acessível
- ✅ Conformidade com WCAG 2.1 AA
