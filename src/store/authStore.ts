import { createStore, type ActionContext } from 'vuex'

export type AuthUser = { username: string }

export type RootState = {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
}

type Ctx = ActionContext<RootState, RootState>

const store = createStore<RootState>({
  state: (): RootState => ({
    token: null,
    user: null,
    isAuthenticated: false
  }),

  mutations: {
    SET_AUTH(state: RootState, payload: { token: string | null; user: AuthUser | null }) {
      state.token = payload.token
      state.user = payload.user
      state.isAuthenticated = !!payload.token
    }
  },

  actions: {
    login({ commit }: Ctx, { username, password }: { username: string; password: string }) {
      const fakeToken = 'demo-token'
      const user: AuthUser = { username }
      commit('SET_AUTH', { token: fakeToken, user })
      localStorage.setItem('authToken', fakeToken)
      localStorage.setItem('authUser', JSON.stringify(user))
    },

    logout({ commit }: Ctx) {
      commit('SET_AUTH', { token: null, user: null })
      localStorage.removeItem('authToken')
      localStorage.removeItem('authUser')
    },

    restoreAuth({ commit }: Ctx) {
      const token = localStorage.getItem('authToken')
      const userStr = localStorage.getItem('authUser')
      const user = userStr ? (JSON.parse(userStr) as AuthUser) : null
      commit('SET_AUTH', { token, user })
    }
  },

  getters: {
    isAuthenticated: (state: RootState) => state.isAuthenticated,
    currentUser: (state: RootState) => state.user,
    authToken: (state: RootState) => state.token
  }
})

export default store
