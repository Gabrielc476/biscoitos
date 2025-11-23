import { IVendaRepositorio } from '../../../domain/repositories/ivenda.repositorio';
import { IUseCase } from '../../iuse-case.interface';
import { GerarPixVendaInputDTO, GerarPixVendaOutputDTO } from './gerar-pix-venda.dto';
import { StatusVenda } from '../../../domain/entities/venda.entity';
import { staticPix } from 'pix-qrcode';

export class GerarPixVendaUseCase
  implements IUseCase<GerarPixVendaInputDTO, GerarPixVendaOutputDTO>
{
  constructor(private readonly vendaRepo: IVendaRepositorio) {}

  async executar(input: GerarPixVendaInputDTO): Promise<GerarPixVendaOutputDTO> {
    // 1. Buscar a Venda
    const venda = await this.vendaRepo.buscarPorId(input.vendaId);
    if (!venda) {
      throw new Error('Venda não encontrada.');
    }

    // 2. Validar o Status
    if (venda.status !== StatusVenda.PENDENTE) {
      throw new Error('Esta venda já foi paga ou está cancelada.');
    }

    // 3. Buscar "Segredos" do .env
    // [CORREÇÃO 1] Certifique-se que no .env a chave é "+5583981579286"
    const chavePix = process.env.MINHA_CHAVE_PIX; 
    const nome = process.env.NOME_BENEFICIARIO;
    const cidade = process.env.CIDADE_BENEFICIARIO;

    if (!chavePix || !nome || !cidade) {
      throw new Error('Configuração de PIX incompleta no servidor.');
    }

    // 4. Gerar o Payload do Pix
    const valor = (venda.totalFinalEmCentavos / 100).toFixed(2);

    // [CORREÇÃO 2] SANITIZAR O TXID
    // Remova todos os hífens do UUID antes de passá-lo
    const txidSanitizado = venda.id.replace(/-/g, '');

    // 5. Gerar o Payload
    const pix = await staticPix({
      pixKey: chavePix,
      merchant: nome,
      merchantCity: cidade,
      amount: valor,
      // [CORREÇÃO 3] Use o txid sanitizado
      transactionId: txidSanitizado, 
    });

    const payload = pix.payload;

    // 6. Retornar DTO
    return {
      vendaId: venda.id,
      valor: venda.totalFinalEmCentavos,
      pixCopiaECola: payload,
    };
  }
}