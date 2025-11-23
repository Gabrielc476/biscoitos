// src/constants/theme.ts

export const colors = {
  // Papel e Fundo
  parchment: '#FBF8F0', // Fundo de papel creme

  // Texto e Tinta
  chocolate: '#6F4E37', // Texto principal
  mutedBrown: '#A68B73',  // Texto secundário

  // Biscoito (Ações)
  cookieGold: '#D4A77A',  // Botões principais

  // Acentos
  jamAccent: '#C06C84',   // "Washi tape", destaques, badges
};

export const fonts = {
  // Você precisará baixar e adicionar os arquivos .ttf em src/assets/fonts
  heading: 'Kalam_700Bold', // Exemplo (precisa do nome exato pós-load)
  body: 'Nunito_400Regular',  // Exemplo
};

export const theme = {
  colors,
  fonts,
};

// Este tipo é para o Styled Components
export type AppTheme = typeof theme;