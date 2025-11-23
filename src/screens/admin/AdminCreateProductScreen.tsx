// src/screens/admin/AdminCreateProductScreen.tsx
import React, { useState } from 'react';
import { ScrollView, TextInput, Alert } from 'react-native';
import styled, { DefaultTheme } from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';

import { PageContainer } from '@/components/design/PageContainer';
import { AppText } from '@/components/design/AppText';
import { LargeButton } from '@/components/design/LargeButton';
import { useCreateProduct } from '@/hooks/useProduct';

type ThemeProps = { theme: DefaultTheme };

// Input Estilizado ("Linha de Caderno")
const InputField = styled(TextInput)`
  font-family: ${(props: ThemeProps) => props.theme.fonts.body};
  font-size: 18px;
  color: ${(props: ThemeProps) => props.theme.colors.chocolate};
  
  border-bottom-width: 1px;
  border-bottom-color: ${(props: ThemeProps) => props.theme.colors.mutedBrown};
  padding: 8px 0;
  margin-bottom: 24px;
`;

const Label = styled(AppText)`
  font-size: 14px;
  color: ${(props: ThemeProps) => props.theme.colors.mutedBrown};
  margin-bottom: 4px;
`;

export const AdminCreateProductScreen = () => {
  const navigation = useNavigation();
  const { mutate: createProduct, isPending } = useCreateProduct();

  // Estados do Formulário
  const [nome, setNome] = useState('');
  const [estoque, setEstoque] = useState('');
  const [precoCusto, setPrecoCusto] = useState('');
  const [precoVenda, setPrecoVenda] = useState('');

  const handleSave = () => {
    // Validação simples
    if (!nome || !estoque || !precoCusto || !precoVenda) {
      Alert.alert('Atenção', 'Preencha todos os campos do formulário.');
      return;
    }

    // Conversão de dados
    // O backend espera centavos (R$ 5,90 -> 590)
    const custoEmCentavos = Math.round(parseFloat(precoCusto.replace(',', '.')) * 100);
    const vendaEmCentavos = Math.round(parseFloat(precoVenda.replace(',', '.')) * 100);
    const qtdEstoque = parseInt(estoque, 10);

    if (isNaN(custoEmCentavos) || isNaN(vendaEmCentavos) || isNaN(qtdEstoque)) {
      Alert.alert('Erro', 'Verifique se os números estão corretos.');
      return;
    }

    // Envia para a API
    createProduct(
      {
        nome,
        quantidadeEstoque: qtdEstoque,
        precoCustoEmCentavos: custoEmCentavos,
        precoVendaEmCentavos: vendaEmCentavos,
      },
      {
        onSuccess: () => {
          Alert.alert('Sucesso', 'Produto cadastrado no estoque!');
          navigation.goBack(); // Volta para a lista
        },
        onError: (error: any) => {
          const msg = error.response?.data?.message || error.message;
          Alert.alert('Erro ao salvar', msg);
        },
      }
    );
  };

  return (
    <PageContainer>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <AppText type="heading" style={{ marginBottom: 32 }}>
          Novo Biscoito
        </AppText>

        <Label>Nome do Produto</Label>
        <InputField 
          placeholder="Ex: Biscoito de Nata" 
          value={nome}
          onChangeText={setNome}
        />

        <Label>Quantidade Inicial em Estoque</Label>
        <InputField 
          placeholder="Ex: 50" 
          keyboardType="number-pad"
          value={estoque}
          onChangeText={setEstoque}
        />

        <Label>Preço de Custo (R$)</Label>
        <InputField 
          placeholder="Ex: 2,50" 
          keyboardType="numeric"
          value={precoCusto}
          onChangeText={setPrecoCusto}
        />

        <Label>Preço de Venda (R$)</Label>
        <InputField 
          placeholder="Ex: 6,00" 
          keyboardType="numeric"
          value={precoVenda}
          onChangeText={setPrecoVenda}
        />

        <LargeButton 
          title="Cadastrar Produto" 
          onPress={handleSave}
          isLoading={isPending}
          style={{ marginTop: 20 }}
        />
        
        <LargeButton 
          title="Cancelar" 
          variant="secondary"
          onPress={() => navigation.goBack()}
        />

      </ScrollView>
    </PageContainer>
  );
};