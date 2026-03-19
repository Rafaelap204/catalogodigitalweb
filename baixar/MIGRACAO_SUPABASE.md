# 🚀 Migração MySQL → Supabase

Este guia explica como migrar os dados do seu projeto PHP/MySQL para o Supabase.

## 📁 Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| `exportar_mysql.php` | Exporta dados do MySQL para JSON |
| `importar_supabase.py` | Importa dados do JSON para o Supabase |
| `schema_supabase.sql` | Cria as tabelas no Supabase |
| `supabase_client.php` | Cliente PHP para conectar no Supabase |

---

## 📋 Passo a Passo

### **1. Criar Projeto no Supabase**

1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em **"New Project"**
3. Configure:
   - **Name**: `ilinkbio` (ou nome que preferir)
   - **Database Password**: crie uma senha forte
   - **Region**: `South America (São Paulo)`
4. Aguarde a criação (1-2 minutos)
5. Vá em **Project Settings → API** e anote:
   - `URL`: `https://xxxxxx.supabase.co`
   - `anon key`: `eyJhbG...` (começa com eyJ)

---

### **2. Criar Tabelas no Supabase**

1. No dashboard do Supabase, clique em **"SQL Editor"**
2. Clique em **"New query"**
3. Abra o arquivo `schema_supabase.sql` e copie todo o conteúdo
4. Cole no SQL Editor e clique em **"Run"**
5. Pronto! Todas as tabelas serão criadas

---

### **3. Configurar Dados de Conexão**

#### No arquivo `exportar_mysql.php`:

Edite as configurações do seu banco MySQL:

```php
$db_host = "localhost";
$db_user = "SEU_USUARIO_MYSQL";
$db_pass = "SUA_SENHA_MYSQL";
$db_name = "NOME_DO_BANCO";
```

#### No arquivo `importar_supabase.py`:

Edite com os dados do seu projeto Supabase:

```python
SUPABASE_URL = "https://SEU-PROJETO.supabase.co"
SUPABASE_KEY = "sua-anon-key-aqui"
```

---

### **4. Exportar Dados do MySQL**

Na VPS ou servidor local, execute:

```bash
# Vá para a pasta do projeto
cd /caminho/do/projeto

# Execute o script PHP
php exportar_mysql.php
```

Se tudo der certo, você verá:
```
=== EXPORTAÇÃO MYSQL PARA SUPABASE ===

Exportando tabela: estados ... ✓ (27 registros)
Exportando tabela: cidades ... ✓ (5570 registros)
...
✅ EXPORTAÇÃO CONCLUÍDA!
Arquivo gerado: dados_mysql_exportados.json
```

---

### **5. Importar Dados no Supabase**

```bash
# Instale o Python e requests (se não tiver)
# Ubuntu/Debian:
sudo apt-get install python3 python3-pip
pip3 install requests

# Execute o script Python
python3 importar_supabase.py
```

Você verá o progresso da importação:
```
🚀 IMPORTAÇÃO MYSQL → SUPABASE

📂 Arquivo carregado: dados_mysql_exportados.json

📦 estados
   Total: 27 registros
   ✓ 27/27
   ✅ Concluído: 27 inseridos, 0 erros

📊 RESUMO DA MIGRAÇÃO
Tabela            |   Total |    ✓ OK | ✗ Erro
--------------------------------------------------
estados           |      27 |      27 |      0
...
Total geral: XXXX registros migrados
```

---

### **6. Configurar PHP para Usar Supabase**

No seu `config.php` ou arquivo de configuração, adicione:

```php
<?php
// Configurações do Supabase
$supabase_url = 'https://SEU-PROJETO.supabase.co';
$supabase_key = 'sua-anon-key-aqui';

// Incluir cliente
require_once('supabase_client.php');

// Criar instância global
$supabase_client = new SupabaseClient($supabase_url, $supabase_key);
$sb = $supabase_client; // Alias curto
?>
```

---

### **7. Como Substituir Código MySQL por Supabase**

#### **ANTES (MySQL):**
```php
$query = mysqli_query($db_con, "SELECT * FROM estabelecimentos WHERE subdominio = '$sub' LIMIT 1");
$data = mysqli_fetch_array($query);
```

#### **DEPOIS (Supabase):**
```php
$data = $sb->selectBySubdominio($sub);
```

---

#### **ANTES (MySQL - Lista):**
```php
$query = mysqli_query($db_con, "SELECT * FROM produtos WHERE rel_estabelecimentos_id = '$eid' AND status = '1'");
while ($produto = mysqli_fetch_array($query)) {
    echo $produto['nome'];
}
```

#### **DEPOIS (Supabase):**
```php
$produtos = $sb->select('produtos', [
    'rel_estabelecimentos_id' => 'eq.' . $eid,
    'status' => 'eq.1'
]);

foreach ($produtos as $produto) {
    echo $produto['nome'];
}
```

---

#### **ANTES (MySQL - INSERT):**
```php
mysqli_query($db_con, "INSERT INTO categorias (rel_estabelecimentos_id, nome) VALUES ('$eid', '$nome')");
```

#### **DEPOIS (Supabase):**
```php
$sb->insert('categorias', [
    'rel_estabelecimentos_id' => $eid,
    'nome' => $nome
]);
```

---

#### **ANTES (MySQL - UPDATE):**
```php
mysqli_query($db_con, "UPDATE estabelecimentos SET nome = '$nome' WHERE id = '$id'");
```

#### **DEPOIS (Supabase):**
```php
$sb->update('estabelecimentos', $id, ['nome' => $nome]);
```

---

#### **ANTES (MySQL - DELETE):**
```php
mysqli_query($db_con, "DELETE FROM produtos WHERE id = '$id'");
```

#### **DEPOIS (Supabase):**
```php
$sb->delete('produtos', $id);
```

---

## 🔧 Dicas Importantes

### **Filtros Avançados**

```php
// Igual
$sb->select('produtos', ['status' => 'eq.1']);

// Diferente
$sb->select('produtos', ['status' => 'neq.0']);

// Maior que
$sb->select('produtos', ['valor' => 'gt.100']);

// Menor que
$sb->select('produtos', ['valor' => 'lt.500']);

// Like (contém)
$sb->select('produtos', ['nome' => 'like.*iphone*']);

// Ordenar
$sb->select('produtos', ['order' => 'nome.asc']);

// Limite
$sb->select('produtos', ['limit' => 10]);

// Combinar filtros
$sb->select('produtos', [
    'rel_estabelecimentos_id' => 'eq.' . $eid,
    'status' => 'eq.1',
    'order' => 'nome.asc',
    'limit' => 20
]);
```

---

## ⚠️ Problemas Comuns

### **Erro: "Could not resolve host"**
- Verifique se o URL do Supabase está correto
- Verifique conexão de internet

### **Erro: "401 Unauthorized"**
- Verifique se a anon key está correta
- Verifique se a key não expirou

### **Erro: "23505: duplicate key value"**
- Dados já existem na tabela
- Limpe a tabela antes de importar novamente

### **Erro: "23503: foreign key violation"**
- Tabela referenciada não tem o registro
- Importe as tabelas na ordem correta

---

## ✅ Verificação

Após a migração, verifique no Supabase:

1. Vá em **"Table Editor"**
2. Clique em cada tabela
3. Verifique se os dados apareceram

Ou execute no SQL Editor:
```sql
SELECT 'estados' as tabela, COUNT(*) as total FROM estados
UNION ALL SELECT 'cidades', COUNT(*) FROM cidades
UNION ALL SELECT 'estabelecimentos', COUNT(*) FROM estabelecimentos
UNION ALL SELECT 'produtos', COUNT(*) FROM produtos
UNION ALL SELECT 'pedidos', COUNT(*) FROM pedidos;
```

---

## 📞 Suporte

- Documentação Supabase: https://supabase.com/docs
- API REST: https://supabase.com/docs/reference/javascript
- Comunidade: https://github.com/supabase/supabase/discussions