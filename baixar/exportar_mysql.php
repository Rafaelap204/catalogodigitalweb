<?php
/**
 * Script para exportar dados do MySQL para JSON
 * Execute: php exportar_mysql.php
 */

// Configurações do banco MySQL
$db_host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "ilinkbio";

// Conectar ao MySQL
$db_con = mysqli_connect($db_host, $db_user, $db_pass, $db_name);

if (!$db_con) {
    die("Erro na conexão: " . mysqli_connect_error());
}

mysqli_set_charset($db_con, "utf8mb4");

echo "=== EXPORTAÇÃO MYSQL PARA SUPABASE ===\n\n";

// Tabelas para exportar (ordem importa por causa das FKs)
$tabelas = [
    'estados',
    'cidades',
    'segmentos',
    'planos',
    'users',
    'users_data',
    'estabelecimentos',
    'categorias',
    'produtos',
    'pedidos',
    'assinaturas',
    'banners',
    'cupons',
    'vouchers',
    'subdominios',
    'frete',
    'midia',
    'agendamentos',
    'pagamentos',
    'link',
    'logs'
];

$dados_exportados = [];
$total_geral = 0;

foreach ($tabelas as $tabela) {
    echo "Exportando tabela: $tabela ... ";
    
    $query = mysqli_query($db_con, "SELECT * FROM $tabela");
    
    if (!$query) {
        echo "ERRO: " . mysqli_error($db_con) . "\n";
        continue;
    }
    
    $dados_exportados[$tabela] = [];
    
    while ($row = mysqli_fetch_assoc($query)) {
        // Limpar dados
        foreach ($row as $key => $value) {
            if (is_string($value)) {
                $row[$key] = mb_convert_encoding($value, 'UTF-8', 'UTF-8');
            }
        }
        $dados_exportados[$tabela][] = $row;
    }
    
    $count = count($dados_exportados[$tabela]);
    $total_geral += $count;
    echo "✓ ($count registros)\n";
}

// Salvar em arquivo JSON
$arquivo_saida = 'dados_mysql_exportados.json';
file_put_contents(
    $arquivo_saida, 
    json_encode($dados_exportados, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
);

echo "\n====================================\n";
echo "✅ EXPORTAÇÃO CONCLUÍDA!\n";
echo "====================================\n";
echo "Total de tabelas: " . count($dados_exportados) . "\n";
echo "Total de registros: $total_geral\n";
echo "Arquivo gerado: $arquivo_saida\n";
echo "Tamanho: " . round(filesize($arquivo_saida) / 1024, 2) . " KB\n";
echo "====================================\n";

mysqli_close($db_con);
?>