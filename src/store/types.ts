// src/store/types.ts
export interface AuthUser {
  username: string
  // 之後如果有 email / role 再慢慢加
}

export interface RootState {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
}
