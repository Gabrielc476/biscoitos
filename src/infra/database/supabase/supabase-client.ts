import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carrega as variáveis de ambiente do arquivo .env
// O path.resolve garante que ele encontre o .env na raiz do projeto
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Verifica se as variáveis de ambiente foram carregadas
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variáveis de ambiente SUPABASE_URL e SUPABASE_KEY não estão definidas.');
}

/**
 * Instância única do cliente Supabase para ser usada
 * em toda a camada de infraestrutura (Repositórios).
 */
export const supabaseClient = createClient(supabaseUrl, supabaseKey);