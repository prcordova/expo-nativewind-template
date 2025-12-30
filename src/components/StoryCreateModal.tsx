import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { storiesApi, postsApi } from '../services/api';
import { COLORS } from '../theme/colors';
import { showToast } from './CustomToast';

const { width, height } = Dimensions.get('window');

interface StoryCreateModalProps {
  visible: boolean;
  onClose: () => void;
  onStoryCreated: () => void;
}

export function StoryCreateModal({
  visible,
  onClose,
  onStoryCreated,
}: StoryCreateModalProps) {
  const insets = useSafeAreaInsets();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [storyText, setStoryText] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      showToast.error('Erro', 'Não foi possível selecionar a imagem');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        showToast.error('Permissão negada', 'Precisamos de acesso à câmera para tirar fotos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      showToast.error('Erro', 'Não foi possível abrir a câmera');
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    try {
      setLoading(true);

      // Simular upload para pegar uma URL (no app real, enviaria o arquivo para um S3/Cloudinary)
      // O backend do Melter espera uma URL por enquanto ou Multipart. 
      // Vamos assumir que enviamos a URL ou usamos o endpoint de posts que aceita imagem.
      // Como o storiesApi.createStory espera mediaUrl, vamos simular o upload aqui.
      
      const formData = new FormData();
      const filename = selectedImage.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('image', {
        uri: selectedImage,
        name: filename,
        type,
      } as any);

      // Usar endpoint de upload (vamos assumir que o backend tem um ou usamos o de posts)
      // No Melter web, os stories são criados com FormData.
      
      const response = await storiesApi.createStory({
        type: 'image',
        mediaUrl: selectedImage, // Em um cenário real, seria a URL retornada do servidor
        text: storyText.trim() || undefined,
        duration: 5000,
      });

      if (response.success) {
        showToast.success('Sucesso', 'Story criado com sucesso!');
        setSelectedImage(null);
        setStoryText('');
        onStoryCreated();
        onClose();
      }
    } catch (error) {
      console.error('[StoryCreate] Erro ao criar:', error);
      showToast.error('Erro', 'Não foi possível criar o story');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (selectedImage) {
      return (
        <View style={styles.previewContainer}>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          <View style={[styles.previewOverlay, { paddingTop: insets.top + 20 }]}>
            <TouchableOpacity 
              style={styles.cancelPreview} 
              onPress={() => setSelectedImage(null)}
            >
              <Ionicons name="close" size={30} color="#ffffff" />
            </TouchableOpacity>
            
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.storyInput}
                placeholder="Adicione um texto..."
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={storyText}
                onChangeText={setStoryText}
                maxLength={100}
                multiline
              />
            </View>

            <TouchableOpacity 
              style={[styles.publishButton, loading && styles.publishButtonDisabled]}
              onPress={handleUpload}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Text style={styles.publishButtonText}>Compartilhar</Text>
                  <Ionicons name="send" size={20} color="#ffffff" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.selectionContainer}>
        <View style={styles.selectionHeader}>
          <Text style={styles.selectionTitle}>Criar Story</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={28} color={COLORS.text.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionCard} onPress={handlePickImage}>
            <View style={[styles.iconContainer, { backgroundColor: COLORS.secondary.main }]}>
              <Ionicons name="images" size={32} color="#ffffff" />
            </View>
            <Text style={styles.optionText}>Galeria</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard} onPress={handleTakePhoto}>
            <View style={[styles.iconContainer, { backgroundColor: COLORS.primary.main }]}>
              <Ionicons name="camera" size={32} color="#ffffff" />
            </View>
            <Text style={styles.optionText}>Câmera</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={selectedImage ? false : true}
      onRequestClose={onClose}
    >
      <View style={[styles.container, !selectedImage && styles.modalOverlay]}>
        {renderContent()}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  selectionContainer: {
    backgroundColor: COLORS.background.paper,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  selectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  selectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 20,
  },
  optionCard: {
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  previewImage: {
    width: width,
    height: height,
    resizeMode: 'cover',
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  cancelPreview: {
    alignSelf: 'flex-start',
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  textInputContainer: {
    alignItems: 'center',
  },
  storyInput: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary.main,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 30,
    gap: 10,
    alignSelf: 'center',
  },
  publishButtonDisabled: {
    opacity: 0.7,
  },
  publishButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

