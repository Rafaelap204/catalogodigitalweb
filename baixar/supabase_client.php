<?php
/**
 * Cliente PHP para Supabase
 * Substitui as funções mysqli_* por chamadas à API REST do Supabase
 * 
 * Uso:
 *   require_once 'supabase_client.php';
 *   $sb = new SupabaseClient($url, $key);
 *   
 *   // SELECT
 *   $estabelecimentos = $sb->select('estabelecimentos', ['status' => 'eq.1']);
 *   
 *   // INSERT
 *   $sb->insert('estabelecimentos', ['nome' => 'Loja Teste', 'subdominio' => 'teste']);
 *   
 *   // UPDATE
 *   $sb->update('estabelecimentos', 1, ['nome' => 'Novo Nome']);
 *   
 *   // DELETE
 *   $sb->delete('estabelecimentos', 1);
 */

class SupabaseClient {
    private $url;
    private $key;
    private $headers;
    
    /**
     * Construtor
     * 
     * @param string $url URL do projeto Supabase (ex: https://xxxx.supabase.co)
     * @param string $key Chave anon do Supabase
     */
    public function __construct($url, $key) {
        $this->url = rtrim($url, '/');
        $this->key = $key;
        $this->headers = [
            'apikey: ' . $key,
            'Authorization: Bearer ' . $key,
            'Content-Type: application/json'
        ];
    }
    
    /**
     * SELECT - Busca registros
     * 
     * @param string $table Nome da tabela
     * @param array $filters Filtros (ex: ['status' => 'eq.1', 'limit' => 10])
     * @return array Array de registros
     */
    public function select($table, $filters = []) {
        $url = "{$this->url}/rest/v1/{$table}";
        
        if (!empty($filters)) {
            $url .= '?' . http_build_query($filters);
        }
        
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => $this->headers
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200) {
            error_log("Supabase SELECT error: HTTP $httpCode - $response");
            return [];
        }
        
        return json_decode($response, true) ?: [];
    }
    
    /**
     * SELECT ONE - Busca um único registro por ID
     * 
     * @param string $table Nome da tabela
     * @param int $id ID do registro
     * @return array|null Registro ou null se não encontrado
     */
    public function selectById($table, $id) {
        $result = $this->select($table, ['id' => 'eq.' . $id, 'limit' => 1]);
        return $result[0] ?? null;
    }
    
    /**
     * SELECT BY SUBDOMINIO - Busca estabelecimento por subdominio
     * 
     * @param string $subdominio Subdominio a buscar
     * @return array|null Estabelecimento ou null
     */
    public function selectBySubdominio($subdominio) {
        $result = $this->select('estabelecimentos', [
            'subdominio' => 'eq.' . $subdominio,
            'limit' => 1
        ]);
        return $result[0] ?? null;
    }
    
    /**
     * SELECT RAW - Query com filtros customizados do PostgREST
     * 
     * @param string $table Nome da tabela
     * @param string $queryString Query string (ex: "status=eq.1&nome=like.*teste*")
     * @return array Array de registros
     */
    public function selectRaw($table, $queryString) {
        $url = "{$this->url}/rest/v1/{$table}?" . $queryString;
        
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => $this->headers
        ]);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        return json_decode($response, true) ?: [];
    }
    
    /**
     * INSERT - Insere novo registro
     * 
     * @param string $table Nome da tabela
     * @param array $data Dados a inserir
     * @return array|null Registro inserido ou null em caso de erro
     */
    public function insert($table, $data) {
        $url = "{$this->url}/rest/v1/{$table}";
        
        $headers = array_merge($this->headers, ['Prefer: return=representation']);
        
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($data),
            CURLOPT_HTTPHEADER => $headers
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 201) {
            error_log("Supabase INSERT error: HTTP $httpCode - $response");
            return null;
        }
        
        $result = json_decode($response, true);
        return $result[0] ?? null;
    }
    
    /**
     * UPDATE - Atualiza registro
     * 
     * @param string $table Nome da tabela
     * @param int $id ID do registro
     * @param array $data Dados a atualizar
     * @return array|null Registro atualizado ou null
     */
    public function update($table, $id, $data) {
        $url = "{$this->url}/rest/v1/{$table}?id=eq.{$id}";
        
        $headers = array_merge($this->headers, ['Prefer: return=representation']);
        
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => 'PATCH',
            CURLOPT_POSTFIELDS => json_encode($data),
            CURLOPT_HTTPHEADER => $headers
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200) {
            error_log("Supabase UPDATE error: HTTP $httpCode - $response");
            return null;
        }
        
        $result = json_decode($response, true);
        return $result[0] ?? null;
    }
    
    /**
     * UPDATE WHERE - Atualiza registros com condição
     * 
     * @param string $table Nome da tabela
     * @param string $column Coluna para filtro
     * @param mixed $value Valor para filtro
     * @param array $data Dados a atualizar
     * @return bool Sucesso ou falha
     */
    public function updateWhere($table, $column, $value, $data) {
        $url = "{$this->url}/rest/v1/{$table}?{$column}=eq.{$value}";
        
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => 'PATCH',
            CURLOPT_POSTFIELDS => json_encode($data),
            CURLOPT_HTTPHEADER => $this->headers
        ]);
        
        curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        return $httpCode === 200;
    }
    
    /**
     * DELETE - Remove registro
     * 
     * @param string $table Nome da tabela
     * @param int $id ID do registro
     * @return bool Sucesso ou falha
     */
    public function delete($table, $id) {
        $url = "{$this->url}/rest/v1/{$table}?id=eq.{$id}";
        
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => 'DELETE',
            CURLOPT_HTTPHEADER => $this->headers
        ]);
        
        curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        return $httpCode === 204;
    }
    
    /**
     * DELETE WHERE - Remove registros com condição
     * 
     * @param string $table Nome da tabela
     * @param string $column Coluna para filtro
     * @param mixed $value Valor para filtro
     * @return bool Sucesso ou falha
     */
    public function deleteWhere($table, $column, $value) {
        $url = "{$this->url}/rest/v1/{$table}?{$column}=eq.{$value}";
        
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => 'DELETE',
            CURLOPT_HTTPHEADER => $this->headers
        ]);
        
        curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        return $httpCode === 204;
    }
    
    /**
     * COUNT - Conta registros
     * 
     * @param string $table Nome da tabela
     * @param array $filters Filtros opcionais
     * @return int Número de registros
     */
    public function count($table, $filters = []) {
        $url = "{$this->url}/rest/v1/{$table}?select=count";
        
        if (!empty($filters)) {
            $url .= '&' . http_build_query($filters);
        }
        
        $headers = array_merge($this->headers, ['Prefer: count=exact']);
        
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => $headers
        ]);
        
        curl_exec($ch);
        $count = curl_getinfo($ch, CURLINFO_HEADER_OUT);
        curl_close($ch);
        
        // Extrair count do header Content-Range
        return 0; // Implementar parsing do header se necessário
    }
    
    /**
     * RPC - Chama função PostgreSQL
     * 
     * @param string $function Nome da função
     * @param array $params Parâmetros da função
     * @return mixed Resultado da função
     */
    public function rpc($function, $params = []) {
        $url = "{$this->url}/rest/v1/rpc/{$function}";
        
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($params),
            CURLOPT_HTTPHEADER => $this->headers
        ]);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        return json_decode($response, true);
    }
}

/**
 * Funções auxiliares para compatibilidade com código antigo
 * Substitui mysqli_* por chamadas ao Supabase
 */

// Função global para acesso fácil
function sb() {
    global $supabase_client;
    return $supabase_client;
}

// Substitui mysqli_query simples
function sb_query($table, $filters = []) {
    return sb()->select($table, $filters);
}

// Substitui mysqli_fetch_array
function sb_fetch($result) {
    if (is_array($result) && !empty($result)) {
        return array_shift($result);
    }
    return null;
}

// Substitui mysqli_num_rows
function sb_count($result) {
    return is_array($result) ? count($result) : 0;
}
?>