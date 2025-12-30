import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { postsApi } from '../services/api';
import { COLORS } from '../theme/colors';
import { Button } from './Button';

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  postId: string;
  onShared?: () => void;
}

type VisibilityType = 'PUBLIC' | 'FOLLOWERS' | 'FRIENDS';

export function ShareModal({ visible, onClose, postId, onShared }: ShareModalProps) {
  const insets = useSafeAreaInsets();
  const [shareComment, setShareComment] = useState('');
  const [visibility, setVisibility] = useState<VisibilityType>('PUBLIC');
  const [loading, setLoading] = useState(false);

  const visibilityOptions = [
    { value: 'PUBLIC' as VisibilityType, label: 'Público', icon: 'globe-outline' },
    { value: 'FOLLOWERS' as VisibilityType, label: 'Seguidores', icon: 'people-outline' },
    { value: 'FRIENDS' as VisibilityType, label: 'Amigos', icon: 'person-add-outline' },
  ];

  const handleShare = async () => {
    try {
      setLoading(true);
      const response = await postsApi.sharePost(postId, shareComment, visibility);
      
      if (response.success) {
        setShareComment('');
        onClose();
        if (onShared) {
          onShared();
        }
      }
    } catch (error) {
      console.error('[ShareModal] Erro ao compartilhar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShareComment('');
    setVisibility('PUBLIC');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Compartilhar Post</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            {/* Comentário */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Adicione um comentário (opcional)</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Diga algo sobre este post..."
                placeholderTextColor={COLORS.text.tertiary}
                value={shareComment}
                onChangeText={setShareComment}
                multiline
                maxLength={280}
                editable={!loading}
              />
              <Text style={styles.charCount}>{shareComment.length}/280</Text>
            </View>

            {/* Visibilidade */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quem pode ver?</Text>
              {visibilityOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.visibilityOption,
                    visibility === option.value && styles.visibilityOptionActive,
                  ]}
                  onPress={() => setVisibility(option.value)}
                  disabled={loading}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={24}
                    color={
                      visibility === option.value
                        ? COLORS.secondary.main
                        : COLORS.text.secondary
                    }
                  />
                  <Text
                    style={[
                      styles.visibilityLabel,
                      visibility === option.value && styles.visibilityLabelActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {visibility === option.value && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={COLORS.secondary.main}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Botão Compartilhar */}
            <Button
              onPress={handleShare}
              loading={loading}
              disabled={loading}
              style={styles.shareButton}
            >
              Compartilhar
            </Button>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.background.paper,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  textArea: {
    borderWidth: 1,
    borderColor: COLORS.border.light,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 14,
    color: COLORS.text.primary,
    backgroundColor: COLORS.background.tertiary,
  },
  charCount: {
    fontSize: 12,
    color: COLORS.text.secondary,
    textAlign: 'right',
    marginTop: 4,
  },
  visibilityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    marginBottom: 8,
    backgroundColor: COLORS.background.default,
  },
  visibilityOptionActive: {
    borderColor: COLORS.secondary.main,
    borderWidth: 2,
    backgroundColor: COLORS.background.paper,
  },
  visibilityLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text.primary,
    marginLeft: 12,
  },
  visibilityLabelActive: {
    color: COLORS.secondary.main,
    fontWeight: 'bold',
  },
  shareButton: {
    marginTop: 8,
  },
});

