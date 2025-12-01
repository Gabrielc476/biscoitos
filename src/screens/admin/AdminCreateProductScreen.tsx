// src/screens/admin/AdminCreateProductScreen.tsx
import React, { useState } from 'react';
import { ScrollView, TextInput, Alert, Image, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import styled, { DefaultTheme } from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { PageContainer } from '@/components/design/PageContainer';
import { AppText } from '@/components/design/AppText';
import { LargeButton } from '@/components/design/LargeButton';
import { useCreateProduct } from '@/hooks/useProduct';
import { uploadProductImage } from '@/services/productsApi';

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

const ImagePickerButton = styled.TouchableOpacity`
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  border-radius: 12px;
  border: 2px dashed #ccc;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  overflow: hidden;
`;

const SelectedImage = styled.Image`
  width: 100%;
  height: 100%;
`;

export const AdminCreateProductScreen = () => {
  const navigation = useNavigation();
  const { mutate: createProduct, isPending } = useCreateProduct();

  // Estados do Formulário
  const [nome, setNome] = useState('');
  const [estoque, setEstoque] = useState('');
  const [precoCusto, setPrecoCusto] = useState('');
  const [precoVenda, setPrecoVenda] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async () => {
    // Pedir permissão
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para escolher uma foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    // Validação simples
    if (!nome || !estoque || !precoCusto || !precoVenda) {
      Alert.alert('Atenção', 'Preencha todos os campos do formulário.');
      return;
    }

    // Conversão de dados
    const custoEmCentavos = Math.round(parseFloat(precoCusto.replace(',', '.')) * 100);
    const vendaEmCentavos = Math.round(parseFloat(precoVenda.replace(',', '.')) * 100);
    const qtdEstoque = parseInt(estoque, 10);

    if (isNaN(custoEmCentavos) || isNaN(vendaEmCentavos) || isNaN(qtdEstoque)) {
      Alert.alert('Erro', 'Verifique se os números estão corretos.');
      return;
    }

    let uploadedImageUrl = undefined;

    // Upload da imagem (se houver)
    if (imageUri) {
      try {
        setIsUploading(true);
        uploadedImageUrl = await uploadProductImage(imageUri);
      } catch (error) {
        Alert.alert('Erro no Upload', 'Não foi possível enviar a imagem. Tente novamente ou salve sem imagem.');
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    // Envia para a API
    createProduct(
      {
        nome,
        quantidadeEstoque: qtdEstoque,
        precoCustoEmCentavos: custoEmCentavos,
        precoVendaEmCentavos: vendaEmCentavos,
        imagemUrl: uploadedImageUrl,
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

        <ImagePickerButton onPress={pickImage}>
          {imageUri ? (
            <SelectedImage source={{ uri: imageUri }} resizeMode="cover" />
          ) : (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="camera-outline" size={40} color="#999" />
              <AppText style={{ color: '#999', marginTop: 8 }}>Toque para adicionar foto</AppText>
            </View>
          )}
        </ImagePickerButton>

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
          title={isUploading ? "Enviando Imagem..." : "Cadastrar Produto"}
          onPress={handleSave}
          isLoading={isPending || isUploading}
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