// src/navigation/types.ts
import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// --- Parâmetros das Stacks Internas ---

export type PdvStackParamList = {
  PdvCatalog: undefined;
};

export type AdminStackParamList = {
  AdminHistory: undefined;
  AdminProductList: undefined;
  AdminCreateProduct: undefined;
  AdminOrders: undefined; // [NOVO] Lista de Encomendas
  AdminCreateOrder: undefined; // [NOVO] Criar Encomenda
};

export type MainTabsParamList = {
  Pdv: NavigatorScreenParams<PdvStackParamList>;
  Admin: NavigatorScreenParams<AdminStackParamList>;
};

// --- Parâmetros da Stack Principal (Root) ---

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabsParamList>;

  PaymentOptions: {
    vendaId: string;
    totalFormatado: string;
  };

  CartDetails: undefined;

  // [NOVO] Detalhes da Encomenda (Modal)
  OrderDetails: {
    orderId: string;
  };
};

// --- Tipos para Props das Telas ---

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AdminStackScreenProps<T extends keyof AdminStackParamList> =
  NativeStackScreenProps<AdminStackParamList, T>;