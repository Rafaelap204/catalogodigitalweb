<?php
// Script para verificar qual é a senha do admin

$hashNoBanco = "644eaedf927b30ad9553fa8fedc68d9e";

// Testa algumas senhas comuns
$senhasParaTestar = [
    "admin",
    "admin123",
    "123456",
    "password",
    "ilinkbio",
    "contato",
    "",
];

echo "Hash no banco: $hashNoBanco\n\n";

foreach ($senhasParaTestar as $senha) {
    $hash = md5($senha);
    echo "Senha: '$senha' => Hash: $hash";
    if ($hash === $hashNoBanco) {
        echo " <-- MATCH!";
    }
    echo "\n";
}

echo "\n\nSe nenhuma senha corresponder, o sistema pode usar:\n";
echo "- Salt no hash\n";
echo "- Maiúsculas/minúsculas diferentes\n";
echo "- Outro algoritmo de hash\n";
?>
