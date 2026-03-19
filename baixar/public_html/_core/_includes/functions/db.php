<?php

// Tenta conectar ao banco, mas não para a execução se falhar (modo desenvolvimento)
try {
    $db_con = @mysqli_connect($db_host,$db_user,$db_pass,$db_name);
    if ($db_con) {
        mysqli_set_charset($db_con, "utf8mb4");
    }
} catch (Exception $e) {
    $db_con = false;
}

// if( !$db_con ) {
//     echo "Connection failed: " . mysqli_connect_error() . "\n";
//     die();
// }else {
//     //echo "Connected successfully\n";
// }
?>