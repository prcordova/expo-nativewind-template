// Tipos compartilhados da aplicação

export interface User {
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
  wallet?: {
    balance: number;
    totalEarned: number;
    totalSpent: number;
  };
  isFollowing?: boolean;
}

export interface LoginFormData {
  username: string;
  password: string;
}

