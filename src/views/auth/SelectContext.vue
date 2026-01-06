<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useContextStore } from '../../stores/context'

const router = useRouter()
const authStore = useAuthStore()
const contextStore = useContextStore()

async function selectCompany(id: number) {
  await contextStore.selectContext(id)
  router.push('/dashboard')
}

function handleGlobalAdmin() {
  contextStore.clearContext()
  router.push('/dashboard')
}

onMounted(() => {
  // If no contexts available, redirect to login or error
  if (contextStore.availableContexts.length === 0) {
    // Just for safety, but this view should be guarded
    router.push('/login')
  }
})
</script>

<template>
  <div
    class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900"
  >
    <div
      class="w-full sm:max-w-2xl mt-6 px-6 py-8 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg"
    >
      <div class="space-y-4">
        <!-- Global Admin Option (Conditional) -->
        <button
          v-if="authStore.requiresCompany === 'optional'"
          @click="handleGlobalAdmin"
          class="w-full text-left p-4 border-2 border-indigo-200 dark:border-indigo-900 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors bg-white dark:bg-gray-800 shadow-sm"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                <svg
                  class="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-indigo-900 dark:text-indigo-100">
                  Acceso Administrador Global
                </h3>
                <p class="text-sm text-indigo-600 dark:text-indigo-400">
                  Ingresar sin seleccionar una empresa específica.
                </p>
              </div>
            </div>
            <svg
              class="w-6 h-6 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </div>
        </button>

        <div v-if="authStore.requiresCompany === 'optional'" class="relative py-4">
          <div class="absolute inset-0 flex items-center" aria-hidden="true">
            <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span
              class="px-2 bg-white dark:bg-gray-800 text-gray-500 uppercase tracking-widest text-xs"
              >O selecciona una empresa</span
            >
          </div>
        </div>

        <!-- Companies List -->
        <button
          v-for="company in contextStore.availableContexts"
          :key="company.id"
          @click="selectCompany(company.id)"
          class="w-full text-left p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800"
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ company.nombre }}
                </h3>
                <span
                  v-if="company.rol_empresa"
                  class="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded uppercase tracking-wider border border-gray-200 dark:border-gray-600"
                >
                  {{ company.rol_empresa }}
                </span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ company.pais.toUpperCase() }} - {{ company.tipo_identificador.toUpperCase() }}:
                {{ company.identificador }}
              </p>
            </div>
            <svg
              class="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </div>
        </button>
      </div>

      <div class="mt-8 text-center">
        <!-- Logout is assumed to be handled by layout or separate action -->
        <router-link
          to="/login"
          class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline"
        >
          Cancel (Back to Login)
        </router-link>
      </div>
    </div>
  </div>
</template>
