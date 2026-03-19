-- Atualiza a senha do admin para "admin123"
-- O hash MD5 de "admin123" é: 0192023a7bbd73250516f069df18b500

UPDATE users 
SET password = '0192023a7bbd73250516f069df18b500'
WHERE email = 'contato@ilinkbio.com.br';

-- Verifica se foi atualizado
SELECT id, email, nome, password, level, status 
FROM users 
WHERE email = 'contato@ilinkbio.com.br';
