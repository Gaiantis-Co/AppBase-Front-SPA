<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

defineOptions({
  name: 'LoginView'
})

const auth = useAuthStore();
const error = ref<string | null>(null);
const isLoading = ref(false);

const handleLogin = async () => {
    isLoading.value = true;
    error.value = null;
    try {
        await auth.login(); // Redirige a AccountsApp para OAuth
    } catch (err: unknown) {
        const errorObj = err as { response?: { data?: { message?: string } } };
        error.value = errorObj.response?.data?.message || 'Error al iniciar sesión';
        console.error('Error al iniciar sesión:', err);
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
        <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transform transition-all duration-300">
            <h2 class="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-2">
                ¡Bienvenido!
            </h2>
            <p class="text-gray-500 dark:text-gray-400 text-center mb-8">
                Inicia sesión en tu cuenta
            </p>

            <div v-if="error" class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {{ error }}
            </div>

            <p class="text-gray-600 dark:text-gray-300 text-center mb-8 leading-relaxed">
                Serás redirigido a la página de autenticación segura de <strong>GAIANTIS</strong>.
            </p>

            <button
                @click="handleLogin"
                :disabled="isLoading"
                class="w-full bg-indigo-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/30 disabled:opacity-75 disabled:cursor-not-allowed"
            >
                <template v-if="!isLoading">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                    </svg>
                    <span>Continuar con GAIANTIS</span>
                </template>
                <template v-else>
                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Conectando...</span>
                </template>
            </button>

            <p class="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                Protegido por OAuth 2.0 con Single Sign-On
            </p>
        </div>
    </div>
</template>
