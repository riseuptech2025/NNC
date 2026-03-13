import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const useStore = create(
  persist(
    (set, get) => ({
      // Auth state
      admin: null,
      token: localStorage.getItem('token'),
      isAuthenticated: !!localStorage.getItem('token'),
      darkMode: false,
      
      // SEO state
      seoSettings: null,

      // News state
      news: [],
      currentNews: null,
      trendingNews: [],
      loading: false,
      
      // UI state
      searchQuery: '',
      
      // Actions
      setDarkMode: (mode) => set({ darkMode: mode }),
      
      login: async (email, password) => {
        try {
          const response = await axios.post(`${API_URL}/auth/login`, { email, password })
          const { token, admin } = response.data
          localStorage.setItem('token', token)
          set({ token, admin, isAuthenticated: true })
          return { success: true }
        } catch (error) {
          return { success: false, error: error.response?.data?.message || 'Login failed' }
        }
      },
      
      logout: () => {
        localStorage.removeItem('token')
        set({ admin: null, token: null, isAuthenticated: false })
      },
      
      fetchNews: async (category = '', page = 1) => {
        set({ loading: true })
        try {
          const response = await axios.get(`${API_URL}/news`, {
            params: { category, page }
          })
          set({ news: response.data.news, loading: false })
        } catch (error) {
          console.error('Error fetching news:', error)
          set({ loading: false })
        }
      },
      
      fetchSEOSettings: async () => {
  try {
    const response = await axios.get(`${API_URL}/seo/settings`)
    set({ seoSettings: response.data })
  } catch (error) {
    console.error('Error fetching SEO settings:', error)
  }
},

      fetchNewsById: async (id) => {
        set({ loading: true })
        try {
          const response = await axios.get(`${API_URL}/news/${id}`)
          set({ currentNews: response.data, loading: false })
        } catch (error) {
          console.error('Error fetching news:', error)
          set({ loading: false })
        }
      },
      
      addReaction: async (newsId, type) => {
        try {
          const response = await axios.post(`${API_URL}/reactions/${newsId}`, { type })
          return response.data.reactions
        } catch (error) {
          console.error('Error adding reaction:', error)
        }
      },
      
      addComment: async (newsId, userName, comment) => {
        try {
          const response = await axios.post(`${API_URL}/comments/${newsId}`, {
            userName,
            comment
          })
          return response.data
        } catch (error) {
          console.error('Error adding comment:', error)
        }
      },
      
      searchNews: async (query) => {
        set({ loading: true })
        try {
          const response = await axios.get(`${API_URL}/search`, {
            params: { q: query }
          })
          set({ news: response.data, loading: false })
          return response.data
        } catch (error) {
          console.error('Error searching news:', error)
          set({ loading: false })
          return []
        }
      },
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      fetchTrendingNews: async () => {
        try {
          const response = await axios.get(`${API_URL}/news`, {
            params: { trending: true, limit: 5 }
          })
          set({ trendingNews: response.data.news })
        } catch (error) {
          console.error('Error fetching trending news:', error)
        }
      }
    }),
    {
      name: 'nnc-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({
        darkMode: state.darkMode,
        admin: state.admin,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

export default useStore