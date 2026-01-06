<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useContextStore } from '../stores/context';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const contextStore = useContextStore();
const error = ref<string | null>(null);
const processing = ref(true);

onMounted(async () => {
    const code = route.query.code as string;
    const state = route.query.state as string;

    if (!code) {
        error.value = 'Código de autorización no encontrado en la URL';
        processing.value = false;
        return;
    }

    try {
        const response = await auth.handleOAuthCallback(code, state);
        
        // Extract companies from access_modes
        const companyModes = response.access_modes?.filter((mode: { type: string }) => mode.type === 'company') || [];
        
        // Map to Company interface
        const companies = companyModes.map((mode: { empresa: unknown; rol: string; empresa_id: number }) => ({
            ...mode.empresa,
            rol_empresa: mode.rol,
            id: mode.empresa_id // Ensure ID is top level
        }));

        const requiresCompany = response.requires_company;

        if (requiresCompany === 'optional') {
            // Permite elegir entre Administrador Global o Empresa
            contextStore.setAvailableContexts(companies);
            router.push('/select-context');
            return;
        }

        if (companies.length > 0) {
            contextStore.setAvailableContexts(companies);

            if (companies.length === 1 && requiresCompany === true) {
                // Auto-select if only one and is mandatory
                await contextStore.selectContext(companies[0].id);
                router.push('/dashboard');
            } else {
                // Redirect to selection
                router.push('/select-context');
            }
        } else {
            // No context needed or available
            router.push('/dashboard');
        }

    } catch (err: unknown) {
        const errorObj = err as { response?: { data?: { message?: string } } };
        error.value = errorObj.response?.data?.message || 'Error al procesar autenticación';
        processing.value = false;
        console.error('OAuth callback error:', err);
    }
});
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <!-- Error State -->
            <div v-if="error" class="text-center">
                <div class="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-red-100">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-red-600 mb-4">Error de Autenticación</h2>
                <p class="text-gray-600 dark:text-gray-400 mb-6">{{ error }}</p>
                <button
                    @click="router.push('/login')"
                    class="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition duration-300"
                >
                    Volver a Inicio
                </button>
            </div>

            <!-- Processing State -->
            <div v-else-if="processing" class="text-center">
                <div class="mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                    <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
                </div>
                <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    Autenticando...
                </h2>
                <p class="text-gray-600 dark:text-gray-400">
                    Por favor espera mientras procesamos tu autenticación.
                </p>
                <p class="mt-4 text-sm text-gray-500 dark:text-gray-500">
                    Esto solo tomará unos segundos.
                </p>
            </div>
        </div>
    </div>
</template>
