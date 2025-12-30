import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api.config';

// Criar instância do axios
export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (__DEV__) {
      console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(`[API RESPONSE] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
    }
    return response;
  },
  async (error: AxiosError) => {
    if (__DEV__) {
      console.error(`[API ERROR] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.status, error.response?.data || error.message);
    }
    
    if (error.response?.status === 401) {
      const errorCode = (error.response?.data as any)?.code;
      
      // Não limpar token se for TOKEN_VERSION_MISMATCH
      if (errorCode === 'TOKEN_VERSION_MISMATCH') {
        console.warn('[API] Token version mismatch');
        return Promise.reject(error);
      }
      
      // Se for 401 e não for rota de auth, limpar token
      if (error.config?.url && !error.config.url.includes('/auth/')) {
        await AsyncStorage.removeItem('token');
      }
    }
    return Promise.reject(error);
  }
);

// Interface para resposta da API
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Interface para resposta de login
interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    following: string[];
    plan?: {
      type: 'FREE' | 'STARTER' | 'PRO' | 'PRO_PLUS';
      status: string;
    };
    accountType?: 'user' | 'admin';
    twoFactor?: {
      enabled: boolean;
    };
  };
}

// Interface para resultado de login com 2FA
interface LoginResult {
  requires2FA?: boolean;
  tempToken?: string;
  success?: boolean;
  data?: AuthResponse;
}

// API de autenticação
export const authApi = {
  login: async (username: string, password: string): Promise<LoginResult> => {
    try {
      // Criar instância sem interceptor para login
      const loginApi = axios.create({
        baseURL: API_CONFIG.BASE_URL,
        timeout: API_CONFIG.TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await loginApi.post<LoginResult>('/api/auth/login', { 
        username, 
        password 
      });
      
      return response.data;
    } catch (error) {
      console.error('[API] Erro no login:', error);
      throw error;
    }
  },

  login2FA: async (tempToken: string, code: string): Promise<LoginResult> => {
    const response = await api.post<LoginResult>('/api/auth/login/2fa', {
      tempToken,
      code,
    });
    return response.data;
  },
};

// API de usuário
export const userApi = {
  getMyProfile: async () => {
    const response = await api.get<ApiResponse<any>>('/api/users/profile');
    return response.data;
  },
  listUsers: async (params: {
    page?: number;
    limit?: number;
    filter?: 'popular' | 'recent' | 'most-viewed' | 'most-liked';
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.filter) queryParams.append('filter', params.filter);
    if (params.search) queryParams.append('search', params.search);

    const response = await api.get<ApiResponse<any>>(`/api/users?${queryParams.toString()}`);
    return response.data;
  },
  sendFriendRequest: async (userId: string) => {
    const response = await api.post<ApiResponse<any>>('/api/friendships/requests', { recipientId: userId });
    return response.data;
  },
  acceptFriendRequest: async (requestId: string) => {
    const response = await api.post<ApiResponse<any>>(`/api/friendships/requests/${requestId}/accept`);
    return response.data;
  },
  rejectFriendRequest: async (requestId: string) => {
    const response = await api.post<ApiResponse<any>>(`/api/friendships/requests/${requestId}/reject`);
    return response.data;
  },
  cancelFriendRequest: async (requestId: string) => {
    const response = await api.post<ApiResponse<any>>(`/api/friendships/requests/${requestId}/reject`);
    return response.data;
  },
  removeFriend: async (friendshipId: string) => {
    const response = await api.post<ApiResponse<any>>(`/api/friendships/${friendshipId}/unfriend`);
    return response.data;
  },
  getFriendRequestsSent: async () => {
    const response = await api.get<ApiResponse<any>>('/api/friendships/requests/sent');
    return response.data;
  },
  getFriendRequestsReceived: async () => {
    const response = await api.get<ApiResponse<any>>('/api/friendships/requests/received');
    return response.data;
  },
  getMyFriends: async (params?: { search?: string; sort?: 'recent' | 'name' }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.sort) query.append('sort', params.sort);
    const response = await api.get<ApiResponse<any>>(`/api/friendships/friends?${query.toString()}`);
    return response.data;
  },
  followUser: async (username: string) => {
    const response = await api.post<ApiResponse<any>>(`/api/users/${username}/follow`);
    return response.data;
  },
  unfollowUser: async (username: string) => {
    const response = await api.post<ApiResponse<any>>(`/api/users/${username}/unfollow`);
    return response.data;
  },
  getFollowStatus: async (username: string) => {
    const response = await api.get<ApiResponse<any>>(`/api/users/${username}/follow-status`);
    return response.data;
  },
  getUserProfile: async (username: string) => {
    const response = await api.get<ApiResponse<any>>(`/api/users/${username}`);
    return response.data;
  },
  blockUser: async (username: string, reason?: string) => {
    const response = await api.post<ApiResponse<any>>('/api/blocks', { targetUsername: username, reason });
    return response.data;
  },
  unblockUser: async (username: string) => {
    const response = await api.delete<ApiResponse<any>>(`/api/blocks/${username}`);
    return response.data;
  },
  getBlockStatus: async (username: string) => {
    const response = await api.get<ApiResponse<any>>(`/api/blocks/${username}`);
    return response.data;
  },
};

// API de Posts (Feed)
export const postsApi = {
  BASE_URL: API_CONFIG.BASE_URL, // Exportar para uso no upload
  
  getPosts: async (page = 1, limit = 20) => {
    const response = await api.get<ApiResponse<any>>(`/api/posts?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  getUserPosts: async (username: string, page = 1, limit = 10) => {
    const response = await api.get<ApiResponse<any>>(`/api/posts/user/${username}?page=${page}&limit=${limit}`);
    return response.data;
  },

  createPost: async (data: {
    content: string;
    imageUrl?: string | null;
    visibility: string;
    category: string;
    linkId?: string | null;
    hideAutoPreview?: boolean;
  }) => {
    const response = await api.post<ApiResponse<any>>('/api/posts', data);
    return response.data;
  },

  reactToPost: async (postId: string, reactionType: string) => {
    const response = await api.post<ApiResponse<any>>(`/api/posts/${postId}/react`, {
      reactionType,
    });
    return response.data;
  },

  commentOnPost: async (postId: string, content: string) => {
    const response = await api.post<ApiResponse<any>>(`/api/posts/${postId}/comments`, {
      content,
    });
    return response.data;
  },

  getComments: async (postId: string) => {
    const response = await api.get<ApiResponse<any>>(`/api/posts/${postId}/comments`);
    return response.data;
  },

  reactToComment: async (postId: string, commentId: string, reactionType = 'LIKE') => {
    const response = await api.post<ApiResponse<any>>(`/api/posts/${postId}/comments/${commentId}/react`, {
      reactionType,
    });
    return response.data;
  },

  deletePost: async (postId: string) => {
    // Usamos POST como fallback para garantir compatibilidade em mobile
    const response = await api.post<ApiResponse<any>>(`/api/posts/${postId}/delete`);
    return response.data;
  },

  sharePost: async (postId: string, shareComment?: string, visibility?: string) => {
    const response = await api.post<ApiResponse<any>>(`/api/posts/${postId}/share`, {
      shareComment,
      visibility,
    });
    return response.data;
  },

  reportPost: async (
    postId: string,
    data: {
      category: string;
      description: string;
      targetUsername: string;
    }
  ) => {
    const formData = new FormData();
    formData.append('targetUsername', data.targetUsername);
    formData.append('targetType', 'POST');
    formData.append('targetId', postId);
    formData.append('category', data.category);
    formData.append('description', data.description);

    const response = await api.post<ApiResponse<any>>('/api/reports', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// API de Stories
export const storiesApi = {
  getStories: async (clearCache = false) => {
    const params = clearCache ? { clearCache: 'true' } : {};
    const response = await api.get<ApiResponse<any>>('/api/stories/feed', { params });
    return response.data;
  },

  createStory: async (data: {
    type: 'image' | 'video' | 'gif';
    mediaUrl: string;
    text?: string;
    duration?: number;
  }) => {
    const response = await api.post<ApiResponse<any>>('/api/stories', data);
    return response.data;
  },

  viewStory: async (storyId: string) => {
    const response = await api.post<ApiResponse<any>>(`/api/stories/${storyId}/view`);
    return response.data;
  },

  reactToStory: async (storyId: string, reactionType = 'LIKE') => {
    const response = await api.post<ApiResponse<any>>(`/api/stories/${storyId}/react`, {
      reactionType,
    });
    return response.data;
  },

  reportStory: async (storyId: string, data: { category: string; description: string }) => {
    const response = await api.post<ApiResponse<any>>(`/api/stories/${storyId}/report`, data);
    return response.data;
  },

  deleteStory: async (storyId: string) => {
    // Usamos POST como fallback para garantir compatibilidade em mobile
    const response = await api.post<ApiResponse<any>>(`/api/stories/${storyId}`);
    return response.data;
  },
};

// API de Anúncios
export const adsApi = {
  getAds: async (multiple = true, limit = 10) => {
    const response = await api.get<ApiResponse<any>>(`/api/ads?multiple=${multiple}&limit=${limit}`);
    return response.data;
  },

  viewAd: async (adId: string) => {
    const response = await api.post<ApiResponse<any>>(`/api/ads/${adId}/view`);
    return response.data;
  },

  clickAd: async (adId: string) => {
    const response = await api.post<ApiResponse<any>>(`/api/ads/${adId}/click`);
    return response.data;
  },
};

// API de Shops (Lojas/Produtos)
export const shopsApi = {
  getProducts: async (params: {
    page?: number;
    limit?: number;
    categoryId?: string;
    sellerUsername?: string;
    search?: string;
    onlyPurchased?: boolean;
    sortBy?: 'createdAt' | 'price' | 'salesCount';
    sortOrder?: 'asc' | 'desc';
    showAdultContent?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.categoryId) queryParams.append('categoryId', params.categoryId);
    if (params.sellerUsername) queryParams.append('sellerUsername', params.sellerUsername);
    if (params.search) queryParams.append('search', params.search);
    if (params.onlyPurchased) queryParams.append('onlyPurchased', 'true');
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.showAdultContent !== undefined) queryParams.append('showAdultContent', params.showAdultContent.toString());

    const response = await api.get<ApiResponse<any>>(`/api/shops/products?${queryParams.toString()}`);
    return response.data;
  },
  getSellers: async () => {
    const response = await api.get<ApiResponse<any>>('/api/shops/sellers');
    return response.data;
  },
};

// API de Mensagens
export const messageApi = {
  getConversations: async () => {
    const response = await api.get<ApiResponse<any>>('/api/messages/conversations');
    return response.data;
  },
  getMessages: async (userId: string, otherUserId: string, beforeDate?: string) => {
    const query = beforeDate ? `?beforeDate=${beforeDate}` : '';
    const response = await api.get<ApiResponse<any>>(`/api/messages/${userId}/${otherUserId}${query}`);
    return response.data;
  },
  sendMessage: async (data: {
    recipientId: string;
    content: string;
    type?: 'text' | 'image' | 'document';
    imageUrl?: string | null;
    documentUrl?: string | null;
    documentName?: string | null;
    documentSize?: number | null;
  }) => {
    const response = await api.post<ApiResponse<any>>('/api/messages', data);
    return response.data;
  },
  markAsRead: async (otherUserId: string) => {
    const response = await api.post<ApiResponse<any>>('/api/messages/mark-read', { senderId: otherUserId });
    return response.data;
  },
  archiveConversation: async (conversationId: string) => {
    const response = await api.put<ApiResponse<any>>(`/api/messages/conversations/${conversationId}/archive`);
    return response.data;
  },
  deleteConversation: async (conversationId: string) => {
    const response = await api.delete<ApiResponse<any>>(`/api/messages/conversations/${conversationId}`);
    return response.data;
  },
};

export default api;

