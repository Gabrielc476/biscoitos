// /src/domain/entities/promocao.entity.ts

/**
 * Tipos de promoção que o sistema suporta.
 * (Pode ser expandido no futuro).
 */
export enum TipoPromocao {
  /** Ex: Leve 2 (condicao_minimoItens) por R$ 10,00 (acao_precoFixoEmCentavos) */
  LEVE_X_PAGUE_Y_PRECO_FIXO = 'LEVE_X_PAGUE_Y_PRECO_FIXO',

  /** Ex: 10% (acao_percentualDesconto) de desconto */
  PERCENTUAL_DESCONTO = 'PERCENTUAL_DESCONTO',

  /** Ex: Compre 2 (condicao_minimoItens) e leve 1 (acao_itensGratis) de graça */
  COMPRE_X_LEVE_Y_GRATIS = 'COMPRE_X_LEVE_Y_GRATIS',
}

/**
 * Interface para as propriedades de criação da Promocao.
 * Facilita a passagem de dados para o construtor da entidade.
 */
export interface PromocaoProps {
  id: string;
  nome: string;
  ativa: boolean;
  tipo: TipoPromocao;

  /** Opcional: Limita a promoção a uma categoria específica (ex: "Biscoitos") */
  categoriaAlvo?: string;

  // --- PARÂMETROS DE CONDIÇÃO ---
  /** Quantidade de itens para ativar a promoção (Ex: 2) */
  condicao_minimoItens?: number;

  // --- PARÂMETROS DE AÇÃO ---
  /** (Tipo: LEVE_X_PAGUE_Y_PRECO_FIXO) O preço fixo (em centavos) do "pacote" (Ex: 1000) */
  acao_precoFixoEmCentavos?: number;

  /** (Tipo: PERCENTUAL_DESCONTO) O percentual de desconto (Ex: 10 para 10%) */
  acao_percentualDesconto?: number;

  /** (Tipo: COMPRE_X_LEVE_Y_GRATIS) Quantidade de itens grátis (Ex: 1) */
  acao_itensGratis?: number;
}

/**
 * A entidade Promocao armazena os DADOS de uma regra de negócio.
 * Ela é um "container de configuração" que será lido e interpretado
 * pelo "Motor de Promoções" (que vive na camada de Aplicação).
 */
export class Promocao {
  id: string;
  nome: string;
  ativa: boolean;
  tipo: TipoPromocao;
  categoriaAlvo?: string;
  condicao_minimoItens?: number;
  acao_precoFixoEmCentavos?: number;
  acao_percentualDesconto?: number;
  acao_itensGratis?: number;

  /**
   * O construtor recebe um objeto de propriedades para criar a entidade.
   */
  constructor(props: PromocaoProps) {
    this.id = props.id;
    this.nome = props.nome;
    this.ativa = props.ativa;
    this.tipo = props.tipo;

    // Atribui os campos opcionais
    this.categoriaAlvo = props.categoriaAlvo;
    this.condicao_minimoItens = props.condicao_minimoItens;
    this.acao_precoFixoEmCentavos = props.acao_precoFixoEmCentavos;
    this.acao_percentualDesconto = props.acao_percentualDesconto;
    this.acao_itensGratis = props.acao_itensGratis;
  }

  // --- Lógica de Negócio (ações da própria entidade) ---

  /**
   * Ativa a promoção para que possa ser aplicada.
   */
  ativar(): void {
    this.ativa = true;
  }

  /**
   * Desativa a promoção.
   */
  desativar(): void {
    this.ativa = false;
  }

  /**
   * Valida se a entidade possui os campos mínimos necessários
   * para seu tipo. (Exemplo de lógica de domínio).
   * * @returns true se os parâmetros de ação/condição forem válidos, false caso contrário.
   */
  validarConfiguracao(): boolean {
    if (!this.tipo) return false;

    switch (this.tipo) {
      case TipoPromocao.LEVE_X_PAGUE_Y_PRECO_FIXO:
        // Precisa da quantidade de itens e do preço fixo
        return !!(this.condicao_minimoItens && this.acao_precoFixoEmCentavos);

      case TipoPromocao.PERCENTUAL_DESCONTO:
        // Precisa apenas do percentual
        return !!this.acao_percentualDesconto;

      case TipoPromocao.COMPRE_X_LEVE_Y_GRATIS:
        // Precisa da quantidade de itens e de quantos serão grátis
        return !!(this.condicao_minimoItens && this.acao_itensGratis);

      default:
        // Se o tipo for desconhecido, é inválido
        return false;
    }
  }
}