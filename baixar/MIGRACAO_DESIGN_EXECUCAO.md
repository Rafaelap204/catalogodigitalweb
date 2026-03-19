# Execução da Migração do Design

## Resumo do Trabalho
Migrar o design completo do PHP para Next.js é um trabalho extenso que envolve:

1. **Copiar assets** (CSS, JS, imagens, fontes)
2. **Criar layouts** compatíveis
3. **Migrar cada página** PHP para React

## Estrutura de Pastas PHP
```
public_html/
├── index.php                 → app/(public)/page.tsx
├── login/                    → app/(auth)/login/page.tsx
├── administracao/            → app/(admin)/administracao/
├── painel/                   → app/(painel)/painel/
├── afiliado/                 → app/(afiliado)/afiliado/
├── comece/                   → app/(public)/comece/
├── conheca/                  → app/(public)/conheca/
├── esqueci/                  → app/(auth)/esqueci/
├── novasenha/                → app/(auth)/novasenha/
└── _core/_cdn/               → public/_core/_cdn/
```

## Assets a Copiar

### CSS Principais:
- `_core/_cdn/panel/css/template.css`
- `_core/_cdn/panel/css/forms.css`
- `_core/_cdn/panel/css/theme.css`
- `_core/_cdn/bootstrap/css/bootstrap.min.css`
- `_core/_cdn/lineicons/css/LineIcons.min.css`

### JS Principais:
- `_core/_cdn/jquery/js/jquery.min.js`
- `_core/_cdn/bootstrap/js/bootstrap.min.js`
- `_core/_cdn/panel/js/template.js`

### Imagens/Fontes:
- `_core/_cdn/img/`
- `_core/_cdn/fonts/`
- `_core/_cdn/lineicons/fonts/`

## Etapas de Execução

### Etapa 1: Copiar Assets (30 min)
- Copiar pasta `_cdn` para `ilink-next/public/`

### Etapa 2: Criar Layout Base (1 hora)
- Criar `app/layout.tsx` com head, CSS e scripts

### Etapa 3: Migrar Páginas Principais (3-4 horas)
- Login
- Dashboard Admin
- Dashboard Painel
- Home

### Etapa 4: Testar e Ajustar (1-2 horas)
- Verificar se tudo funciona
- Ajustar links e rotas

## Tempo Total Estimado
**6-8 horas de trabalho**

---

## ⚠️ IMPORTANTE

Esta é uma tarefa grande que deve ser feita em modo **Code** (não Architect).

Preciso:
1. Mudar para modo Code
2. Executar a cópia de arquivos
3. Criar layouts e páginas
4. Testar tudo

**Recomendação:** Fazer em partes, começando pelas páginas mais importantes.
