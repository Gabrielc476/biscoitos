import { IProdutoRepositorio } from '../../../domain/repositories/iproduto.repositorio';

interface UploadImagemInputDTO {
    arquivo: {
        buffer: Buffer;
        mimetype: string;
        originalname: string;
    };
}

interface UploadImagemOutputDTO {
    url: string;
}

export class UploadImagemProdutoUseCase {
    constructor(private produtoRepositorio: IProdutoRepositorio) { }

    async executar(input: UploadImagemInputDTO): Promise<UploadImagemOutputDTO> {
        // Gera um nome único para o arquivo: timestamp_nome-original
        const timestamp = Date.now();
        // Remove caracteres especiais do nome original para evitar problemas na URL
        const nomeLimpo = input.arquivo.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        const nomeArquivo = `${timestamp}_${nomeLimpo}`;

        const url = await this.produtoRepositorio.uploadImagem(
            {
                buffer: input.arquivo.buffer,
                mimetype: input.arquivo.mimetype,
            },
            nomeArquivo
        );

        return { url };
    }
}
