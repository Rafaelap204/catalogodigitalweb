-- ============================================
-- MIGRACAO PARTE 1 - TABELAS AUXILIARES
-- MySQL → PostgreSQL (Supabase)
-- Tabelas: estados, cidades, segmentos, planos
-- ============================================

-- ============================================
-- TABELA: estados
-- ============================================

CREATE TABLE IF NOT EXISTS estados (
  id SERIAL PRIMARY KEY,
  nome TEXT,
  uf TEXT
);

INSERT INTO estados (id, nome, uf) VALUES
(1, 'Acre', 'AC'),
(2, 'Alagoas', 'AL'),
(3, 'Amazonas', 'AM'),
(4, 'Amapá', 'AP'),
(5, 'Bahia', 'BA'),
(6, 'Ceará', 'CE'),
(7, 'Distrito Federal', 'DF'),
(8, 'Espírito Santo', 'ES'),
(9, 'Goiás', 'GO'),
(10, 'Maranhão', 'MA'),
(11, 'Minas Gerais', 'MG'),
(12, 'Mato Grosso do Sul', 'MS'),
(13, 'Mato Grosso', 'MT'),
(14, 'Pará', 'PA'),
(15, 'Paraíba', 'PB'),
(16, 'Pernambuco', 'PE'),
(17, 'Piauí', 'PI'),
(18, 'Paraná', 'PR'),
(19, 'Rio de Janeiro', 'RJ'),
(20, 'Rio Grande do Norte', 'RN'),
(21, 'Rondônia', 'RO'),
(22, 'Roraima', 'RR'),
(23, 'Rio Grande do Sul', 'RS'),
(24, 'Santa Catarina', 'SC'),
(25, 'Sergipe', 'SE'),
(26, 'São Paulo', 'SP'),
(27, 'Tocantins', 'TO')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- TABELA: cidades
-- ============================================

-- Nota: A tabela cidades já deve existir no schema do Supabase.
-- Este script apenas insere os dados, usando a estrutura correta.

-- Nota: A tabela cidades possui ~5564 registros.
-- Devido ao tamanho, os dados serão inseridos em partes.
-- Este é um exemplo com as primeiras cidades de cada estado.
-- Para inserir todos os dados, execute o script completo gerado.

INSERT INTO cidades (id, nome, estado_id, subdominio) VALUES
-- Espírito Santo (estado 8)
(1, 'Afonso Cláudio', 8, 'afonsoclaudioes'),
(2, 'Água Doce do Norte', 8, 'aguadocedonortees'),
(3, 'Águia Branca', 8, 'aguiabrancaes'),
(4, 'Alegre', 8, 'alegrees'),
(5, 'Alfredo Chaves', 8, 'alfredochaveses'),
(7, 'Anchieta', 8, 'anchietaes'),
(8, 'Apiacá', 8, 'apiacaes'),
(9, 'Aracruz', 8, 'aracruzes'),
(10, 'Atilio Vivacqua', 8, 'atiliovivacquaes'),
(11, 'Baixo Guandu', 8, 'baixoguandues'),
(12, 'Barra de São Francisco', 8, 'barradesaofranciscoes'),
(13, 'Boa Esperança', 8, 'boaesperancaes'),
(14, 'Bom Jesus do Norte', 8, 'bomjesusdonortees'),
(15, 'Brejetuba', 8, 'brejetubaes'),
(16, 'Cachoeiro de Itapemirim', 8, 'cachoeirodeitapemirimes'),
(17, 'Cariacica', 8, 'cariacicaes'),
(18, 'Castelo', 8, 'casteloes'),
(19, 'Colatina', 8, 'colatinaes'),
(20, 'Conceição da Barra', 8, 'conceicaodabarraes'),
(21, 'Conceição do Castelo', 8, 'conceicaodocasteloes'),
(22, 'Divino de São Lourenço', 8, 'divinodesaolourencoes'),
(23, 'Domingos Martins', 8, 'domingosmartinses'),
(24, 'Dores do Rio Preto', 8, 'doresdoriopretoes'),
(25, 'Ecoporanga', 8, 'ecoporangaes'),
(26, 'Fundão', 8, 'fundaoes'),
(27, 'Governador Lindenberg', 8, 'governadorlindenberges'),
(28, 'Guaçuí', 8, 'guacuies'),
(29, 'Guarapari', 8, 'guaraparies'),
(30, 'Ibatiba', 8, 'ibatibaes'),
(31, 'Ibiraçu', 8, 'ibiracues'),
(32, 'Ibitirama', 8, 'ibitiramaes'),
(33, 'Iconha', 8, 'iconhaes'),
(34, 'Irupi', 8, 'irupies'),
(35, 'Itaguaçu', 8, 'itaguacues'),
(36, 'Itapemirim', 8, 'itapemirimes'),
(37, 'Itarana', 8, 'itaranaes'),
(38, 'Iúna', 8, 'iunaes'),
(39, 'Jaguaré', 8, 'jaguarees'),
(40, 'Jerônimo Monteiro', 8, 'jeronimomonteiroes'),
(41, 'João Neiva', 8, 'joaoneivaes'),
(42, 'Laranja da Terra', 8, 'laranjadaterraes'),
(43, 'Linhares', 8, 'linhareses'),
(44, 'Mantenópolis', 8, 'mantenopolises'),
(45, 'Marataízes', 8, 'marataizeses'),
(46, 'Marechal Floriano', 8, 'marechalflorianoes'),
(47, 'Marilândia', 8, 'marilandiaes'),
(48, 'Mimoso do Sul', 8, 'mimosodosules'),
(49, 'Montanha', 8, 'montanhaes'),
(50, 'Mucurici', 8, 'mucuricies'),
(51, 'Muniz Freire', 8, 'munizfreirees'),
(52, 'Muqui', 8, 'muquies'),
(53, 'Nova Venécia', 8, 'novaveneciaes'),
(54, 'Pancas', 8, 'pancases'),
(55, 'Pedro Canário', 8, 'pedrocanarioes'),
(56, 'Pinheiros', 8, 'pinheiroses'),
(57, 'Piúma', 8, 'piumaes'),
(58, 'Ponto Belo', 8, 'pontobeloes'),
(59, 'Presidente Kennedy', 8, 'presidentekennedyes'),
(60, 'Rio Bananal', 8, 'riobananales'),
(61, 'Rio Novo do Sul', 8, 'rionovodosules'),
(62, 'Santa Leopoldina', 8, 'santaleopoldinaes'),
(63, 'Santa Maria de Jetibá', 8, 'santamariadejetibaes'),
(64, 'Santa Teresa', 8, 'santateresaes'),
(65, 'São Domingos do Norte', 8, 'saodomingosdonortees'),
(66, 'São Gabriel da Palha', 8, 'saogabrieldapalhaes'),
(67, 'São José do Calçado', 8, 'saojosedocalcadoes'),
(68, 'São Mateus', 8, 'saomateuses'),
(69, 'São Roque do Canaã', 8, 'saoroquedocanaaes'),
(70, 'Serra', 8, 'serraes'),
(71, 'Sooretama', 8, 'sooretamaes'),
(72, 'Vargem Alta', 8, 'vargemaltaes'),
(73, 'Venda Nova do Imigrante', 8, 'vendanovadoimigrantees'),
(74, 'Viana', 8, 'vianaes'),
(75, 'Vila Pavão', 8, 'vilapavaoes'),
(76, 'Vila Valério', 8, 'vilavalerioes'),
(77, 'Vila Velha', 8, 'vilavelhaes'),
(78, 'Vitória', 8, 'vitoriaes'),
-- Acre (estado 1)
(79, 'Acrelândia', 1, 'acrelandiaac'),
(80, 'Assis Brasil', 1, 'assisbrasilac'),
(81, 'Brasiléia', 1, 'brasileiaac'),
(82, 'Bujari', 1, 'bujariac'),
(83, 'Capixaba', 1, 'capixabaac'),
(84, 'Cruzeiro do Sul', 1, 'cruzeirodosulac'),
(85, 'Epitaciolândia', 1, 'epitaciolandiaac'),
(86, 'Feijó', 1, 'feijoac'),
(87, 'Jordão', 1, 'jordaoac'),
(88, 'Mâncio Lima', 1, 'manciolimaac'),
(89, 'Manoel Urbano', 1, 'manoelurbanoac'),
(90, 'Marechal Thaumaturgo', 1, 'marechalthaumaturgoac'),
(91, 'Plácido de Castro', 1, 'placidodecastroac'),
(92, 'Porto Acre', 1, 'portoacreac'),
(93, 'Porto Walter', 1, 'portowalterac'),
(94, 'Rio Branco', 1, 'riobrancoac'),
(95, 'Rodrigues Alves', 1, 'rodriguesalvesac'),
(96, 'Santa Rosa do Purus', 1, 'santarosadopurusac'),
(97, 'Sena Madureira', 1, 'senamadureiraac'),
(98, 'Senador Guiomard', 1, 'senadorguiomardac'),
(99, 'Tarauacá', 1, 'tarauacaac'),
(100, 'Xapuri', 1, 'xapuriac'),
-- Alagoas (estado 2)
(101, 'Água Branca', 2, 'aguabrancaal'),
(102, 'Anadia', 2, 'anadiaal'),
(103, 'Arapiraca', 2, 'arapiracaal'),
(104, 'Atalaia', 2, 'atalaiaal'),
(105, 'Barra de Santo Antônio', 2, 'barradesantoantonioal'),
(106, 'Barra de São Miguel', 2, 'barradesaomiguelal'),
(107, 'Batalha', 2, 'batalhaal'),
(108, 'Belém', 2, 'belemal'),
(109, 'Belo Monte', 2, 'belomonteal'),
(110, 'Boca da Mata', 2, 'bocadamataal'),
(111, 'Branquinha', 2, 'branquinhaal'),
(112, 'Cacimbinhas', 2, 'cacimbinhasal'),
(113, 'Cajueiro', 2, 'cajueiroal'),
(114, 'Campestre', 2, 'campestreal'),
(115, 'Campo Alegre', 2, 'campoalegreal'),
(116, 'Campo Grande', 2, 'campograndeal'),
(117, 'Canapi', 2, 'canapial'),
(118, 'Capela', 2, 'capelaal'),
(119, 'Carneiros', 2, 'carneirosal'),
(120, 'Chã Preta', 2, 'chapretaal'),
(121, 'Coité do Nóia', 2, 'coitedonoiaal'),
(122, 'Colônia Leopoldina', 2, 'colonialeopoldinaal'),
(123, 'Coqueiro Seco', 2, 'coqueirosecoal'),
(124, 'Coruripe', 2, 'coruripeal'),
(125, 'Craíbas', 2, 'craibasal'),
(126, 'Delmiro Gouveia', 2, 'delmirogouveiaal'),
(127, 'Dois Riachos', 2, 'doisriachosal'),
(128, 'Estrela de Alagoas', 2, 'estreladealagoasal'),
(129, 'Feira Grande', 2, 'feiragrandeal'),
(130, 'Feliz Deserto', 2, 'felizdesertoal'),
(131, 'Flexeiras', 2, 'flexeirasal'),
(132, 'Girau do Ponciano', 2, 'giraudoponcianoal'),
(133, 'Ibateguara', 2, 'ibateguaraal'),
(134, 'Igaci', 2, 'igacial'),
(135, 'Igreja Nova', 2, 'igrejanovaal'),
(136, 'Inhapi', 2, 'inhapial'),
(137, 'Jacaré dos Homens', 2, 'jacaredoshomensal'),
(138, 'Jacuípe', 2, 'jacuipeal'),
(139, 'Japaratinga', 2, 'japaratingaal'),
(140, 'Jaramataia', 2, 'jaramataiaal'),
(141, 'Jequiá da Praia', 2, 'jequiadapraiaal'),
(142, 'Joaquim Gomes', 2, 'joaquimgomesal'),
(143, 'Jundiá', 2, 'jundiaal'),
(144, 'Junqueiro', 2, 'junqueiroal'),
(145, 'Lagoa da Canoa', 2, 'lagoadacanoaal'),
(146, 'Limoeiro de Anadia', 2, 'limoeirodeanadiaal'),
(147, 'Maceió', 2, 'maceioal'),
(148, 'Major Isidoro', 2, 'majorisidoroal'),
(149, 'Mar Vermelho', 2, 'marvermelhoal'),
(150, 'Maragogi', 2, 'maragogial'),
(151, 'Maravilha', 2, 'maravilhaal'),
(152, 'Marechal Deodoro', 2, 'marechaldeodoroal'),
(153, 'Maribondo', 2, 'maribondoal'),
(154, 'Mata Grande', 2, 'matagrandeal'),
(155, 'Matriz de Camaragibe', 2, 'matrizdecamaragibeal'),
(156, 'Messias', 2, 'messiasal'),
(157, 'Minador do Negrão', 2, 'minadordonegraoal'),
(158, 'Monteirópolis', 2, 'monteiropolisal'),
(159, 'Murici', 2, 'muricial'),
(160, 'Novo Lino', 2, 'novolinoal'),
(161, 'Olho d`Água das Flores', 2, 'olhodaguadasfloresal'),
(162, 'Olho d`Água do Casado', 2, 'olhodaguadocasadoal'),
(163, 'Olho d`Água Grande', 2, 'olhodaguagrandeal'),
(164, 'Olivença', 2, 'olivencaal'),
(165, 'Ouro Branco', 2, 'ourobrancoal'),
(166, 'Palestina', 2, 'palestinaal'),
(167, 'Palmeira dos Índios', 2, 'palmeiradosindiosal'),
(168, 'Pão de Açúcar', 2, 'paodeacucaral'),
(169, 'Pariconha', 2, 'pariconhaal'),
(170, 'Paripueira', 2, 'paripueiraal'),
(171, 'Passo de Camaragibe', 2, 'passodecamaragibeal'),
(172, 'Paulo Jacinto', 2, 'paulojacintoal'),
(173, 'Penedo', 2, 'penedoal'),
(174, 'Piaçabuçu', 2, 'piacabucual'),
(175, 'Pilar', 2, 'pilaral'),
(176, 'Pindoba', 2, 'pindobaal'),
(177, 'Piranhas', 2, 'piranhasal'),
(178, 'Poço das Trincheiras', 2, 'pocodastrincheirasal'),
(179, 'Porto Calvo', 2, 'portocalvoal'),
(180, 'Porto de Pedras', 2, 'portodepedrasal'),
(181, 'Porto Real do Colégio', 2, 'portorealdocolegioal'),
(182, 'Quebrangulo', 2, 'quebranguloal'),
(183, 'Rio Largo', 2, 'riolargoal'),
(184, 'Roteiro', 2, 'roteiroal'),
(185, 'Santa Luzia do Norte', 2, 'santaluziadonorteal'),
(186, 'Santana do Ipanema', 2, 'santanadoipanemaal'),
(187, 'Santana do Mundaú', 2, 'santanadomundaual'),
(188, 'São Brás', 2, 'saobrasal'),
(189, 'São José da Laje', 2, 'saojosedalajeal'),
(190, 'São José da Tapera', 2, 'saojosedataperaal'),
(191, 'São Luís do Quitunde', 2, 'saoluisdoquitundeal'),
(192, 'São Miguel dos Campos', 2, 'saomigueldoscamposal'),
(193, 'São Miguel dos Milagres', 2, 'saomigueldosmilagresal'),
(194, 'São Sebastião', 2, 'saosebastiaoal'),
(195, 'Satuba', 2, 'satubaal'),
(196, 'Senador Rui Palmeira', 2, 'senadorruipalmeiraal'),
(197, 'Tanque d`Arca', 2, 'tanquedarcaal'),
(198, 'Taquarana', 2, 'taquaranaal'),
(199, 'Teotônio Vilela', 2, 'teotoniovilelaal'),
(200, 'Traipu', 2, 'traipual'),
(201, 'União dos Palmares', 2, 'uniaodospalmaresal'),
(202, 'Viçosa', 2, 'vicosaal'),
-- Amapá (estado 4)
(203, 'Amapá', 4, 'amapaap'),
(204, 'Calçoene', 4, 'calcoeneap'),
(205, 'Cutias', 4, 'cutiasap'),
(206, 'Ferreira Gomes', 4, 'ferreiragomesap'),
(207, 'Itaubal', 4, 'itaubalap'),
(208, 'Laranjal do Jari', 4, 'laranjaldojariap'),
(209, 'Macapá', 4, 'macapaap'),
(210, 'Mazagão', 4, 'mazagaoap'),
(211, 'Oiapoque', 4, 'oiapoqueap'),
(212, 'Pedra Branca do Amaparí', 4, 'pedrabrancadoamapariap'),
(213, 'Porto Grande', 4, 'portograndeap'),
(214, 'Pracuúba', 4, 'pracuubaap'),
(215, 'Santana', 4, 'santanaap'),
(216, 'Serra do Navio', 4, 'serradonavioap'),
(217, 'Tartarugalzinho', 4, 'tartarugalzinhoap'),
(218, 'Vitória do Jari', 4, 'vitoriadojariap'),
-- Amazonas (estado 3)
(219, 'Abaiara', 6, 'abaiarace'),
(5568, 'Juazeiro do Norte', 6, 'juazeirodonortece'),
(5569, 'Barbalha', 6, 'barbalhace'),
(5570, 'Crato', 6, 'cratoce'),
(5571, 'Parauapebas', 14, 'parauapebaspa'),
(5572, 'Curionópolis', 14, 'curionopolispa'),
(5573, 'Zé Doca', 10, 'zedocama')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- TABELA: segmentos
-- ============================================

-- Nota: A tabela segmentos já deve existir no schema do Supabase.
-- Este script apenas insere os dados, usando a estrutura correta.
-- Schema do Supabase: id, nome, icone, status (sem censura)

INSERT INTO segmentos (id, icone, nome, status) VALUES
(1, 'administracao/2023/02/2109050223kcfji1g5hg.png', 'Delivery', 2),
(7, 'administracao/2025/05/2243290525a8be2696i3.jpeg', 'Comércio em Geral', 2),
(8, 'administracao/2025/05/2257290525ajk8giicjc.jpeg', 'Eletrônicos', 2),
(9, 'administracao/2025/05/2301290525bbkijki22g.jpeg', 'Fitnes ', 2),
(10, 'administracao/2025/05/2304290525c0gig94jfk.jpeg', 'Hamburgueria', 1),
(12, NULL, 'Pit stop ', 1),
(13, 'administracao/2025/05/2346290525ac0ig62bkk.jpeg', 'Supermercado ', 2),
(15, 'administracao/2025/05/2235290525e7kcikb0k9.jpeg', 'Celulares ', 2),
(16, 'administracao/2025/05/233529052591dgbd0kf4.jpeg', 'Sex Shop', 2),
(17, 'administracao/2025/05/2317290525egj96d6ghc.jpeg', 'Pizzaria', 2),
(18, 'administracao/2025/05/2145290525fdgeik7jch.jpeg', 'Açaiteria', 2),
(19, 'administracao/2025/05/23422905252eibgh5ibg.jpeg', 'Sorvetes', 2),
(20, 'administracao/2025/05/22552905252beh09djga.jpeg', 'Desposito Construção', 2),
(21, 'administracao/2025/05/2312290525bfab9k0c7k.jpeg', 'Moto peças', 2),
(22, 'administracao/2025/05/2323290525ce2k9eab7g.jpeg', 'Restaurante', 2),
(23, 'administracao/2025/05/22382905250hahk5ddd2.jpeg', 'Churrascaria', 2),
(24, 'administracao/2025/05/2314290525f5ak5ja9ij.jpeg', 'Pet shop ', 2),
(25, NULL, 'Hamburgueria artesanal ', 2),
(26, 'administracao/2025/05/2228290525hh6k1d9bfj.jpeg', 'Artesanato ', 2),
(27, 'administracao/2025/05/2233290525d7aeiaiadj.jpeg', 'Buffet para festa ', 2),
(28, 'administracao/2025/05/2253290525dka0ig7aia.jpeg', 'Depósito água e gás ', 2),
(29, 'administracao/2025/05/2306290525f2ahb4b01g.jpeg', 'Importados ', 2),
(30, 'administracao/2025/05/2308290525bhd0h5i6k3.jpeg', 'Marmitaria', 2),
(31, 'administracao/2025/05/2248290525d413dfijc6.jpeg', 'Comprei da China ', 2),
(32, 'administracao/2025/05/2325290525gi0bd3719a.jpeg', 'Roupas e acessórios ', 2),
(33, NULL, 'Farmácia', 2),
(34, NULL, 'Cosméticos', 2),
(35, NULL, 'ALIMENTOS', 2),
(36, NULL, 'Calçados', 2)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- TABELA: planos
-- ============================================

-- Nota: A tabela planos já deve existir no schema do Supabase.
-- Schema do Supabase: id, nome, descricao, duracao_meses, duracao_dias,
-- valor_total, valor_mensal, limite_produtos, funcionalidade_disparador,
-- funcionalidade_marketplace, funcionalidade_variacao, funcionalidade_banners,
-- visible, status, ordem

INSERT INTO planos (id, nome, descricao, duracao_meses, duracao_dias, valor_total, valor_mensal, limite_produtos, funcionalidade_disparador, funcionalidade_marketplace, funcionalidade_variacao, funcionalidade_banners, visible, status, ordem) VALUES
(0, 'administracao/2020/10/1108061020kfab3jdagi.png', 'Plano Grátis ', 'Banner Promocional
- Cadastre Produtos Ilimitados
- Link o INSTAGRAM da sua loja
- URL Própria (Opcional)
- Variação de produtos
- Receba pedidos Ilimitados
- Compartilhamento de produtos no WhatsApp
- Loja conectada com Facebook, Instagram e WhatsApp
- Receba pedidos no WhatsApp
- Números de WhatsApp do seus clientes
- Painel de Pedidos completo
- Controle de Estoque do produto
- Personalize como quiser
- Suporte pelo WhatsApp
- QR-Code da sua Loja
- Cupons de Desconto ilimitados
- Impressão dos Pedidos
- Pagamentos Via PIX
- Pagamentos Via Cartão
- Aplicativo PWA da sua loja
- Cadastre Formas de entrega
NOVIDADES DO SISTEMA:
- Pagamento integrado (Mercado Pago)
- PDV completo
- Marketplace incluso no painel administrativo
- API Melhor envio para lojistas facilitada
- Código de rastreio automático
- Novo layout moderno e intuitivo', '', '0', '7', 0.00, 0.00, '', '1. OBJETO

1.1. Pelo presente contrato, o Usuário adere ao "Plano Grátis" da Ilinkbio gerenciado pela empresa Gestalt Marketing e Tecnologia, cujo objeto final é a utilização do "Plano Mensal" durante o período de "07" dias.

1.2. Serão oferecidas neste plano 100% das funcionalidades do sistema sem nenhum tipo de limitação ou custo adicional.

2. DADOS CADASTRAIS, PREÇO E FORMAS DE PAGAMENTO

2.1. O Usuário declara e garante possuir capacidade jurídica para celebrar este contrato e se compromete a manter seus dados pessoais informados no cadastro devidamente atualizados junto a Ilinkbio, principalmente o CPF/CNPJ, e-mail e o contato telefônico.

2.2. O Usuário poderá optar entre as formas de pagamento distintas: Boleto, Cartão de crédito ou PIX.

2.3. Caso a cobrança seja feita por boleto bancário, o tempo de processamento do boleto pode ser de até 3 dias úteis. Aos finais de semana e feriados não ocorre processamento do boleto, por isso, o processamento será feita no próximo dia útil.

2.4. Caso a cobrança seja efetuada por cartão de crédito ou pix, o tempo para processamento do pagamento irá variar de acordo a o prazo de verificação da operadora.

2.4.1. Caso a cobrança no cartão de crédito seja rejeitada por qualquer motivo ou ocorra algum erro referente ao valor debitado, poderão ser realizadas novas tentativas de cobranças nos dias seguintes.

3. REGRAS E PRAZOS - ATUAL

3.1. A Ilinkbio só ativará o plano ao Usuário depois de confirmado o pagamento da respectiva cobrança via cartão de crédito, pix ou boleto bancário.

3.2. O prazo de entrega será de no máximo 48 horas após confirmação do pagamento.

4. DA SUSPENSÃO E DO CANCELAMENTO 

4.1. Em caso de impossibilidade de lançamento da cobrança do plano por culpa do Usuário, a Ilinkbio irá suspender automaticamente o plano, até que seja regularizada a pendência.

4.2. Em caso de estorno ou bloqueio do pagamento o plano será automaticamente cancelado.

5 VIGÊNCIA E RESCISÃO IMOTIVADA

5.1. Este contrato é celebrado por prazo de "30" dias, entrando em vigor na data de sua aprovação eletrônica, que se dá pela efetivação do cadastro dos dados pessoais, de contato e de cobrança do cartão de crédito do Usuário no site da Ilinkbio , ou, no caso de optante por boleto bancário, no momento em que efetuado o pagamento antecipado.

5.2. O Usuário terá o direito de usar o serviço durante todo o período escolhido, não sendo a loja / catálogo obrigado a restituir quantias pagas, caso o Usuário desista do serviço contratado durante a vigência do contrato.

6. DISPOSIÇÕES FINAIS

6.1. A Ilinkbio reserva-se ao direito de, a seu critério e a qualquer tempo, modificar, adicionar ou remover quaisquer itens ou condições deste "Plano Light", comunicando ao Usuário, previamente, por e-mail e mediante publicação em suas redes sociais, com antecedência mínima de 10 dias.

6.2. Qualquer espécie de campanha promocional e seus regulamentos, tais como cupons de desconto e preços promocionais de planos, ou programas de benefícios adicionais oferecidos aos Usuários, serão divulgados separadamente e terão vigência de acordo com as regras neles estipuladas.

6.3. A Ilinkbio compromete-se a manter serviço adequado e eficaz de atendimento pelo endereço (https://ilinkbio.com.br) e e-mail (contato@ilinkbio.com.br), possibilitando ao Usuário a resolução de demandas referentes a informações, dúvidas e reclamações.

6.4. A POLÍTICA DE PRIVACIDADE E SEGURANÇA é parte integrante deste contrato, e as partes contratantes comprometem-se a cumpri-lo.

6.5. As partes elegem o foro da cidade de Parauapebas-PA, para dirimir quaisquer dúvidas ou litígios relacionados a este termo, renunciando a qualquer outro p', '1', '1', '1', 0, '1', '1', '0', '999'),
(1, 'administracao/2020/10/1108061020fkfghkg74i.png', 'Plano Trimestral', 'Banner Promocional
- Cadastre Produtos Ilimitados
- Link o INSTAGRAM da sua loja
- URL Própria (Opcional)
- Variação de produtos
- Receba pedidos Ilimitados
- Compartilhamento de proutos no WhatsApp
- Loja conectada com Facebook, Instagram e WhatsApp
- Receba pedidos no WhatsApp
- Números de WhatsApp do seus clientes
- Painel de Pedidos completo
- Controle de Estoque do produto
- Personalize como quiser
- Suporte pelo WhatsApp
- QR-Code da sua Loja
- Cupons de Desconto ilimitados
- Impressão dos Pedidos
- Pagamentos Via PIX
- Pagamentos Via Cartão
- Aplicativo PWA da sua loja
- Cadastre Formas de entrega
NOVIDADES DO SISTEMA:
- Pagamento intgrado (Mercado Pago)
- PDV compleo
- Marketplac incluso no painel administrativo
- API Melhor envio para loisica faciliada
- Código de rastreio automático
- Novo layout moderno e intuitivo', '', '3', '90', 147.00, 49.00, '', '1. OBJETO

1.1. Pelo presente contrato, o Usuário adere ao "Plano Trimestral" da Ilinkbio gerenciado pela empresa Gestalt Marketing e Tecnologia, cujo objeto final é a utilização do "Plano Mensal" durante o período de "90" dias.

1.2. Serão oferecidas neste plano 100% das funcionalidades do sistema sem nenhum tipo de limitação ou custo adicional.

2. DADOS CADASTRAIS, PREÇO E FORMAS DE PAGAMENTO

2.1. O Usuário declara e garante possuir capacidade jurídica para celebrar este contrato e se compromete a manter seus dados pessoais informados no cadastro devidamente atualizados junto a Ilinkbio, principalmente o CPF/CNPJ, e-mail e o contato telefônico.

2.2. O Usuário poderá optar entre as formas de pagamento distintas: Boleto, Cartão de crédito ou PIX.

2.3. Caso a cobrança seja feita por boleto bancário, o tempo de processamento do boleto pode ser de até 3 dias úteis. Aos finais de semana e feriados não ocorre processamento do boleto, por isso, o processamento será feita no próximo dia útil.

2.4. Caso a cobrança seja efetuada por cartão de crédito ou pix, o tempo para processamento do pagamento irá variar de acordo a o prazo de verificação da operadora.

2.4.1. Caso a cobrança no cartão de crédito seja rejeitada por qualquer motivo ou ocorra algum erro referente ao valor debitado, poderão ser realizadas novas tentativas de cobranças nos dias seguintes.

3. REGRAS E PRAZOS - ATUAL

3.1. A Ilinkbio só ativará o plano ao Usuário depois de confirmado o pagamento da respectiva cobrança via cartão de crédito, pix ou boleto bancário.

3.2. O prazo de entrega será de no máximo 48 horas após confirmação do pagamento.

4. DA SUSPENSÃO E DO CANCELAMENTO 

4.1. Em caso de impossibilidade de lançamento da cobrança do plano por culpa do Usuário, a Ilinkbio irá suspender automaticamente o plano, até que seja regularizada a pendência.

4.2. Em caso de estorno ou bloqueio do pagamento o plano será automaticamente cancelado.

5 VIGÊNCIA E RESCISÃO IMOTIVADA

5.1. Este contrato é celebrado por prazo de "30" dias, entrando em vigor na data de sua aprovação eletrônica, que se dá pela efetivação do cadastro dos dados pessoais, de contato e de cobrança do cartão de crédito do Usuário no site da Ilinkbio , ou, no caso de optante por boleto bancário, no momento em que efetuado o pagamento antecipado.

5.2. O Usuário terá o direito de usar o serviço durante todo o período escolhido, não sendo a loja / catálogo obrigado a restituir quantias pagas, caso o Usuário desista do serviço contratado durante a vigência do contrato.

6. DISPOSIÇÕES FINAIS

6.1. A Ilinkbio reserva-se ao direito de, a seu critério e a qualquer tempo, modificar, adicionar ou remover quaisquer itens ou condições deste "Plano Light", comunicando ao Usuário, previamente, por e-mail e mediante publicação em suas redes sociais, com antecedência mínima de 10 dias.

6.2. Qualquer espécie de campanha promocional e seus regulamentos, tais como cupons de desconto e preços promocionais de planos, ou programas de benefícios adicionais oferecidos aos Usuários, serão divulgados separadamente e terão vigência de acordo com as regras neles estipuladas.

6.3. A Ilinkbio compromete-se a manter serviço adequado e eficaz de atendimento pelo endereço (https://ilinkbio.com.br) e e-mail (contato@ilinkbio.com.br), possibilitando ao Usuário a resolução de demandas referentes a informações, dúvidas e reclamações.

6.4. A POLÍTICA DE PRIVACIDADE E SEGURANÇA é parte integrante deste contrato, e as partes contratantes comprometem-se a cumpri-lo.

6.5. As partes elegem o foro da cidade de Parauapebas-PA, para dirimir quaisquer dúvidas ou litígios relacionados a este termo, renunciando a qualquer outro por mais privilegiado que seja.', '1', '1', '1', 0, '1', '1', '2', '999'),
(3, 'administracao/2020/10/110706102079ejejajh4.png', 'Plano Anual', 'Banner Promocional
- Cadastre Produtos Ilimitados
- Link o INSTAGRAM da sua loja
- URL Própria (Opcional)
- Variação de produtos
- Receba pedidos Ilimitados
- Compartilhamento de proutos no WhatsApp
- Loja conectada com Facebook, Instagram e WhatsApp
- Receba pedidos no WhatsApp
- Números de WhatsApp do seus clientes
- Painel de Pedidos completo
- Controle de Estoque do produto
- Personalize como quiser
- Suporte pelo WhatsApp
- QR-Code da sua Loja
- Cupons de Desconto ilimitados
- Impressão dos Pedidos
- Pagamentos Via PIX
- Pagamentos Via Cartão
- Aplicativo PWA da sua loja
- Cadastre Formas de entrega
NOVIDADES DO SISTEMA:
- Pagamento intgrado (Mercado Pago)
- PDV compleo
- Marketplac incluso no painel administrativo
- API Melhor envio para loisica faciliada
- Codigo de rastreio automático
- Novo layout moderno e intuitivo', '', '12', '365', 290.00, 29.00, '', '1. OBJETO

1.1. Pelo presente contrato, o Usuário adere ao "Plano Anual" da Ilinkbio gerenciado pela empresa Gestalt Marketing e Tecnologia, cujo objeto final é a utilização do "Plano Mensal" durante o período de "365" dias.

1.2. Serão oferecidas neste plano 100% das funcionalidades do sistema sem nenhum tipo de limitação ou custo adicional.

2. DADOS CADASTRAIS, PREÇO E FORMAS DE PAGAMENTO

2.1. O Usuário declara e garante possuir capacidade jurídica para celebrar este contrato e se compromete a manter seus dados pessoais informados no cadastro devidamente atualizados junto a Ilinkbio, principalmente o CPF/CNPJ, e-mail e o contato telefônico.

2.2. O Usuário poderá optar entre as formas de pagamento distintas: Boleto, Cartão de crédito ou PIX.

2.3. Caso a cobrança seja feita por boleto bancário, o tempo de processamento do boleto pode ser de até 3 dias úteis. Aos finais de semana e feriados não ocorre processamento do boleto, por isso, o processamento será feita no próximo dia útil.

2.4. Caso a cobrança seja efetuada por cartão de crédito ou pix, o tempo para processamento do pagamento irá variar de acordo a o prazo de verificação da operadora.

2.4.1. Caso a cobrança no cartão de crédito seja rejeitada por qualquer motivo ou ocorra algum erro referente ao valor debitado, poderão ser realizadas novas tentativas de cobranças nos dias seguintes.

3. REGRAS E PRAZOS - ATUAL

3.1. A Ilinkbio só ativará o plano ao Usuário depois de confirmado o pagamento da respectiva cobrança via cartão de crédito, pix ou boleto bancário.

3.2. O prazo de entrega será de no máximo 48 horas após confirmação do pagamento.

4. DA SUSPENSÃO E DO CANCELAMENTO 

4.1. Em caso de impossibilidade de lançamento da cobrança do plano por culpa do Usuário, a Ilinkbio irá suspender automaticamente o plano, até que seja regularizada a pendência.

4.2. Em caso de estorno ou bloqueio do pagamento o plano será automaticamente cancelado.

5 VIGÊNCIA E RESCISÃO IMOTIVADA

5.1. Este contrato é celebrado por prazo de "30" dias, entrando em vigor na data de sua aprovação eletrônica, que se dá pela efetivação do cadastro dos dados pessoais, de contato e de cobrança do cartão de crédito do Usuário no site da Ilinkbio , ou, no caso de optante por boleto bancário, no momento em que efetuado o pagamento antecipado.

5.2. O Usuário terá o direito de usar o serviço durante todo o período escolhido, não sendo a loja / catálogo obrigado a restituir quantias pagas, caso o Usuário desista do serviço contratado durante a vigência do contrato.

6. DISPOSIÇÕES FINAIS

6.1. A Ilinkbio reserva-se ao direito de, a seu critério e a qualquer tempo, modificar, adicionar ou remover quaisquer itens ou condições deste "Plano Light", comunicando ao Usuário, previamente, por e-mail e mediante publicação em suas redes sociais, com antecedência mínima de 10 dias.

6.2. Qualquer espécie de campanha promocional e seus regulamentos, tais como cupons de desconto e preços promocionais de planos, ou programas de benefícios adicionais oferecidos aos Usuários, serão divulgados separadamente e terão vigência de acordo com as regras neles estipuladas.

6.3. A Ilinkbio compromete-se a manter serviço adequado e eficaz de atendimento pelo endereço (https://ilinkbio.com.br) e e-mail (contato@ilinkbio.com.br), possibilitando ao Usuário a resolução de demandas referentes a informações, dúvidas e reclamações.

6.4. A POLÍTICA DE PRIVACIDADE E SEGURANÇA é parte integrante deste contrato, e as partes contratantes comprometem-se a cumpri-lo.

6.5. As partes elegem o foro da cidade de Parauapebas-PA, para dirimir quaisquer dúvidas ou litígios relacionados a este termo, renunciando a qualquer outro p', '1', '1', '1', 0, '1', '1', '3', '999'),
(11, NULL, 'Plano Mensal', 'Banner Promocional
- Cadastre Produtos Ilimitados
- Link o INSTAGRAM da sua loja
- URL Própria (Opcional)
- Variação de produtos
- Receba pedidos Ilimitados
- Compartilhamento de produtos no WhatsApp
- Loja conectada com Facebook, Instagram e WhatsApp
- Receba pedidos no WhatsApp
- Números de WhatsApp do seus clientes
- Painel de Pedidos completo
- Controle de Estoque do produto
- Personalize como quiser
- Suporte pelo WhatsApp
- QR-Code da sua Loja
- Cupons de Desconto ilimitados
- Impressão dos Pedidos
- Pagamentos Via PIX
- Pagamentos Via Cartão
- Aplicativo PWA da sua loja
- Cadastre Formas de entrega
NOVIDADES DO SISTEMA:
- Pagamento integrado (Mercado Pago)
- PDV completo
- Marketplace incluso no painel administrativo
- API Melhor envio para lojistas facilitada
- Código de rastreio automático
- Novo layout moderno e intuitivo', '', '1', '30', 69.00, 69.00, '', '1. OBJETO

1.1. Pelo presente contrato, o Usuário adere ao "Plano Mensal" da Ilinkbio gerenciado pela empresa Gestalt Marketing e Tecnologia, cujo objeto final é a utilização do "Plano Mensal" durante o período de "30" dias.

1.2. Serão oferecidas neste plano 100% das funcionalidades do sistema sem nenhum tipo de limitação ou custo adicional.

2. DADOS CADASTRAIS, PREÇO E FORMAS DE PAGAMENTO

2.1. O Usuário declara e garante possuir capacidade jurídica para celebrar este contrato e se compromete a manter seus dados pessoais informados no cadastro devidamente atualizados junto a Ilinkbio, principalmente o CPF/CNPJ, e-mail e o contato telefônico.

2.2. O Usuário poderá optar entre as formas de pagamento distintas: Boleto, Cartão de crédito ou PIX.

2.3. Caso a cobrança seja feita por boleto bancário, o tempo de processamento do boleto pode ser de até 3 dias úteis. Aos finais de semana e feriados não ocorre processamento do boleto, por isso, o processamento será feita no próximo dia útil.

2.4. Caso a cobrança seja efetuada por cartão de crédito ou pix, o tempo para processamento do pagamento irá variar de acordo a o prazo de verificação da operadora.

2.4.1. Caso a cobrança no cartão de crédito seja rejeitada por qualquer motivo ou ocorra algum erro referente ao valor debitado, poderão ser realizadas novas tentativas de cobranças nos dias seguintes.

3. REGRAS E PRAZOS - ATUAL

3.1. A Ilinkbio só ativará o plano ao Usuário depois de confirmado o pagamento da respectiva cobrança via cartão de crédito, pix ou boleto bancário.

3.2. O prazo de entrega será de no máximo 48 horas após confirmação do pagamento.

4. DA SUSPENSÃO E DO CANCELAMENTO 

4.1. Em caso de impossibilidade de lançamento da cobrança do plano por culpa do Usuário, a Ilinkbio irá suspender automaticamente o plano, até que seja regularizada a pendência.

4.2. Em caso de estorno ou bloqueio do pagamento o plano será automaticamente cancelado.

5 VIGÊNCIA E RESCISÃO IMOTIVADA

5.1. Este contrato é celebrado por prazo de "30" dias, entrando em vigor na data de sua aprovação eletrônica, que se dá pela efetivação do cadastro dos dados pessoais, de contato e de cobrança do cartão de crédito do Usuário no site da Ilinkbio , ou, no caso de optante por boleto bancário, no momento em que efetuado o pagamento antecipado.

5.2. O Usuário terá o direito de usar o serviço durante todo o período escolhido, não sendo a loja / catálogo obrigado a restituir quantias pagas, caso o Usuário desista do serviço contratado durante a vigência do contrato.

6. DISPOSIÇÕES FINAIS

6.1. A Ilinkbio reserva-se ao direito de, a seu critério e a qualquer tempo, modificar, adicionar ou remover quaisquer itens ou condições deste "Plano Light", comunicando ao Usuário, previamente, por e-mail e mediante publicação em suas redes sociais, com antecedência mínima de 10 dias.

6.2. Qualquer espécie de campanha promocional e seus regulamentos, tais como cupons de desconto e preços promocionais de planos, ou programas de benefícios adicionais oferecidos aos Usuários, serão divulgados separadamente e terão vigência de acordo com as regras neles estipuladas.

6.3. A Ilinkbio compromete-se a manter serviço adequado e eficaz de atendimento pelo endereço (https://ilinkbio.com.br) e e-mail (contato@ilinkbio.com.br), possibilitando ao Usuário a resolução de demandas referentes a informações, dúvidas e reclamações.

6.4. A POLÍTICA DE PRIVACIDADE E SEGURANÇA é parte integrante deste contrato, e as partes contratantes comprometem-se a cumpri-lo.

6.5. As partes elegem o foro da cidade de Parauapebas-PA, para dirimir quaisquer dúvidas ou litígios relacionados a este termo, renunciando a qualquer outro p', '1', '1', '1', 0, '1', '1', '0', '20')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- FIM DA PARTE 1
-- ============================================
