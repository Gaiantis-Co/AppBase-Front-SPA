<script setup lang="ts">
import AppLayout from '../layouts/AppLayout.vue';

defineOptions({
  name: 'DashboardView'
})

const accountsAppUrl = import.meta.env.VITE_ACCOUNTS_APP_URL || '#';
</script>

<template>
    <AppLayout>
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                Dashboard
            </h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg text-gray-900 dark:text-gray-100 p-6">
                    <p class="text-lg font-medium">Bienvenido al Dashboard Base de GAIANTIS</p>
                    <p class="mt-1 text-gray-600 dark:text-gray-400">Esta es la aplicación base que gestiona tu identidad y acceso al ecosistema.</p>
                </div>

                <!-- Profile Action -->
                <div class="mt-6 bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg text-gray-900 dark:text-gray-100 p-6">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Gestión de Perfil</h3>
                    <p class="mt-1 text-gray-600 dark:text-gray-400">
                        Administra tu configuración de cuenta y perfil en la aplicación centralizada de AccountsApp.
                    </p>
                    <div class="mt-4">
                        <a :href="accountsAppUrl" target="_blank" class="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150">
                            Ir a Perfil &rarr;
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
