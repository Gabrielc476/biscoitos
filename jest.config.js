// jest.config.js

module.exports = {
  // Define o 'preset' para o ts-jest
  preset: 'ts-jest',

  // Informa ao Jest que o ambiente de teste é o 'node' (essencial para backend)
  testEnvironment: 'node',

  // Um padrão (glob) que diz ao Jest onde encontrar seus arquivos de teste
  // Este padrão encontra QUALQUER arquivo que termine com .spec.ts
  // em QUALQUER pasta dentro de /src.
  testMatch: ['<rootDir>/src/**/*.spec.ts'],

  // Ignora a pasta node_modules
  testPathIgnorePatterns: ['/node_modules/'],
};