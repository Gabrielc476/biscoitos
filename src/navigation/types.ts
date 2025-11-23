// src/navigation/types.ts
import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// --- Parâmetros das Stacks Internas ---

export type PdvStackParamList = {
  PdvCatalog: undefined; // Tela de catálogo não recebe parâmetros
};

export type AdminStackParamList = {
  AdminHistory: undefined;
  AdminProductList: undefined;
  AdminCreateProduct: undefined;
  // Ex: AdminProductDetails: { productId: string }; (quando criarmos)
};

export type MainTabsParamList = {
  Pdv: NavigatorScreenParams<PdvStackParamList>; // Aba PDV (é uma Stack)
  Admin: NavigatorScreenParams<AdminStackParamList>; // Aba Admin (é uma Stack)
};

// --- Parâmetros da Stack Principal (Root) ---

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabsParamList>; // As abas principais
  
  // Telas do Modal de Checkout
  PaymentOptions: {
    vendaId: string;
    totalFormatado: string;
  };

  // Nova tela (Modal)
  CartDetails: undefined;
};

// --- Tipos para Props das Telas ---
// Isso nos dá o 'navigation' e 'route' tipados em cada tela

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AdminStackScreenProps<T extends keyof AdminStackParamList> =
  NativeStackScreenProps<AdminStackParamList, T>;
  
// (Pode adicionar o PdvStackScreenProps se precisar)