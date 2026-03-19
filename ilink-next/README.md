# Catálogo Digital Web - Next.js 14 Migration

Catálogo digital multi-tenant migrado de PHP para Next.js 14 + TypeScript + Supabase.

## 🚀 Configuração do Supabase Self-Hosted (EasyPanel)

Como o Supabase está hospedado na sua VPS via EasyPanel, a configuração é diferente do Supabase Cloud.

### 1. Obter Credenciais do EasyPanel

Acesse seu EasyPanel e localize o serviço Supabase. Você precisará de:

- **URL do Supabase**: `https://supabase.seudominio.com` (ou o URL que o EasyPanel forneceu)
- **Anon Key**: A chave pública encontrada nas variáveis de ambiente do serviço

### 2. Configurar Variáveis de Ambiente

Edite o arquivo `.env.local`:

```env
# URL do seu Supabase self-hosted (do EasyPanel)
NEXT_PUBLIC_SUPABASE_URL=https://supabase.seudominio.com

# Anon Key do Supabase (encontrado no EasyPanel)
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui

# Opcional: Service Role Key (apenas para server-side)
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key

# URL da aplicação
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DOMAIN=catalogodigitalweb.com.br
```

### 3. Configuração do CORS (Importante!)

No seu EasyPanel, acesse o serviço Supabase e adicione as seguintes variáveis de ambiente:

```env
CORS_ORIGIN=*
# ou
CORS_ORIGIN=https://seu-dominio.com,https://www.seu-dominio.com
```

### 4. Configuração do Auth

No painel do Supabase (Studio), vá em:
- **Authentication** > **URL Configuration**
- Adicione os URLs de redirecionamento:
  - `http://localhost:3000/auth/callback` (desenvolvimento)
  - `https://seu-dominio.com/auth/callback` (produção)

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

## 🗄️ Estrutura do Banco de Dados

O schema do banco está definido em `baixar/schema_supabase.sql`. Execute as migrations SQL no seu Supabase self-hosted.

## 🌐 Deploy

### Opção 1: Vercel (Recomendado)

```bash
npm i -g vercel
vercel --prod
```

Configure as variáveis de ambiente no painel da Vercel.

### Opção 2: EasyPanel (Self-hosted)

1. Crie um novo serviço Node.js no EasyPanel
2. Configure o build command: `npm run build`
3. Configure o start command: `npm start`
4. Adicione as variáveis de ambiente

## 🔧 Solução de Problemas

### Erro de CORS
Se você receber erros de CORS, verifique se a variável `CORS_ORIGIN` está configurada corretamente no EasyPanel.

### Erro de Auth
Certifique-se de que as URLs de redirecionamento do Auth estão configuradas no Supabase Studio.

### Erro 500 no Server Actions
Verifique se a `SUPABASE_SERVICE_ROLE_KEY` está configurada corretamente.

## 📚 Documentação

- [Next.js 14](https://nextjs.org/docs)
- [Supabase Self-Hosted](https://supabase.com/docs/guides/self-hosting)
- [EasyPanel Docs](https://easypanel.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📝 Licença

Projeto privado - Catálogo Digital Web
