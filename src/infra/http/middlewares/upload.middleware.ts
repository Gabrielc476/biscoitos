import multer from 'multer';

// Configuração do Multer para armazenar em memória (buffer)
// Isso permite que enviemos o buffer diretamente para o Supabase Storage
const storage = multer.memoryStorage();

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limite de 5MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Apenas imagens são permitidas!'));
        }
    },
});
