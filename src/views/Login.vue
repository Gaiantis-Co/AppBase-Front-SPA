<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const error = ref<string | null>(null);

const handleLogin = async () => {
    try {
        await auth.login(); // Redirige a AccountsApp para OAuth
    } catch (err: any) {
        error.value = err.response?.data?.message || 'Error al iniciar sesión';
        console.error('Error al iniciar sesión:', err);
    }
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <h2 class="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
                Iniciar Sesión
            </h2>

            <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {{ error }}
            </div>

            <p class="text-gray-600 dark:text-gray-400 text-center mb-6">
                Serás redirigido a la página de autenticación segura de GAIANTIS.
            </p>

            <button
                @click="handleLogin"
                class="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center justify-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
                Continuar con GAIANTIS
            </button>

            <p class="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                Protegido por OAuth 2.0 con Single Sign-On
            </p>
        </div>
    </div>
</template>
