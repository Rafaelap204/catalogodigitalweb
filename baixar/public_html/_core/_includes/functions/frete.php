<?php



function calcular_frete_pacote($cep_origem, $cep_destino, $altura, $largura, $comprimento, $peso) {
    try{

        $url = "https://www.melhorenvio.com.br/api/v2/me/shipment/calculate";
        //$token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZDg1ZmQzMWVkZTFkZDgxMzc4Yjc5NDJlYTY0MjUzMGIxNjMxOTk3ZWZjNjU3YjEyZmU1NTU3Nzg4ZmM0MDQ0OWIyOWYyOTFlZTVlNTBiMzUiLCJpYXQiOjE3NDQ3NDI0ODEuNTI5OTMsIm5iZiI6MTc0NDc0MjQ4MS41Mjk5MzIsImV4cCI6MTc3NjI3ODQ4MS40OTkwMDIsInN1YiI6ImEwNjA3ZDI0LTBkNTctNGVkYy05YzJmLTEyOTczMTc2NWEyOCIsInNjb3BlcyI6WyJjYXJ0LXJlYWQiLCJjYXJ0LXdyaXRlIiwiY29tcGFuaWVzLXJlYWQiLCJjb21wYW5pZXMtd3JpdGUiLCJjb3Vwb25zLXJlYWQiLCJjb3Vwb25zLXdyaXRlIiwibm90aWZpY2F0aW9ucy1yZWFkIiwib3JkZXJzLXJlYWQiLCJwcm9kdWN0cy1yZWFkIiwicHJvZHVjdHMtZGVzdHJveSIsInByb2R1Y3RzLXdyaXRlIiwicHVyY2hhc2VzLXJlYWQiLCJzaGlwcGluZy1jYWxjdWxhdGUiLCJzaGlwcGluZy1jYW5jZWwiLCJzaGlwcGluZy1jaGVja291dCIsInNoaXBwaW5nLWNvbXBhbmllcyIsInNoaXBwaW5nLWdlbmVyYXRlIiwic2hpcHBpbmctcHJldmlldyIsInNoaXBwaW5nLXByaW50Iiwic2hpcHBpbmctc2hhcmUiLCJzaGlwcGluZy10cmFja2luZyIsImVjb21tZXJjZS1zaGlwcGluZyIsInRyYW5zYWN0aW9ucy1yZWFkIiwidXNlcnMtcmVhZCIsInVzZXJzLXdyaXRlIiwid2ViaG9va3MtcmVhZCIsIndlYmhvb2tzLXdyaXRlIiwid2ViaG9va3MtZGVsZXRlIiwidGRlYWxlci13ZWJob29rIl19.MhVa_GK2H2Nh7Tjbcwrwu_0k7dE3EUVxDxqhzug9LMUgp6AEeAcvG8qO4QvMHAQvexDgmEQsVgyIu-4yiEkzQAIeCTqklCG0VpWrd09HqNqVMrZvukQLdc5NyRX8s0ZmERVyliCgU9d5a49GjXTX8DmqPcQ_bRxA5PUt92wpcj4PH6rcPLxfXQ5zwZZpu-zry8MBAygCsLLtpnOPOUGd_DBHu1y5D0WHPx9LgyiX37X7Ic2v3twr2iZmAb866zvf675BP27eURO86MnGZ8bE44G75pFAwGpGeHbm6zhwWrKs-IheAM2fzVcLW5LssCnqgLL-d_xD6Ojnpj_tLNBjQM-P4tb0UUUWrNGPlTPOd_c8i1Nc_zhzZNOrP90OylfhMHWg2T5L66IJ5-p46nFgMBz4tI_juNIt2dzte2R1Y3fOEVOt6DfYSUvSyB_Gqu_m6M2-HKmSD3AEXIQOMwdfjupvq7-ND4zZKgM_UJE1INVQmhXcnj-9PiPypcN-HJAqCBwIv07K6hG2bCXrYtYPp982EUUq-lIK1uIwqLvCzeQlRd_Q8K7AvhY0Ge7Eyifm-Lonn7uy_ysGrz1Lcsgc0tj50thowTteGLXV2clQZAHorJalR7NxtRYkbLy5ipIURhgBKCq1XfuoQTxGt2vAec64f91bg4BhQdRjI08q0Qo";
        $token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMjVjNmViOGYxNThmYTI2YWRiZWFjMjlmMWI1YjI1NWQ1MmU3YTQwNDkzZDgyZjUxZDJjN2IzYmVlYjg3YmY5MWUxZjU4NDRkNjRjZTI2NTUiLCJpYXQiOjE3NTA4OTUyNTEuNjMxMDY1LCJuYmYiOjE3NTA4OTUyNTEuNjMxMDY3LCJleHAiOjE3ODI0MzEyNTEuNjEzOTc1LCJzdWIiOiI0YjA4Nzc0OC03Mjc1LTQ2YzgtOGU1OC1jODVjN2RhYzQxYTEiLCJzY29wZXMiOlsiY2FydC1yZWFkIiwiY2FydC13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiY29tcGFuaWVzLXdyaXRlIiwiY291cG9ucy1yZWFkIiwiY291cG9ucy13cml0ZSIsIm5vdGlmaWNhdGlvbnMtcmVhZCIsIm9yZGVycy1yZWFkIiwicHJvZHVjdHMtcmVhZCIsInByb2R1Y3RzLWRlc3Ryb3kiLCJwcm9kdWN0cy13cml0ZSIsInB1cmNoYXNlcy1yZWFkIiwic2hpcHBpbmctY2FsY3VsYXRlIiwic2hpcHBpbmctY2FuY2VsIiwic2hpcHBpbmctY2hlY2tvdXQiLCJzaGlwcGluZy1jb21wYW5pZXMiLCJzaGlwcGluZy1nZW5lcmF0ZSIsInNoaXBwaW5nLXByZXZpZXciLCJzaGlwcGluZy1wcmludCIsInNoaXBwaW5nLXNoYXJlIiwic2hpcHBpbmctdHJhY2tpbmciLCJlY29tbWVyY2Utc2hpcHBpbmciLCJ0cmFuc2FjdGlvbnMtcmVhZCIsInVzZXJzLXJlYWQiLCJ1c2Vycy13cml0ZSIsIndlYmhvb2tzLXJlYWQiLCJ3ZWJob29rcy13cml0ZSIsIndlYmhvb2tzLWRlbGV0ZSIsInRkZWFsZXItd2ViaG9vayJdfQ.Zkbjg2xw_pOKmjemi8tRcrZWJni8oPC1EKv7WxkUz2CTxFT0fuTufvfT2a2DoaDukYyfnOcxZroYSGAhXGr2SvRZuaO-Ed6F72G3ThAaxDZUXEFMkel2V8rYipjK0GzrZSMgZf602ykhp8-sDsf4FlhpvmKeupQG1DSpbxG3WdxsK3Cs2OE9CG9lYCj5MaeOZNH5m_qsksio-lBYthPKTPGWnunjYTirwbaWs8nIiKCC-EKfQZ0GwyLM6HqsxFCxIRBkhH7xCODy6LZbOSi9BG4K6ptRnE8lNuz3STyHE0la3z5lnnLm2B-aRJkx24s0xqmMDW79e0kvaPp2bogOLM16sfdI-yMiZtlDHUdxcyWv-xtjnvaE0h-RjJHOB81XOltyrwbSNlvVu_-yMH0swdyCvJ3gnGz3IDFCHBLtOYgc9Ld0Y8ly6gvDbqsydf_pW1ts4RXZxyqNRv5KfbfHey0CUWOF1UTwfpyaB2cL2Uw-nsqlkok6BMxYwuT54X2Ml2PmFg1v4rVaHY2Gib95uaxoTA-1QlWyNYgo4Ys-uPYMXs9MWTajLR6RYDCu6fY6rKe1P2fD1QynsRxO-bEiECQWZxXBERbXF_A_8k2iFjgJR1YpnoBByrFMvUjzx6YjPJChvwJD_zlz4VMADZKphp60e1WHZHMEf_u0kXuMfyA";
        
        // Dados a serem enviados
        $data = json_encode([
            "from" => [
                "postal_code" => $cep_origem ?? ""
            ],
            "to" => [
                "postal_code" => $cep_destino ?? ""
            ],
            "package" => [
                "height" => $altura ?? "",
                "width" => $largura ?? "",
                "length" => $comprimento ?? "",
                "weight" => $peso ?? ""
            ]
        ]);

        // Configuração do cabeçalho
     //   $headers = [
     //       "Accept: application/json",
     //       "Authorization: Bearer $token",
     //       "Content-Type: application/json",
     //       "User-Agent: Aplicação email@email.com"
     //   ];
    

        // Configuração do cabeçalho
        $headers = [
            "Accept: application/json",
            "Authorization: Bearer $token",
            "Content-Type: application/json",
            "User-Agent: rededelojas citydrive2018@gmail.com"
        ];
        
        // Inicializando cURL
        $curl = curl_init();
    
        // Configurando a solicitação cURL
        curl_setopt_array($curl, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $data,
            CURLOPT_HTTPHEADER => $headers,
        ]);
    
        // Executando a solicitação e capturando a resposta
        $response = curl_exec($curl);
    
        // Verificando erros
        if (curl_errno($curl)) {
            //'Erro na solicitação cURL: ' . curl_error($curl);
            return false; 
        } else {
            // Exibindo a resposta
            // echo "<pre>";
            // var_dump(json_decode($response, true));
            // echo "</pre>";
            
            $file = fopen("produtos.txt", "ab");
            fwrite($file,print_r($response,true));
            fclose($file);


            return  json_decode($response, true);
        }
    }catch (Exception $e) {
        return false;
    }
}