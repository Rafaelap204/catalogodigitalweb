#!/usr/bin/env python3
"""
Script para importar dados do MySQL (JSON) para o Supabase
Execute: python3 importar_supabase.py
"""

import json
import requests
import time
import sys

# ============================================
# CONFIGURAÇÕES - PREENCHA AQUI
# ============================================
SUPABASE_URL = "https://SEU-PROJETO.supabase.co"  # Substitua pelo seu
SUPABASE_KEY = "sua-anon-key-aqui"                # Substitua pela sua
# ============================================

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}


def limpar_dados(tabela, registro):
    """Limpa e ajusta dados para o formato do Supabase"""
    
    # Remove campos que não existem no Supabase ou são gerados automaticamente
    campos_remover = []
    
    # Limpar valores nulos e vazios
    for key in list(registro.keys()):
        if registro[key] is None or registro[key] == '':
            # Converter strings vazias para None (null no JSON)
            registro[key] = None
    
    return registro


def inserir_lote(tabela, registros, lote_tamanho=100):
    """Insere dados em lotes para evitar timeout"""
    total = len(registros)
    inseridos = 0
    erros = 0
    
    print(f"\n📦 {tabela}")
    print(f"   Total: {total} registros")
    
    for i in range(0, total, lote_tamanho):
        lote = registros[i:i + lote_tamanho]
        
        # Limpar dados do lote
        lote_limpo = [limpar_dados(tabela, r) for r in lote]
        
        try:
            response = requests.post(
                f"{SUPABASE_URL}/rest/v1/{tabela}",
                headers=headers,
                json=lote_limpo,
                timeout=30
            )
            
            if response.status_code in [200, 201]:
                inseridos += len(lote)
                print(f"   ✓ {inseridos}/{total}", end='\r')
            else:
                erros += len(lote)
                print(f"\n   ✗ Erro HTTP {response.status_code}: {response.text[:100]}")
                
        except Exception as e:
            erros += len(lote)
            print(f"\n   ✗ Erro: {str(e)[:100]}")
        
        # Pausa para não sobrecarregar a API
        time.sleep(0.2)
    
    print(f"\n   ✅ Concluído: {inseridos} inseridos, {erros} erros")
    return inseridos, erros


def main():
    print("=" * 60)
    print("🚀 IMPORTAÇÃO MYSQL → SUPABASE")
    print("=" * 60)
    
    # Verificar configurações
    if "SEU-PROJETO" in SUPABASE_URL or "sua-anon-key" in SUPABASE_KEY:
        print("\n⚠️  ERRO: Configure o SUPABASE_URL e SUPABASE_KEY no script!")
        print("   Edite o arquivo e substitua pelos valores do seu projeto.")
        sys.exit(1)
    
    # Carregar dados exportados
    try:
        with open('dados_mysql_exportados.json', 'r', encoding='utf-8') as f:
            dados = json.load(f)
        print(f"\n📂 Arquivo carregado: dados_mysql_exportados.json")
    except FileNotFoundError:
        print("\n⚠️  ERRO: Arquivo 'dados_mysql_exportados.json' não encontrado!")
        print("   Execute primeiro: php exportar_mysql.php")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"\n⚠️  ERRO: JSON inválido - {e}")
        sys.exit(1)
    
    # Ordem de importação (respeita dependências de FK)
    ordem = [
        ('estados', 'estados'),
        ('cidades', 'cidades'),
        ('segmentos', 'segmentos'),
        ('planos', 'planos'),
        ('users', 'users'),
        ('users_data', 'users_data'),
        ('estabelecimentos', 'estabelecimentos'),
        ('categorias', 'categorias'),
        ('produtos', 'produtos'),
        ('pedidos', 'pedidos'),
        ('assinaturas', 'assinaturas'),
        ('banners', 'banners'),
        ('cupons', 'cupons'),
        ('vouchers', 'vouchers'),
        ('subdominios', 'subdominios'),
        ('frete', 'frete'),
        ('midia', 'midia'),
        ('agendamentos', 'agendamentos'),
        ('pagamentos', 'pagamentos'),
        ('link', 'link'),
        ('logs', 'logs')
    ]
    
    estatisticas = {}
    total_inseridos = 0
    
    for chave_json, nome_tabela in ordem:
        if chave_json in dados and dados[chave_json]:
            inseridos, erros = inserir_lote(nome_tabela, dados[chave_json])
            estatisticas[nome_tabela] = {
                'total': len(dados[chave_json]),
                'inseridos': inseridos,
                'erros': erros
            }
            total_inseridos += inseridos
        else:
            print(f"\n⏭️  {nome_tabela}: sem dados")
    
    # Resumo final
    print("\n" + "=" * 60)
    print("📊 RESUMO DA MIGRAÇÃO")
    print("=" * 60)
    print(f"{'Tabela':<25} | {'Total':>7} | {'✓ OK':>7} | {'✗ Erro':>7}")
    print("-" * 60)
    
    for tabela, stats in estatisticas.items():
        print(f"{tabela:<25} | {stats['total']:>7} | {stats['inseridos']:>7} | {stats['erros']:>7}")
    
    print("=" * 60)
    print(f"Total geral: {total_inseridos} registros migrados")
    print("=" * 60)
    print("\n✅ Importação concluída!")
    print("\nPróximos passos:")
    print("1. Verifique os dados no dashboard do Supabase")
    print("2. Configure Row Level Security (RLS) nas tabelas")
    print("3. Atualize seu código PHP para usar o Supabase")


if __name__ == "__main__":
    main()