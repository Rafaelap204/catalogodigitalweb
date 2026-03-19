<?php
session_start();

// Token fixo do Melhor Envio (alterar aqui se quiser trocar o token)
define('ME_TOKEN', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNzJlZGNmYTQxY2NjNTVjZmQyY2YwYzljYzc1OGE3MDhmYmY0NmE3YzllYTMzNmRmMmQyMWM3N2Y1N2I3ZDMxMzgxMGI5MDQxNDQ1MzkzMDEiLCJpYXQiOjE3NDgzNzI2MzcuNTM5NDg3LCJuYmYiOjE3NDgzNzI2MzcuNTM5NDg4LCJleHAiOjE3Nzk5MDg2MzcuNTIzMzE1LCJzdWIiOiI5ZWYzMjAwYi1mNTdkLTQ3ZTYtODJkNS1lM2RmZmFlNzZmMzMiLCJzY29wZXMiOlsiY2FydC1yZWFkIiwiY2FydC13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiY29tcGFuaWVzLXdyaXRlIiwiY291cG9ucy1yZWFkIiwiY291cG9ucy13cml0ZSIsIm5vdGlmaWNhdGlvbnMtcmVhZCIsIm9yZGVycy1yZWFkIiwicHJvZHVjdHMtcmVhZCIsInByb2R1Y3RzLWRlc3Ryb3kiLCJwcm9kdWN0cy13cml0ZSIsInB1cmNoYXNlcy1yZWFkIiwic2hpcHBpbmctY2FsY3VsYXRlIiwic2hpcHBpbmctY2FuY2VsIiwic2hpcHBpbmctY2hlY2tvdXQiLCJzaGlwcGluZy1jb21wYW5pZXMiLCJzaGlwcGluZy1nZW5lcmF0ZSIsInNoaXBwaW5nLXByZXZpZXciLCJzaGlwcGluZy1wcmludCIsInNoaXBwaW5nLXNoYXJlIiwic2hpcHBpbmctdHJhY2tpbmciLCJlY29tbWVyY2Utc2hpcHBpbmciLCJ0cmFuc2FjdGlvbnMtcmVhZCIsInVzZXJzLXJlYWQiLCJ1c2Vycy13cml0ZSIsIndlYmhvb2tzLXJlYWQiLCJ3ZWJob29rcy13cml0ZSIsIndlYmhvb2tzLWRlbGV0ZSIsInRkZWFsZXItd2ViaG9vayJdfQ.MLKdXqrAcFN7BYZcF6bLEkZ3QspnFTXjG5NkrXQs0atUJ4XRaDfdUmlkYI_b646jAOtrQnHqMLgsGxnLSEfLguFlPpbLxNEiON6N9WnQWE55U9llGBuy80FQb5fWnRdWhIEp0zbuC-FMGLqArtsE773CVW8DEfuwJ96kKGJ03TDLa5g27O6KZzcehTB4zIuIE7tBE7RWivgzNR2ZRXD3gioteLq4UjYPuMoeSDlf8WbPXTBJxp2FRPHkEL1MY6mZl1-4I2jwu70OYyNLUkfiYNhrml1wy_CvZVFoxE9UNY9zzDGu33rE_j9jz-SyFWixoOKtM7M5-FbxXO8Um6WmXs9g5UreZ7--vKBb_V42LpchjNu0Bf2HHb4ygGxRHGqBioTd8YZdqT_AfKNpuK9_yE8PaCdebv5OyTA4DbhFE3ITobb4J7qZMgm3uUCMJ-2t7TzaCjCDGbsjDdC5eFIiKvTGnfJp8q1uzwiw97owjN1m8HrC40FM43aG8f0tsnFjiVxSl5prCE23EMDDZR5joefzG_BeB6lxT8w4H4EZBQ0VK40hb-Wda6vc2YsyJRS8BxMQ-agmZ3MFWRgFQCdh2C2VUnhKk5bSKMFWqu9Ii25hDMiOMizdCr6z8dgJScUZ_JCA_KOUqP1U0DhaMoYUVCLsPQanWygRqfO3SzDTYNY');

// Funções da API Melhor Envio
function melhorenvio_request($url, $data) {
    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_HTTPHEADER => [
            "Content-Type: application/json",
            "Authorization: Bearer " . ME_TOKEN
        ],
    ]);
    $response = curl_exec($curl);
    if (curl_errno($curl)) {
        $error_msg = curl_error($curl);
    }
    curl_close($curl);
    if (isset($error_msg)) {
        return ['error' => $error_msg];
    }
    return json_decode($response, true);
}

function calcularFrete($post) {
    return melhorenvio_request("https://www.melhorenvio.com.br/api/v2/me/shipment/calculate", $post);
}

function criarEtiqueta($dados) {
    return melhorenvio_request("https://www.melhorenvio.com.br/api/v2/me/shipment", $dados);
}

function aprovarEtiqueta($shipment_id) {
    return melhorenvio_request("https://www.melhorenvio.com.br/api/v2/me/shipment/checkout", ["shipments" => [$shipment_id]]);
}

// Função para salvar histórico simples (arquivo JSON)
function salvarHistorico($dados) {
    $arquivo = _DIR_ . '/historico_envios.json';
    $historico = [];
    if (file_exists($arquivo)) {
        $conteudo = file_get_contents($arquivo);
        $historico = json_decode($conteudo, true) ?: [];
    }
    $historico[] = $dados;
    file_put_contents($arquivo, json_encode($historico, JSON_PRETTY_PRINT));
}

// Função para obter histórico
function obterHistorico() {
    $arquivo = _DIR_ . '/historico_envios.json';
    if (!file_exists($arquivo)) return [];
    $conteudo = file_get_contents($arquivo);
    return json_decode($conteudo, true) ?: [];
}

// Variáveis para mensagens
$msg_sucesso = '';
$msg_erro = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validação simples
    $campos_obrigatorios = ['nome_remetente','telefone_remetente','email_remetente','cep_remetente','rua_remetente','numero_remetente','cidade_remetente','estado_remetente','nome_destinatario','telefone_destinatario','email_destinatario','cep_destinatario','rua_destinatario','numero_destinatario','cidade_destinatario','estado_destinatario'];
    foreach ($campos_obrigatorios as $campo) {
        if (empty($_POST[$campo])) {
            $msg_erro = "Campo obrigatório faltando: $campo";
            break;
        }
    }

    if (!$msg_erro) {
        $remetente = [
            "name" => htmlspecialchars($_POST['nome_remetente']),
            "phone" => htmlspecialchars($_POST['telefone_remetente']),
            "email" => filter_var($_POST['email_remetente'], FILTER_VALIDATE_EMAIL),
            "address" => [
                "postal_code" => preg_replace('/\D/', '', $_POST['cep_remetente']),
                "street" => htmlspecialchars($_POST['rua_remetente']),
                "number" => htmlspecialchars($_POST['numero_remetente']),
                "city" => htmlspecialchars($_POST['cidade_remetente']),
                "state_abbr" => strtoupper(substr($_POST['estado_remetente'],0,2)),
            ]
        ];
        $destinatario = [
            "name" => htmlspecialchars($_POST['nome_destinatario']),
            "phone" => htmlspecialchars($_POST['telefone_destinatario']),
            "email" => filter_var($_POST['email_destinatario'], FILTER_VALIDATE_EMAIL),
            "address" => [
                "postal_code" => preg_replace('/\D/', '', $_POST['cep_destinatario']),
                "street" => htmlspecialchars($_POST['rua_destinatario']),
                "number" => htmlspecialchars($_POST['numero_destinatario']),
                "city" => htmlspecialchars($_POST['cidade_destinatario']),
                "state_abbr" => strtoupper(substr($_POST['estado_destinatario'],0,2)),
            ]
        ];

        if (!$remetente['email'] || !$destinatario['email']) {
            $msg_erro = "Email inválido no remetente ou destinatário.";
        } else {
            $pacote = [
                "weight" => 0.3,
                "width" => 11,
                "height" => 17,
                "length" => 20
            ];

            $cotacao = calcularFrete([
                "from" => ["postal_code" => $remetente['address']['postal_code']],
                "to" => ["postal_code" => $destinatario['address']['postal_code']],
                "package" => $pacote,
                "products" => [["id" => "1", "width" => 11, "height" => 17, "length" => 20, "weight" => 0.3, "insurance_value" => 20.5, "quantity" => 1]],
                "services" => [],
                "options" => ["receipt" => false, "own_hand" => false, "insurance_value" => 20.5, "reverse" => false, "non_commercial" => true],
            ]);

            if (isset($cotacao['error'])) {
                $msg_erro = "Erro na API Melhor Envio: " . $cotacao['error'];
            } elseif (empty($cotacao) || !isset($cotacao[0]['id'])) {
                $msg_erro = "Não foi possível calcular o frete.";
            } else {
                $melhorEnvioServico = $cotacao[0]['id'];
                $etiqueta = criarEtiqueta([
                    "service" => $melhorEnvioServico,
                    "from" => $remetente,
                    "to" => $destinatario,
                    "package" => $pacote,
                    "products" => [["name" => "Produto genérico", "quantity" => 1, "unitary_value" => 20.5]],
                    "options" => ["insurance_value" => 20.5, "receipt" => false, "own_hand" => false, "non_commercial" => true],
                ]);

                if (isset($etiqueta['error'])) {
                    $msg_erro = "Erro ao criar etiqueta: " . $etiqueta['error'];
                } elseif (empty($etiqueta['id'])) {
                    $msg_erro = "Não foi possível criar a etiqueta.";
                } else {
                    $shipment_id = $etiqueta['id'];
                    $aprovacao = aprovarEtiqueta($shipment_id);
                    if (isset($aprovacao['error'])) {
                        $msg_erro = "Erro ao aprovar etiqueta: " . $aprovacao['error'];
                    } else {
                        $msg_sucesso = "Etiqueta criada com sucesso! <a href='" . htmlspecialchars($etiqueta['print']['standard']) . "' target='_blank'>Clique aqui para imprimir</a>.";
                        // Salvar no histórico
                        salvarHistorico([
                            'data' => date('Y-m-d H:i:s'),
                            'remetente' => $remetente,
                            'destinatario' => $destinatario,
                            'shipment_id' => $shipment_id,
                            'url_etiqueta' => $etiqueta['print']['standard'],
                        ]);
                    }
                }
            }
        }
    }
}

?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <title>Cálculo e Etiqueta de Frete - Rede de Lojas</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; max-width: 600px; }
        input[type=text], input[type=email] { width: 100%; padding: 8px; margin: 4px 0 10px; box-sizing: border-box; }
        button { padding: 10px 20px; background-color: #007bff; border: none; color: white; cursor: pointer; }
        button:hover { background-color: #0056b3; }
        h2, h3 { color: #003366; }
        .msg-sucesso { background-color: #d4edda; color: #155724; padding: 10px; margin-bottom: 15px; border-radius: 5px; }
        .msg-erro { background-color: #f8d7da; color: #721c24; padding: 10px; margin-bottom: 15px; border-radius: 5px; }
        .historico { margin-top: 30px; }
        .historico-item { border-bottom: 1px solid #ccc; padding: 8px 0; }
        .historico-item:last-child { border-bottom: none; }
    </style>
</head>
<body>
<h2>Formulário de Frete</h2>

<?php if ($msg_erro): ?>
    <div class="msg-erro"><?= $msg_erro ?></div>
<?php endif; ?>

<?php if ($msg_sucesso): ?>
    <div class="msg-sucesso"><?= $msg_sucesso ?></div>
<?php endif; ?>

<form method="post" novalidate>
    <h3>Remetente</h3>
    <input type="text" name="nome_remetente" placeholder="Nome" required value="<?= htmlspecialchars($_POST['nome_remetente'] ?? '') ?>" />
    <input type="text" name="telefone_remetente" placeholder="Telefone" required value="<?= htmlspecialchars($_POST['telefone_remetente'] ?? '') ?>" />
    <input type="email" name="email_remetente" placeholder="Email" required value="<?= htmlspecialchars($_POST['email_remetente'] ?? '') ?>" />
    <input type="text" name="cep_remetente" placeholder="CEP" required value="<?= htmlspecialchars($_POST['cep_remetente'] ?? '') ?>" />
    <input type="text" name="rua_remetente" placeholder="Rua" required value="<?= htmlspecialchars($_POST['ru