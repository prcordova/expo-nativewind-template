import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

interface PermissionsState {
  camera: boolean;
  mediaLibrary: boolean;
  notifications: boolean;
  allGranted: boolean;
  loading: boolean;
}

export function usePermissions() {
  const [permissions, setPermissions] = useState<PermissionsState>({
    camera: false,
    mediaLibrary: false,
    notifications: false,
    allGranted: false,
    loading: true,
  });

  // Verificar se é Expo Go (onde notificações push android não funcionam mais no SDK 54)
  const isExpoGo = Constants.appOwnership === 'expo';

  const requestPermissions = async () => {
    try {
      // Solicitar permissão de câmera
      const cameraPermission = await Camera.requestCameraPermissionsAsync();

      // Solicitar permissão de galeria (ImagePicker é mais compatível que MediaLibrary)
      const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      // Solicitar permissão de notificações push
      let notificationsGranted = false;
      try {
        const notificationPermission = await Notifications.requestPermissionsAsync();
        notificationsGranted = notificationPermission.status === 'granted';
      } catch (notifError) {
        console.warn('[PERMISSIONS] Notificações não suportadas neste ambiente (Expo Go):', notifError);
        // Em Expo Go, consideramos como "concedido" para não bloquear o fluxo do app, 
        // já que não temos escolha
        notificationsGranted = true; 
      }

      const cameraGranted = cameraPermission.status === 'granted';
      const mediaGranted = mediaPermission.status === 'granted';
      
      const allGranted = cameraGranted && mediaGranted && notificationsGranted;

      setPermissions({
        camera: cameraGranted,
        mediaLibrary: mediaGranted,
        notifications: notificationsGranted,
        allGranted,
        loading: false,
      });

      return allGranted;
    } catch (error) {
      console.error('[PERMISSIONS] Erro:', error);
      setPermissions({
        camera: false,
        mediaLibrary: false,
        notifications: false,
        allGranted: false,
        loading: false,
      });
      return false;
    }
  };

  const checkPermissions = async () => {
    try {
      const cameraPermission = await Camera.getCameraPermissionsAsync();
      const mediaPermission = await ImagePicker.getMediaLibraryPermissionsAsync();
      
      let notificationsGranted = false;
      try {
        const notificationPermission = await Notifications.getPermissionsAsync();
        notificationsGranted = notificationPermission.status === 'granted';
      } catch (e) {
        // Ignorar erro de notificações no Expo Go
        notificationsGranted = isExpoGo;
      }

      const cameraGranted = cameraPermission.status === 'granted';
      const mediaGranted = mediaPermission.status === 'granted';
      
      const allGranted = cameraGranted && mediaGranted && (isExpoGo || notificationsGranted);

      setPermissions({
        camera: cameraGranted,
        mediaLibrary: mediaGranted,
        notifications: notificationsGranted,
        allGranted,
        loading: false,
      });

      return allGranted;
    } catch (error) {
      console.error('[PERMISSIONS] Erro:', error);
      setPermissions({
        camera: false,
        mediaLibrary: false,
        notifications: false,
        allGranted: false,
        loading: false,
      });
      return false;
    }
  };

  useEffect(() => {
    const init = async () => {
      const hasPermissions = await checkPermissions();
      
      if (!hasPermissions) {
        setTimeout(() => {
          requestPermissions();
        }, 1000);
      }
    };

    init();
  }, []);

  return {
    ...permissions,
    requestPermissions,
    checkPermissions,
  };
}

