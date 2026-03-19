-- ============================================
-- MIGRACAO PARTE 2 - TABELAS DE USUÁRIOS
-- MySQL → PostgreSQL (Supabase)
-- Tabelas: users, users_data
-- ============================================

-- ============================================
-- TABELA: users
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  nome TEXT,
  email TEXT,
  password TEXT,
  level TEXT,
  operacao TEXT DEFAULT '2',
  status TEXT,
  recover_key TEXT,
  keepalive TEXT,
  created TIMESTAMP WITH TIME ZONE,
  last_login TIMESTAMP WITH TIME ZONE,
  comis TEXT
);

INSERT INTO users (id, nome, email, password, level, operacao, status, recover_key, keepalive, created, last_login, comis) VALUES
(1, 'Administrado', 'contato@ilinkbio.com.br', '644eaedf927b30ad9553fa8fedc68d9e', '1', '1', '1', '25kd8kbeg2ejkbhkaedgadba3k2eidkbjjjcff5aedfbkdaej5eg3jeeakahkkj0ff5i7k6fhgkb2bjgfgidbggii5if1jkia3jdji4iig1kcdiaaa4ff38i', 'e158999c18086e48f7f6af8c202a4d1c', '2022-09-19 11:03:06', '2026-03-13 14:29:27', NULL),
(39, 'Estilo masculino', 'demo1@demo1.com', '8fb2ab6c216a9dce0e3d9cf4ed17740c', '2', '2', '1', NULL, '84efe9c1b203c2cbf66510ccdfe8cfd5', '2020-07-22 19:36:35', '2024-07-09 20:40:45', NULL),
(60, 'Estilo feminino', 'matosjunior62@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '', '2020-09-12 12:22:48', '2022-02-15 12:27:33', NULL),
(71, 'Quase Tudo', 'matosjunior61@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', 'kf7jkb2jid7fcj41a4j9a73hh6ecj146idc8hage48jj23dbjga7hjiiij9ef0g913c8efea4e8ackfaedj1hkjkdbbjdgddjhcjggd43bgdaa6ac6g10a5j', '8f6f1707cd9e49cfe1ce29bc8c7472d', '2021-11-19 18:53:47', '2022-01-29 17:44:13', NULL),
(74, 'Doces e Tortas', 'matosjunior52@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, 'd814c3be16e2d6cf60938ee4fc6ba1cb', '2021-11-27 11:18:58', '2022-02-19 21:24:09', NULL),
(120, 'Teste', 'newalexdesigner@gmail.com', 'aa1bf4646de67fd9086cf6c79007026c', '2', '2', '1', NULL, '', '2023-01-25 18:06:38', '2023-01-25 18:32:11', NULL),
(121, 'Casa do Bolo', 'matosjunior50@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, NULL, '2023-01-25 18:19:51', NULL, NULL),
(122, 'Panipão Distribuidora', 'matosjunior49@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, 'ab6ff32bbfb14b39eaa22522f5d282d8', '2023-01-27 15:38:15', '2023-03-30 05:36:03', NULL),
(124, 'Tênis Mania', 'matosjunior47@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, NULL, '2023-01-29 14:04:57', NULL, NULL),
(126, 'Imperium Suplementos', 'matosjunior45@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '', '2023-01-29 16:03:54', '2023-03-19 23:45:44', NULL),
(127, 'Distribuidora de Bebidas', 'matosjunior41@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '', '2023-01-29 20:10:13', '2023-02-07 21:03:18', NULL),
(132, 'Ozonteck Store', 'matosjunior39@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '5401d4ecc6cef169aedf831879e9ef02', '2023-02-02 11:27:30', '2023-02-08 14:33:03', NULL),
(136, 'Pizzaria', 'matosjunior38@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '', '2023-02-12 16:42:38', '2023-02-12 19:54:59', NULL),
(137, 'Essencial eletro', 'matosjunior37@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '', '2023-02-12 21:42:24', '2023-02-14 15:57:28', NULL),
(139, 'Massa Master', 'matosjunior36@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '', '2023-02-14 14:42:32', '2023-02-21 16:09:06', NULL),
(143, 'EletroMóveis Prime', 'matosjunior35@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '', '2023-02-19 09:13:46', '2023-02-20 20:54:36', NULL),
(144, 'Fragrância Suave', 'matosjunior34@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '', '2023-02-19 11:18:49', '2023-02-20 20:53:12', NULL),
(145, 'Íntima Store', 'matosjunior33@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '', '2023-02-19 13:47:48', '2023-02-20 20:04:53', NULL),
(146, 'Compre bem', 'matosjunior31@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '', '2023-02-19 16:12:20', '2023-02-19 16:12:20', NULL),
(147, 'Parafusei', 'matosjunior30@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '', '2023-02-19 18:00:46', '2023-02-19 18:00:46', NULL),
(148, 'NatuGrão', 'matosjunior29@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '', '2023-02-20 10:58:39', '2023-02-20 20:07:45', NULL),
(149, 'motorcycle', 'matosjunior28@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '', '2023-02-20 11:50:44', '2023-02-21 14:23:26', NULL),
(150, 'Bakery Francesa', 'matosjunior27@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, 'dcc5ba80da07aa28f6dd58abc18ee50f', '2023-02-20 12:48:07', '2024-04-10 14:10:26', NULL),
(151, 'ShopFone', 'matosjunior26@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '', '2023-02-20 14:00:16', '2023-02-21 14:28:21', NULL),
(153, 'Luminar', 'matosjunior25@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '', '2023-02-20 15:28:07', '2023-02-21 14:27:08', NULL),
(154, 'Instrumentalize', 'matosjunior24@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '', '2023-02-20 16:26:44', '2023-02-21 14:27:08', NULL),
(155, 'Peça Certa', 'matosjunior23@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '', '2023-02-20 18:08:00', '2023-02-20 20:46:58', NULL),
(156, 'Aconchego de Almofadas', 'matosjunior21@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '', '2023-02-21 10:26:39', '2023-02-21 14:27:25', NULL),
(157, 'Colchões Confort', 'matosjunior19@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '', '2023-02-21 11:28:15', '2023-02-21 11:28:16', NULL),
(159, 'InfoStore', 'matosjunior18@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '49a1e158deaeb74a840daa27dcc7a103', '2023-02-21 18:16:24', '2023-02-23 07:36:33', NULL),
(160, 'TupperPlace', 'focosoff0@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '', '2023-02-21 19:16:48', '2023-02-21 19:16:49', NULL),
(161, 'CleanMaster ', 'matosjunior17@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '', '2023-02-21 20:10:16', '2023-02-22 12:47:00', NULL),
(163, 'Descartável Expresshop', 'focosoff@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '', '2023-02-22 11:14:07', '2023-02-22 12:48:07', NULL),
(164, 'Bomboniere Mania', 'focosoff5@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '', '2023-02-22 14:09:01', '2023-02-22 14:09:02', NULL),
(165, 'Visão Moderna', 'focosoff4@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '2640a44941c1e24c39bec7b65fe32a8e', '2023-02-22 16:18:40', '2025-03-28 18:00:49', NULL),
(166, 'Doçuras Park Confeitaria', 'focoso03@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '', '2023-02-22 20:19:13', '2023-02-27 09:13:42', NULL),
(168, 'Shop Burger ', 'focoso02@gmail.com', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '1ebfcc2c2330908047ab85aec811fb89', '2023-02-27 09:25:56', '2025-04-01 19:07:19', NULL),
(207, 'RAIMUNDO ROODRIGUES MATOS JUNIOR', 'contato1@rededelojas.online', '25d55ad283aa400af464c76d713c07ad', '2', '2', '1', NULL, '', '2025-05-27 22:42:39', '2025-05-28 10:28:30', NULL),
(210, 'teste', 'teste@rededelojas.online', '25f9e794323b453885f5181f1b624d0b', '1', '2', '1', NULL, '', '2025-05-30 08:13:13', '2025-05-30 08:13:50', NULL),
(214, 'Pisou, Levou', 'davipro35@gmail.com', 'd0a4be09991b432099b8db68d4e0f3a8', '2', '2', '1', NULL, '', '2025-06-27 10:23:47', '2025-07-03 09:54:19', NULL),
(216, 'CTR REPRESENTAÇÕES', 'rafaelap204@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', '2', '2', '1', NULL, '560053616944fe053ff2e81a871e3e42', '2025-07-01 12:47:49', '2025-10-27 21:06:51', NULL),
(218, 'Vila Do Artesanato', 'gutsoespadachimlendario@gmail.com', '48ac6a595014c5eac9b5f9097ec07d11', '2', '2', '1', NULL, '244f5796ce26503aab3b302612771faf', '2025-07-03 10:22:21', '2025-07-03 11:34:32', NULL),
(219, 'Drogaria Popular Vs-10', 'drogariapopularvs10@gmail.com', '46c610dbb048c6716fb6b9bc00491757', '2', '2', '1', NULL, '2f96fa592c2f79c32b46013163f7fed9', '2025-07-10 05:29:56', '2025-10-23 19:49:57', NULL),
(220, 'Raposo joias ', 'afonsorapouso@gmail.com', '20698c993fde3188ca902cd8c2eab890', '2', '2', '1', NULL, 'cb5bd21fb253949c3621b2ecc92ca8b2', '2025-07-20 22:02:43', '2025-07-20 22:02:44', NULL),
(221, 'Delivery Cosme?ticos', 'santoshellem585@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', '2', '2', '1', NULL, '88bd41e1f6181a8c60f76c6ca067fa22', '2025-07-22 09:16:29', '2025-07-22 09:41:32', NULL),
(223, 'CASA DE SUCOS DA SERRA', 'yanna.msou@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', '1', '2', '1', NULL, '', '2025-07-22 10:11:22', '2025-09-18 09:11:36', NULL),
(224, 'Brancaelegance ', 'lucysouzaesillva72@gmail.com', 'e807f1fcf82d132f9bb018ca6738a19f', '2', '2', '1', NULL, 'de367a6790c92c9b63a18dd97095dbcc', '2025-09-16 09:21:00', '2025-10-12 21:19:45', NULL),
(225, 'Lu faschion ', 'Lfachion@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', '2', '2', '1', NULL, 'e65cbb4a426a0a4370b21d36a26a7b20', '2025-09-16 09:23:59', '2025-09-22 23:00:46', NULL),
(226, 'Bombom gourmet ', 'niell.cs@hotmail.com', '06cb2157219f1f858ab8550e86198432', '2', '2', '1', NULL, '1ad91e40ddca0301a78da3f4706b2072', '2025-09-16 09:33:50', '2025-09-17 10:55:32', NULL),
(227, 'Anelita Variedades', 'anelitadiasmarinho@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', '2', '2', '1', NULL, '', '2025-09-16 14:25:08', '2025-09-18 15:38:32', NULL),
(228, 'Oficina do Couro', 'gloriamariapassosvieira@gmail.com', '5995f7bf8009e3c6aa148ab78d62331b', '2', '2', '1', NULL, '', '2025-09-16 14:25:20', '2025-09-18 08:29:11', NULL),
(229, 'Ana Fitness', 'acaroline3001@gmail.com', 'd60bc5eb543766569c08e478680a2890', '2', '2', '1', NULL, '0c5c473727604941d9d3eb505099cd0f', '2025-09-16 14:27:38', '2025-09-22 16:32:37', NULL),
(230, 'Meu Doce Cantinho ', 'marlima.soares@gmail.com', '39a500ff6e4ae9a194a31c542bd6a60b', '2', '2', '1', NULL, '5d69393336bda513759acef391329ae7', '2025-09-16 14:27:40', '2025-09-22 13:33:52', NULL),
(231, 'Closet da Marcia', 'marciayesfs@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', '2', '2', '1', NULL, '577cebb71287b859c2dc7d8687b3a4ea', '2025-09-16 14:35:28', '2025-09-18 18:30:41', NULL),
(232, 'Hortifrute Linhares', 'jonassilva9434@gmail.com', '49fdd22af2973696bf5bee4cfc64b66c', '2', '2', '1', NULL, '8959171e913ba2d3cd9329c914532d2c', '2025-09-16 18:25:08', '2025-09-17 18:38:26', NULL),
(233, 'Luxinhos de menina 1989 ', 'Vandecleia2012@gmail.com', '8d36a5c222d002476a4464d7d97bfc21', '2', '2', '1', NULL, '952f23dcb98f2fcffba38ff73a811afb', '2025-09-17 18:42:28', '2025-09-18 18:13:27', NULL),
(234, 'Ana Paula Furtado Marinho', 'paulamarinho16@gmail.com', '51e4845c4dabc6bc073b221588a2c1bb', '2', '2', '1', NULL, 'f8bae9c42397bf84524c41f0cdd61c94', '2025-09-17 19:12:20', '2025-10-13 09:46:47', NULL),
(235, 'Glauciane Cristina de Almeida Silva ', 'glaucianecristia@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', '2', '2', '1', NULL, '', '2025-09-18 09:38:03', '2025-09-18 11:18:46', NULL),
(236, 'VALNICE FROTA LIMA', 'valnicenickolas@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', '2', '2', '1', NULL, 'ac26c2939cfa36d2a28eb03af4149e87', '2025-09-18 18:19:38', '2025-11-26 21:27:15', NULL),
(237, 'Flavia Silva Depilação', 'fla_rejane@hotmail.com', 'd03601061406c22f46e56a2e2d1a6053', '2', '2', '1', NULL, '7337132a7699bfc8e938244d5379b136', '2025-09-18 20:39:07', '2025-09-18 20:39:07', NULL),
(238, 'Branca Elegance', 'brancaelegance@gmail.com', '25f9e794323b453885f5181f1b624d0b', '2', '2', '1', NULL, '', '2025-09-29 20:41:52', '2025-10-01 10:30:09', NULL),
(239, 'Açaí Gourmet', 'agenciagestaltadm@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', '2', '2', '1', NULL, '', '2025-10-27 20:38:18', '2026-01-30 14:20:16', NULL),
(240, 'Mimos da Anny ', 'borboletaabada975@gmail.com', '50217420dc0fdb1c488c765d495c5f9b', '2', '2', '1', NULL, '53d22e3f13e7d02526b3bf102fb21297', '2025-10-27 20:40:13', '2025-10-28 21:42:43', NULL),
(242, 'BrinLaser', 'brinlaser@gmail.com', '5b66ed946913b9981591e936e96adaa5', '2', '2', '1', NULL, 'f7f57c9c3e1d86d5b228b16c8e708c35', '2025-10-27 20:42:10', '2025-10-31 19:51:37', NULL),
(243, 'Mkt.hgs', 'hortenciagomessilva@gmail.com', 'bba50fd195173d355476f6a9561ed1ce', '2', '2', '1', NULL, '6f547a0950082c4c12ff95421224b4ab', '2025-10-27 20:44:28', '2025-10-27 20:44:29', NULL),
(244, 'Gostosura do açaí ', 'jordeanesantos071@gmail.com', '332d4f390351f8b7afc2ef688cd005f8', '2', '2', '1', NULL, '28f8580fe7a58c8ce1da22be61eaef77', '2025-10-27 20:52:29', '2025-11-01 07:12:52', NULL),
(245, 'Geladinhos gourmet ', 'kevyn.lima07@gmail.com', '581bc968b7166bac7e68cf361da2ae81', '2', '2', '1', NULL, 'd6f172d4e299c64d44d9ff4df63b9890', '2025-10-27 21:07:10', '2025-10-29 20:40:58', NULL),
(246, 'Floresta do açaí ', 'waylaestefane23@gmail.com', '188f70dfd847272af696295d41164770', '2', '2', '1', NULL, '8948811e0b5dabfdf4631c2aabc475c2', '2025-10-29 00:26:15', '2025-10-29 19:41:03', NULL),
(247, 'Imersão Ponto G Empresarial', 'imersaopontog@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', '2', '2', '1', NULL, 'cb8a38043a5bb53c5ef9c13d808dc176', '2025-11-10 19:10:23', '2025-11-10 19:10:24', NULL),
(248, 'GIL MODA ÍNTIMA', 'ribeiro.valderlandia@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', '2', '2', '1', NULL, 'a4045769a9d51d8fb8398958912a520a', '2025-12-01 21:36:10', '2025-12-06 17:06:43', NULL),
(249, 'BARBEARIA ARTE CLÍNIC HAIR ', 'meloniodigital@gmail.com', 'e9281c9bfdcaa291fbf1ba60fc3f5eea', '2', '2', '1', NULL, '7639e13187cd0b3de05a555f11955deb', '2025-12-01 21:51:28', '2025-12-02 12:34:59', NULL),
(250, 'CENTER INFORMÁTICA', 'linakelly_conhecimento@hotmail.com', '7cd7514e8636a2c2c47d2bfa77e7ac97', '2', '2', '1', NULL, '0440ff00e1dcecbf92e13813daafcea9', '2025-12-01 22:05:56', '2025-12-01 22:05:57', NULL),
(251, 'Jane Lene Melo Costa', 'janelene15@gmail.com', '2762feefb1472cd784295b58eae4d896', '2', '2', '1', NULL, '07813005f6e16c36216e4eee8c1e80e8', '2025-12-01 22:19:08', '2025-12-01 22:19:08', NULL),
(252, 'Pousada Curió', 'samirabiancasantosreis@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', '2', '2', '1', NULL, '0a77cca8b55432c79c2dbce5b5e3f8d6', '2025-12-02 18:50:08', '2025-12-02 22:57:49', NULL),
(253, 'Ateliê Gourmet', 'loreematias@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', '2', '2', '1', NULL, 'c97ba79fe2799f05f77b0fd041164770', '2025-12-15 09:55:23', '2026-02-21 16:16:50', NULL),
(254, 'Dormitório Vitória ', 'dormitóriovitoriasp@gmail.com', '18a648a4a9ba5d09a03a190801a6857b', '2', '2', '1', NULL, 'f9d989f8718f6a5aa77ae8c7208ab254', '2025-12-15 10:43:54', '2025-12-15 10:43:55', NULL),
(255, 'Pousada Curió', 'silvamarcilene331@gmail.com', '0ba935bd828ca5cce6336d4585498d3e', '2', '2', '1', NULL, '', '2025-12-16 09:01:10', '2025-12-16 09:01:10', NULL),
(257, 'Preciosa Amazônia', 'saraivaarte10@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', '2', '2', '1', NULL, '736fe5cc61ac0a23b010edbc9d8da472', '2026-01-19 16:41:38', '2026-02-09 19:59:03', NULL),
(258, 'Casa Dourada', 'franzreis.fran@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', '2', '2', '1', NULL, NULL, '2026-01-22 11:55:05', NULL, NULL),
(259, 'Zaria', 'franzreis.fran2@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', '2', '2', '1', NULL, NULL, '2026-01-22 12:20:09', NULL, NULL),
(260, 'Encantos Da Serra', 'ENCANTOSDASERRAA@GMAIL.COM', 'e10adc3949ba59abbe56e057f20f883e', '2', '2', '1', NULL, '', '2026-01-22 15:29:05', '2026-01-23 14:58:12', NULL),
(261, 'Karina Saboaria ', 'karinasaboaria@gmail.com', '3c63e89d67aab8f3d3d74b174cdf56d1', '2', '2', '1', NULL, '', '2026-02-11 16:32:51', '2026-02-20 16:48:34', NULL),
(262, 'CANVA FREE', 'marianacarvalhodasilva715@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', '2', '2', '1', NULL, 'b62fc8736a54852d0309f87f108135ed', '2026-02-12 17:51:56', '2026-02-13 17:36:14', NULL),
(263, 'Gurgeia', 'Gurgueia22@gmail.com', '555edf07863b01fd659d5ead8634f359', '2', '2', '1', NULL, '', '2026-02-13 18:27:06', '2026-02-23 15:06:36', NULL),
(266, 'JBP', 'josianapaz25@gmail.com', '2916afde1d8d458d45b074511e3d10d0', '2', '2', '1', NULL, '', '2026-02-20 16:57:14', '2026-02-26 11:25:31', NULL),
(267, 'Ateliê MM', 'a991509511@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', '2', '2', '1', NULL, '88e20a2a2e44fb3c94bcc5ff7ffdc906', '2026-02-20 17:40:14', '2026-02-20 17:40:15', NULL),
(268, 'Juraci Claudino', 'jullyanasousa33@gmail.com', '6eae9405ddf3a0901f59086969e6883a', '2', '2', '1', NULL, '', '2026-02-23 21:02:34', '2026-02-24 18:19:43', NULL),
(269, 'Ateliê Maria Antonia', 'Toniapontes123@gmail.com', '65f3223479a65478dec697557d9f0dab', '2', '2', '1', NULL, '092191e030ccf023d6ad787b91688947', '2026-02-23 21:39:48', '2026-02-24 18:18:44', NULL),
(270, 'Bordadeira de Serra Pelada', 'rosangelacarvalhovieira@gmail.com', 'a800ac640659fab7c4b49e10292ea1cd', '2', '2', '1', NULL, '', '2026-02-23 22:13:17', '2026-02-24 15:02:40', NULL),
(271, 'Nexus Digital', 'Catalogodigitalweb@gmail.com', 'd9bcad1eca7b1bb63bbfdf3289ef4737', '2', '2', '1', NULL, '8c3b3d800e551465ebd556ec127cd93b', '2026-02-26 11:28:30', '2026-03-02 10:12:59', NULL),
(272, 'AÇAÍ DELÍCIA', 'henriquedesousa86@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', '2', '2', '1', NULL, '', '2026-03-03 17:44:27', '2026-03-03 17:50:51', NULL),
(274, 'Maryscarpe', 'marizacosta1992@hotmail.com', 'e10adc3949ba59abbe56e057f20f883e', '2', '2', '1', NULL, '9ac9a88620279ca28841f1e8ecd1a95e', '2026-03-03 18:09:22', '2026-03-12 18:09:05', NULL),
(275, 'Cida Bordados', 'cidacardoso932@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', '2', '2', '1', NULL, '2592710d6b5b7e69932a42ed89282db8', '2026-03-11 16:40:18', '2026-03-11 16:40:19', NULL),
(276, 'Nome da sua empresa', 'cuscuznatural@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', '2', '2', '1', NULL, '41ff0c85c6863d1ce3098c62dc09ad32', '2026-03-12 19:10:55', '2026-03-12 19:10:55', NULL),
(277, 'Ceonet ', 'denisesilvaand16@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', '2', '2', '1', NULL, '89020569745eaeb37f2a6a172a3ea34c', '2026-03-12 19:10:59', '2026-03-13 11:35:58', NULL),
(278, 'Center sat ', 'spsservicosrondon@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', '2', '2', '1', NULL, '690fb3c13dbbb15ec85c1b5db92049e8', '2026-03-12 19:11:03', '2026-03-12 20:02:03', NULL)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- TABELA: users_data
-- ============================================

CREATE TABLE IF NOT EXISTS users_data (
  id SERIAL PRIMARY KEY,
  rel_users_id TEXT,
  nascimento TEXT,
  documento_tipo TEXT,
  documento TEXT,
  estado TEXT,
  cidade TEXT,
  telefone TEXT,
  comissao TEXT
);

INSERT INTO users_data (id, rel_users_id, nascimento, documento_tipo, documento, estado, cidade, telefone, comissao) VALUES
(30, '108', '25/12/1982', '1', '29794841803', '19', '3608', '11982889012', NULL),
(31, '109', '25/12/1982', '1', '29794841803', '2', '103', '11982889012', NULL),
(34, '118', '01/01/01', '1', '545454', '1', '79', '11982889012', NULL),
(36, '120', '03/01/1983', '1', '01413118437', '2', '147', '82988727777', NULL),
(41, '150', '', '', '', '', '', '47991345348', NULL),
(42, '164', '', '', '', '', '', '47991345348', NULL),
(43, '191', '14/02/1999', '1', '62367070300', '6', '796', '88993010277', NULL),
(44, '1', '05/01/1967', '1', '20972835000110', '14', '2506', '94981491753', NULL),
(48, '210', '01/01/1991', '1', '00000000001', '6', '756', '', NULL),
(47, '207', '05/01/1961', '1', '054464712345', '6', '756', '11914144952', NULL),
(51, '223', '14/03/1990', '1', '04345708346', '14', '2506', '', NULL),
(54, '272', '', '', '', '15', '2576', '', NULL)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- FIM DA PARTE 2
-- ============================================
