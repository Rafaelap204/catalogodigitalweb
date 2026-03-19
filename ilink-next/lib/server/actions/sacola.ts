/**
 * Server Actions para gerenciar a sacola/carrinho
 * A sacola é mantida no localStorage no cliente, mas estas actions
 * auxiliam em operações relacionadas como cálculos de frete, cupons, etc.
 */

'use server';

import { createClient } from '@/lib/supabase/server';

export interface ItemSacola {
  produto_id: number;
  nome: string;
  valor: number;
  quantidade: number;
  imagem?: string;
  variacao_id?: number;
  variacao_nome?: string;
}

export interface DadosSacola {
  items: ItemSacola[];
  estabelecimento_id: number;
  estabelecimentoSubdominio: string;
}

export interface CupomAplicado {
  codigo: string;
  tipo: 'percentual' | 'valor_fixo';
  valor: number;
  desconto: number;
}

interface CupomData {
  codigo: string;
  tipo: 'percentual' | 'valor_fixo';
  valor: number;
  quantidade_uso: number;
  quantidade_usado: number;
  validade?: string;
  status: number;
}

interface EstabelecimentoFrete {
  taxa_delivery?: number;
  minimo_entrega_gratis?: number;
  entrega_entrega_tipo?: number;
  entrega_entrega_valor?: number;
}

interface ProdutoEstoque {
  id: number;
  nome: string;
  estoque: number;
}

/**
 * Calcula o valor total dos itens da sacola
 */
export async function calcularTotalSacola(items: ItemSacola[]): Promise<number> {
  return items.reduce((total, item) => total + item.valor * item.quantidade, 0);
}

/**
 * Valida e aplica um cupom de desconto
 */
export async function aplicarCupom(
  codigo: string,
  estabelecimentoId: number,
  valorTotal: number
): Promise<{ success: boolean; cupom?: CupomAplicado; error?: string }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('cupons')
      .select('*')
      .eq('rel_estabelecimentos_id', estabelecimentoId)
      .eq('codigo', codigo.toUpperCase())
      .eq('status', 1)
      .single();

    if (error || !data) {
      return { success: false, error: 'Cupom não encontrado ou inválido' };
    }

    const cupom = data as unknown as CupomData;

    // Verificar validade
    if (cupom.validade && new Date(cupom.validade) < new Date()) {
      return { success: false, error: 'Cupom expirado' };
    }

    // Verificar quantidade de uso
    if (cupom.quantidade_usado >= cupom.quantidade_uso) {
      return { success: false, error: 'Cupom esgotado' };
    }

    // Calcular desconto
    let desconto = 0;
    if (cupom.tipo === 'percentual') {
      desconto = (valorTotal * cupom.valor) / 100;
    } else {
      desconto = cupom.valor;
    }

    // Garantir que o desconto não seja maior que o valor total
    if (desconto > valorTotal) {
      desconto = valorTotal;
    }

    return {
      success: true,
      cupom: {
        codigo: cupom.codigo,
        tipo: cupom.tipo,
        valor: cupom.valor,
        desconto,
      },
    };
  } catch (error) {
    console.error('Erro ao aplicar cupom:', error);
    return { success: false, error: 'Erro ao processar cupom' };
  }
}

/**
 * Calcula o valor do frete com base no endereço e estabelecimento
 */
export interface DadosFrete {
  cep?: string;
  endereco?: string;
  bairro?: string;
  numero?: string;
  cidade?: string;
  estado?: string;
}

export async function calcularFrete(
  estabelecimentoId: number,
  dados: DadosFrete
): Promise<{ success: boolean; valor?: number; error?: string; gratis?: boolean }> {
  try {
    const supabase = await createClient();

    // Buscar configurações de entrega do estabelecimento
    const { data, error } = await supabase
      .from('estabelecimentos')
      .select('taxa_delivery, minimo_entrega_gratis, entrega_entrega_tipo, entrega_entrega_valor')
      .eq('id', estabelecimentoId)
      .single();

    if (error || !data) {
      return { success: false, error: 'Estabelecimento não encontrado' };
    }

    const estabelecimento = data as unknown as EstabelecimentoFrete;

    // Se o tipo de entrega é fixo, retornar o valor fixo
    if (estabelecimento.entrega_entrega_tipo === 1) {
      return {
        success: true,
        valor: estabelecimento.entrega_entrega_valor || 0,
        gratis: false,
      };
    }

    // Se tem frete grátis acima de determinado valor, verificar
    if (estabelecimento.minimo_entrega_gratis) {
      // O cálculo real seria feito no cliente com o valor atual da sacola
      return {
        success: true,
        valor: estabelecimento.taxa_delivery || 0,
        gratis: false,
      };
    }

    return {
      success: true,
      valor: estabelecimento.taxa_delivery || 0,
      gratis: false,
    };
  } catch (error) {
    console.error('Erro ao calcular frete:', error);
    return { success: false, error: 'Erro ao calcular frete' };
  }
}

/**
 * Verifica disponibilidade de estoque para os itens da sacola
 */
export async function verificarEstoque(
  items: ItemSacola[]
): Promise<{ success: boolean; indisponiveis?: Array<{ produto_id: number; nome: string; estoque: number; quantidade: number }>; error?: string }> {
  try {
    const supabase = await createClient();

    const indisponiveis = [];

    for (const item of items) {
      const { data, error } = await supabase
        .from('produtos')
        .select('id, nome, estoque')
        .eq('id', item.produto_id)
        .single();

      if (error || !data) {
        indisponiveis.push({
          produto_id: item.produto_id,
          nome: item.nome,
          estoque: 0,
          quantidade: item.quantidade,
        });
        continue;
      }

      const produto = data as unknown as ProdutoEstoque;

      if (produto.estoque < item.quantidade) {
        indisponiveis.push({
          produto_id: item.produto_id,
          nome: produto.nome,
          estoque: produto.estoque,
          quantidade: item.quantidade,
        });
      }
    }

    if (indisponiveis.length > 0) {
      return {
        success: false,
        indisponiveis,
        error: 'Alguns produtos estão indisponíveis ou com estoque insuficiente',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao verificar estoque:', error);
    return { success: false, error: 'Erro ao verificar estoque' };
  }
}
