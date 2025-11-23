/**
 * Interface genérica para um Caso de Uso (Padrão Command).
 * @template Input DTO de entrada (Input Port).
 * @template Output DTO de saída (Output Port).
 */
export interface IUseCase<Input, Output> {
  /**
   * Executa a lógica de negócio do caso de uso.
   */
  executar(input: Input): Promise<Output> | Output;
}