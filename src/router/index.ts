import { createRouter, createWebHistory } from 'vue-router'
// Essential imports for navigation guards and critical path
import { useAuthStore } from '../stores/auth'
import { useContextStore } from '../stores/context'

// Lazy Loading Views
const Login = () => import('../views/Login.vue')
const OAuthCallback = () => import('../views/OAuthCallback.vue')
const Dashboard = () => import('../views/Dashboard.vue')
const SelectContext = () => import('../views/auth/SelectContext.vue')

const router = createRouter({
  history: createWebHistory('#'),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/auth/callback',
      name: 'oauth-callback',
      component: OAuthCallback,
    },
    {
      path: '/select-context',
      name: 'select-context',
      component: SelectContext,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
    },
  ],
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  const contextStore = useContextStore()

  // Permitir acceso a callback sin autenticación
  if (to.name === 'oauth-callback') {
    return next()
  }

  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!auth.isAuthenticated) {
      if (auth.token) {
        try {
          await auth.fetchUser()
        } catch {
          return next('/login')
        }
      } else {
        return next('/login')
      }
    }

    // Check for Context Selection
    // Only redirect if we have multiple contexts and none selected
    if (
      contextStore.availableContexts.length > 1 &&
      !contextStore.hasContext &&
      to.name !== 'select-context'
    ) {
      return next({ name: 'select-context' })
    }
  }

  // Si intenta acceder a login estando autenticado
  if (to.name === 'login' && auth.isAuthenticated) {
    return next('/dashboard')
  }

  next()
})

export default router
