# 🔧 Troubleshooting - Erro API no Supabase Auth

O erro "API error happened while trying to communicate with the server" indica que o painel do Supabase não consegue se comunicar com o serviço de autenticação (GoTrue).

## 🚨 Causas Comuns

1. **GoTrue não está rodando** (mais comum)
2. **Porta incorreta ou bloqueada**
3. **Configuração incorreta das variáveis de ambiente**
4. **Problema de rede entre containers**

---

## 🔍 Passos para Diagnosticar

### 1. Verificar se os containers estão rodando

```bash
# Liste todos os containers
docker ps

# Procque por containers relacionados ao GoTrue ou auth
docker ps | grep -i gotrue
docker ps | grep -i auth
```

### 2. Verificar logs do GoTrue

```bash
# Substitua "supabase-gotrue" pelo nome real do container
docker logs supabase-gotrue

# Ou se estiver usando docker-compose
docker-compose logs gotrue
```

### 3. Testar a API diretamente

```bash
# Substitua localhost:9999 pela URL correta do seu GoTrue
curl -X GET http://localhost:9999/health

# Deve retornar: {"version":"x.x.x"}
```

### 4. Verificar variáveis de ambiente no painel

No painel do Supabase Studio:
1. Vá em **Project Settings** → **API**
2. Verifique se a URL do **Auth** está correta
3. Verifique se a chave `service_role` está configurada

---

## 🛠️ Soluções

### Opção 1: Reiniciar o GoTrue

```bash
# Encontre o nome do container
docker ps

# Reinicie o container GoTrue
docker restart supabase-gotrue

# Ou reinicie todos os serviços
docker-compose restart
```

### Opção 2: Verificar configuração do docker-compose

No arquivo `docker-compose.yml`, verifique se o serviço `auth` (ou `gotrue`) está configurado:

```yaml
auth:
  image: supabase/gotrue:v2.x.x
  environment:
    - GOTRUE_SITE_URL=http://localhost:3000
    - GOTRUE_EXTERNAL_EMAIL_ENABLED=true
    - GOTRUE_MAILER_AUTOCONFIRM=true  # Para desenvolvimento
    # ... outras variáveis
  ports:
    - "9999:9999"
```

### Opção 3: Recriar os containers

```bash
# Pare todos os containers
docker-compose down

# Remova volumes (CUIDADO: isso apaga dados!)
docker-compose down -v

# Suba novamente
docker-compose up -d
```

### Opção 4: Configuração manual do Studio

Se o GoTrue não estiver disponível, você pode configurar o Supabase Studio para usar uma URL diferente:

1. Edite o arquivo `.env` do Supabase:
```env
SUPABASE_URL=http://localhost:8000
SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

2. Verifique o arquivo `kong.yml` (API Gateway):
```yaml
# Em services, deve haver uma rota para o GoTrue
- name: auth-v1
  url: http://auth:9999/
  routes:
    - name: auth-v1-all
      paths:
        - /auth/v1/
```

---

## 🔄 Solução Alternativa (Recomendada)

Se você não conseguir resolver o GoTrue agora, **modifique o código para usar autenticação customizada** com a tabela `public.users` que já existe:

1. Crie uma API de login que verifica o hash MD5
2. Use sessões do Next.js para manter o estado
3. Funciona imediatamente sem depender do GoTrue

**Quer que eu implemente essa solução alternativa?**

---

## 📋 Comandos Úteis

```bash
# Ver todos os logs
docker-compose logs -f

# Ver logs apenas do auth
docker-compose logs -f auth

# Entrar no container do banco
docker exec -it supabase-db psql -U postgres

# Verificar se a tabela auth.users existe
\dt auth.*

# Listar usuários diretamente no banco
SELECT * FROM auth.users;
```

---

## ❓ Próximos Passos

1. **Execute os comandos de diagnóstico acima**
2. **Me envie os logs do GoTrue** se houver erros
3. **Ou me diga se quer a solução alternativa** (autenticação customizada)

Qual informação você consegue me passar sobre a sua instalação do Supabase?
- Está usando Docker?
- Qual a URL de acesso ao painel?
- Consegue acessar o banco normalmente?
