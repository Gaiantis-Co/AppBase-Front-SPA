<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useContextStore } from '../stores/context'
import { useRouter } from 'vue-router'
import ContextSwitcher from './ContextSwitcher.vue'
import RoleBadge from './RoleBadge.vue'

const auth = useAuthStore()
const contextStore = useContextStore()
const router = useRouter()
const showingNavigationDropdown = ref(false)
const showingUserDropdown = ref(false)

const logout = async () => {
  await auth.logout()
  contextStore.clearContext()
  router.push('/login')
}
</script>

<template>
  <nav class="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
    <!-- Primary Navigation Menu -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <!-- Logo -->
          <div class="shrink-0 flex items-center">
            <router-link to="/dashboard">
              <svg
                class="block h-9 w-auto text-indigo-600 dark:text-indigo-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"
                />
              </svg>
            </router-link>
          </div>

          <div class="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
            <router-link
              to="/dashboard"
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none"
              :class="[
                $route.name === 'dashboard'
                  ? 'border-indigo-400 dark:border-indigo-600 text-gray-900 dark:text-gray-100 focus:border-indigo-700'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700',
              ]"
            >
              Dashboard
            </router-link>
          </div>
        </div>

        <div class="hidden sm:flex sm:items-center sm:ms-6">
          <!-- Context Switcher -->
          <div v-if="contextStore.availableContexts.length > 1" class="ms-3 relative">
            <ContextSwitcher />
          </div>
          <div
            v-if="contextStore.availableContexts.length > 1"
            class="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"
          ></div>

          <!-- Role Badge -->
          <div v-if="contextStore.currentContext" class="ms-3">
            <RoleBadge
              :role="contextStore.currentContext.rol_empresa || 'usuario'"
              :isGlobalAdmin="false"
            />
          </div>

          <!-- User Dropdown -->
          <div class="ms-3 relative">
            <div class="relative">
              <button
                @click="showingUserDropdown = !showingUserDropdown"
                v-if="auth.user"
                class="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition"
              >
                <img
                  class="h-8 w-8 rounded-full object-cover"
                  :src="'https://ui-avatars.com/api/?name=' + encodeURIComponent(auth.user.name)"
                  :alt="auth.user.name"
                />
              </button>
              <span v-else class="inline-flex rounded-md">
                <button
                  @click="showingUserDropdown = !showingUserDropdown"
                  type="button"
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                >
                  Guest
                  <svg
                    class="ms-2 -me-0.5 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>
              </span>

              <!-- Dropdown Menu -->
              <div
                v-show="showingUserDropdown"
                @click="showingUserDropdown = false"
                class="absolute z-50 mt-2 w-48 rounded-md shadow-lg origin-top-right right-0"
              >
                <div
                  class="rounded-md ring-1 ring-black ring-opacity-5 py-1 bg-white dark:bg-gray-700"
                >
                  <div class="block px-4 py-2 text-xs text-gray-400">Manage Account</div>
                  <button
                    @click="logout"
                    class="block w-full text-left px-4 py-2 text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 transition duration-150 ease-in-out"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Hamburger -->
        <div class="-me-2 flex items-center sm:hidden">
          <button
            @click="showingNavigationDropdown = !showingNavigationDropdown"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out"
          >
            <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path
                :class="{
                  hidden: showingNavigationDropdown,
                  'inline-flex': !showingNavigationDropdown,
                }"
                class="inline-flex"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                :class="{
                  hidden: !showingNavigationDropdown,
                  'inline-flex': showingNavigationDropdown,
                }"
                class="hidden"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Responsive Navigation Menu -->
    <div
      :class="{ block: showingNavigationDropdown, hidden: !showingNavigationDropdown }"
      class="sm:hidden"
    >
      <div class="pt-2 pb-3 space-y-1">
        <router-link
          to="/dashboard"
          class="block w-full ps-3 pe-4 py-2 border-l-4 text-left text-base font-medium transition duration-150 ease-in-out"
          :class="[
            $route.name === 'dashboard'
              ? 'border-indigo-400 text-indigo-700 bg-indigo-50 dark:bg-indigo-900/50 dark:text-indigo-300 focus:outline-none focus:text-indigo-800 dark:focus:text-indigo-200 focus:bg-indigo-100 dark:focus:bg-indigo-900 focus:border-indigo-700'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-800 dark:focus:text-gray-200 focus:bg-gray-50 dark:focus:bg-gray-700 focus:border-gray-300 dark:focus:border-gray-600',
          ]"
        >
          Dashboard
        </router-link>
      </div>

      <!-- Responsive Settings Options -->
      <div class="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
        <div class="flex items-center px-4">
          <div v-if="auth.user">
            <div class="font-medium text-base text-gray-800 dark:text-gray-200">
              {{ auth.user.name }}
            </div>
            <div class="font-medium text-sm text-gray-500">{{ auth.user.email }}</div>
          </div>
        </div>

        <div class="mt-3 space-y-1">
          <button
            @click="logout"
            class="block w-full text-left ps-3 pe-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:text-gray-800 dark:focus:text-gray-200 focus:bg-gray-50 dark:focus:bg-gray-700 focus:border-gray-300 dark:focus:border-gray-600 transition duration-150 ease-in-out"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
