export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number;
          email: string;
          password: string | null;
          nivel: string;
          nome: string | null;
          keepalive: string | null;
          last_login: string | null;
          recover_key: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          email: string;
          password?: string | null;
          nivel?: string;
          nome?: string | null;
          keepalive?: string | null;
          last_login?: string | null;
          recover_key?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          email?: string;
          password?: string | null;
          nivel?: string;
          nome?: string | null;
          keepalive?: string | null;
          last_login?: string | null;
          recover_key?: string | null;
          created_at?: string | null;
        };
      };
      users_data: {
        Row: {
          id: number;
          rel_users_id: number;
          telefone: string | null;
          cidade: number | null;
          estado: number | null;
          endereco: string | null;
          numero: string | null;
          bairro: string | null;
          cep: string | null;
        };
        Insert: {
          id?: number;
          rel_users_id: number;
          telefone?: string | null;
          cidade?: number | null;
          estado?: number | null;
          endereco?: string | null;
          numero?: string | null;
          bairro?: string | null;
          cep?: string | null;
        };
        Update: {
          id?: number;
          rel_users_id?: number;
          telefone?: string | null;
          cidade?: number | null;
          estado?: number | null;
          endereco?: string | null;
          numero?: string | null;
          bairro?: string | null;
          cep?: string | null;
        };
      };
      estabelecimentos: {
        Row: {
          id: number;
          nome: string;
          subdominio: string;
          rel_users_id: number | null;
          cidade_id: number | null;
          estado_id: number | null;
          segmento_id: number | null;
          perfil: string | null;
          capa: string | null;
          descricao: string | null;
          cor: string | null;
          whatsapp: string | null;
          email: string | null;
          endereco: string | null;
          numero: string | null;
          bairro: string | null;
          cep: string | null;
          telefone: string | null;
          status: number | null;
          excluded: boolean | null;
          afiliado: number | null;
          funcionamento: number | null;
          acompanhamento_finalizacao: string | null;
          minimo_entrega_gratis: number | null;
          taxa_delivery: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: number;
          nome: string;
          subdominio: string;
          rel_users_id?: number | null;
          cidade_id?: number | null;
          estado_id?: number | null;
          segmento_id?: number | null;
          perfil?: string | null;
          capa?: string | null;
          descricao?: string | null;
          cor?: string | null;
          whatsapp?: string | null;
          email?: string | null;
          endereco?: string | null;
          numero?: string | null;
          bairro?: string | null;
          cep?: string | null;
          telefone?: string | null;
          status?: number | null;
          excluded?: boolean | null;
          afiliado?: number | null;
          funcionamento?: number | null;
          acompanhamento_finalizacao?: string | null;
          minimo_entrega_gratis?: number | null;
          taxa_delivery?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: number;
          nome?: string;
          subdominio?: string;
          rel_users_id?: number | null;
          cidade_id?: number | null;
          estado_id?: number | null;
          segmento_id?: number | null;
          perfil?: string | null;
          capa?: string | null;
          descricao?: string | null;
          cor?: string | null;
          whatsapp?: string | null;
          email?: string | null;
          endereco?: string | null;
          numero?: string | null;
          bairro?: string | null;
          cep?: string | null;
          telefone?: string | null;
          status?: number | null;
          excluded?: boolean | null;
          afiliado?: number | null;
          funcionamento?: number | null;
          acompanhamento_finalizacao?: string | null;
          minimo_entrega_gratis?: number | null;
          taxa_delivery?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      categorias: {
        Row: {
          id: number;
          rel_estabelecimentos_id: number;
          nome: string;
          ordem: number | null;
          visible: boolean | null;
          status: number | null;
        };
        Insert: {
          id?: number;
          rel_estabelecimentos_id: number;
          nome: string;
          ordem?: number | null;
          visible?: boolean | null;
          status?: number | null;
        };
        Update: {
          id?: number;
          rel_estabelecimentos_id?: number;
          nome?: string;
          ordem?: number | null;
          visible?: boolean | null;
          status?: number | null;
        };
      };
      produtos: {
        Row: {
          id: number;
          rel_estabelecimentos_id: number;
          rel_categorias_id: number | null;
          nome: string;
          descricao: string | null;
          valor: number | null;
          valor_promocional: number | null;
          estoque: number | null;
          posicao: number | null;
          imagem: string | null;
          destaque: boolean | null;
          visible: boolean | null;
          status: number | null;
          last_modified: string | null;
        };
        Insert: {
          id?: number;
          rel_estabelecimentos_id: number;
          rel_categorias_id?: number | null;
          nome: string;
          descricao?: string | null;
          valor?: number | null;
          valor_promocional?: number | null;
          estoque?: number | null;
          posicao?: number | null;
          imagem?: string | null;
          destaque?: boolean | null;
          visible?: boolean | null;
          status?: number | null;
          last_modified?: string | null;
        };
        Update: {
          id?: number;
          rel_estabelecimentos_id?: number;
          rel_categorias_id?: number | null;
          nome?: string;
          descricao?: string | null;
          valor?: number | null;
          valor_promocional?: number | null;
          estoque?: number | null;
          posicao?: number | null;
          imagem?: string | null;
          destaque?: boolean | null;
          visible?: boolean | null;
          status?: number | null;
          last_modified?: string | null;
        };
      };
      pedidos: {
        Row: {
          id: number;
          rel_estabelecimentos_id: number;
          cliente_nome: string | null;
          whatsapp: string | null;
          v_pedido: number | null;
          forma_entrega: string | null;
          valor_frete: number | null;
          endereco: string | null;
          numero: string | null;
          bairro: string | null;
          cidade: string | null;
          estado: string | null;
          cep: string | null;
          complemento: string | null;
          observacoes: string | null;
          cupom: string | null;
          status: number | null;
          comprovante: string | null;
          data: string | null;
        };
        Insert: {
          id?: number;
          rel_estabelecimentos_id: number;
          cliente_nome?: string | null;
          whatsapp?: string | null;
          v_pedido?: number | null;
          forma_entrega?: string | null;
          valor_frete?: number | null;
          endereco?: string | null;
          numero?: string | null;
          bairro?: string | null;
          cidade?: string | null;
          estado?: string | null;
          cep?: string | null;
          complemento?: string | null;
          observacoes?: string | null;
          cupom?: string | null;
          status?: number | null;
          comprovante?: string | null;
          data?: string | null;
        };
        Update: {
          id?: number;
          rel_estabelecimentos_id?: number;
          cliente_nome?: string | null;
          whatsapp?: string | null;
          v_pedido?: number | null;
          forma_entrega?: string | null;
          valor_frete?: number | null;
          endereco?: string | null;
          numero?: string | null;
          bairro?: string | null;
          cidade?: string | null;
          estado?: string | null;
          cep?: string | null;
          complemento?: string | null;
          observacoes?: string | null;
          cupom?: string | null;
          status?: number | null;
          comprovante?: string | null;
          data?: string | null;
        };
      };
      pedidos_itens: {
        Row: {
          id: number;
          rel_pedidos_id: number;
          rel_produtos_id: number;
          produto_nome: string;
          quantidade: number;
          valor_unitario: number;
          valor_total: number;
        };
        Insert: {
          id?: number;
          rel_pedidos_id: number;
          rel_produtos_id: number;
          produto_nome: string;
          quantidade: number;
          valor_unitario: number;
          valor_total: number;
        };
        Update: {
          id?: number;
          rel_pedidos_id?: number;
          rel_produtos_id?: number;
          produto_nome?: string;
          quantidade?: number;
          valor_unitario?: number;
          valor_total?: number;
        };
      };
      planos: {
        Row: {
          id: number;
          nome: string;
          descricao: string | null;
          duracao_meses: number | null;
          duracao_dias: number | null;
          valor_total: number | null;
          valor_mensal: number | null;
          limite_produtos: number | null;
          funcionalidade_disparador: boolean | null;
          funcionalidade_marketplace: boolean | null;
          funcionalidade_variacao: boolean | null;
          funcionalidade_banners: boolean | null;
          visible: boolean | null;
          status: number | null;
          ordem: number | null;
        };
        Insert: {
          id?: number;
          nome: string;
          descricao?: string | null;
          duracao_meses?: number | null;
          duracao_dias?: number | null;
          valor_total?: number | null;
          valor_mensal?: number | null;
          limite_produtos?: number | null;
          funcionalidade_disparador?: boolean | null;
          funcionalidade_marketplace?: boolean | null;
          funcionalidade_variacao?: boolean | null;
          funcionalidade_banners?: boolean | null;
          visible?: boolean | null;
          status?: number | null;
          ordem?: number | null;
        };
        Update: {
          id?: number;
          nome?: string;
          descricao?: string | null;
          duracao_meses?: number | null;
          duracao_dias?: number | null;
          valor_total?: number | null;
          valor_mensal?: number | null;
          limite_produtos?: number | null;
          funcionalidade_disparador?: boolean | null;
          funcionalidade_marketplace?: boolean | null;
          funcionalidade_variacao?: boolean | null;
          funcionalidade_banners?: boolean | null;
          visible?: boolean | null;
          status?: number | null;
          ordem?: number | null;
        };
      };
      assinaturas: {
        Row: {
          id: number;
          rel_planos_id: number | null;
          rel_estabelecimentos_id: number | null;
          afiliado: number | null;
          nome: string | null;
          descricao: string | null;
          comissionamento: string | null;
          duracao_meses: number | null;
          duracao_dias: number | null;
          valor_total: number | null;
          valor_mensal: number | null;
          expiration: string | null;
          gateway_ref: string | null;
          gateway_payment: string | null;
          gateway_transaction: string | null;
          voucher: string | null;
          mode: string | null;
          termos: string | null;
          limite_produtos: number | null;
          funcionalidade_disparador: boolean | null;
          funcionalidade_marketplace: boolean | null;
          funcionalidade_variacao: boolean | null;
          funcionalidade_banners: boolean | null;
          status: number | null;
          used: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          rel_planos_id?: number | null;
          rel_estabelecimentos_id?: number | null;
          afiliado?: number | null;
          nome?: string | null;
          descricao?: string | null;
          comissionamento?: string | null;
          duracao_meses?: number | null;
          duracao_dias?: number | null;
          valor_total?: number | null;
          valor_mensal?: number | null;
          expiration?: string | null;
          gateway_ref?: string | null;
          gateway_payment?: string | null;
          gateway_transaction?: string | null;
          voucher?: string | null;
          mode?: string | null;
          termos?: string | null;
          limite_produtos?: number | null;
          funcionalidade_disparador?: boolean | null;
          funcionalidade_marketplace?: boolean | null;
          funcionalidade_variacao?: boolean | null;
          funcionalidade_banners?: boolean | null;
          status?: number | null;
          used?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          rel_planos_id?: number | null;
          rel_estabelecimentos_id?: number | null;
          afiliado?: number | null;
          nome?: string | null;
          descricao?: string | null;
          comissionamento?: string | null;
          duracao_meses?: number | null;
          duracao_dias?: number | null;
          valor_total?: number | null;
          valor_mensal?: number | null;
          expiration?: string | null;
          gateway_ref?: string | null;
          gateway_payment?: string | null;
          gateway_transaction?: string | null;
          voucher?: string | null;
          mode?: string | null;
          termos?: string | null;
          limite_produtos?: number | null;
          funcionalidade_disparador?: boolean | null;
          funcionalidade_marketplace?: boolean | null;
          funcionalidade_variacao?: boolean | null;
          funcionalidade_banners?: boolean | null;
          status?: number | null;
          used?: number | null;
          created_at?: string | null;
        };
      };
      banners: {
        Row: {
          id: number;
          rel_estabelecimentos_id: number;
          imagem: string;
          link: string | null;
          ordem: number | null;
          visible: boolean | null;
        };
        Insert: {
          id?: number;
          rel_estabelecimentos_id: number;
          imagem: string;
          link?: string | null;
          ordem?: number | null;
          visible?: boolean | null;
        };
        Update: {
          id?: number;
          rel_estabelecimentos_id?: number;
          imagem?: string;
          link?: string | null;
          ordem?: number | null;
          visible?: boolean | null;
        };
      };
      cidades: {
        Row: {
          id: number;
          nome: string;
          estado_id: number | null;
          subdominio: string | null;
        };
        Insert: {
          id?: number;
          nome: string;
          estado_id?: number | null;
          subdominio?: string | null;
        };
        Update: {
          id?: number;
          nome?: string;
          estado_id?: number | null;
          subdominio?: string | null;
        };
      };
      estados: {
        Row: {
          id: number;
          nome: string;
          uf: string;
        };
        Insert: {
          id?: number;
          nome: string;
          uf: string;
        };
        Update: {
          id?: number;
          nome?: string;
          uf?: string;
        };
      };
      segmentos: {
        Row: {
          id: number;
          nome: string;
          icone: string | null;
          status: number | null;
        };
        Insert: {
          id?: number;
          nome: string;
          icone?: string | null;
          status?: number | null;
        };
        Update: {
          id?: number;
          nome?: string;
          icone?: string | null;
          status?: number | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
