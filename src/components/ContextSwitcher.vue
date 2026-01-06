<script setup lang="ts">
import { ref } from 'vue';
import { useContextStore } from '../stores/context';
import { useRouter } from 'vue-router';

const contextStore = useContextStore();
const router = useRouter();
const isOpen = ref(false);

function switchContext(companyId: number) {
    contextStore.selectContext(companyId);
    isOpen.value = false;
    // Reload current route to refresh data with new context
    router.go(0);
}
</script>

<template>
    <div class="relative">
        <button
            @click="isOpen = !isOpen"
            type="button"
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 active:bg-gray-50 dark:active:bg-gray-700 transition ease-in-out duration-150"
        >
            <svg class="w-4 h-4 me-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd"/>
            </svg>
            {{ contextStore.currentContext?.nombre || 'Select Company' }}
            <svg class="ms-2 -me-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
        </button>

        <!-- Dropdown Menu -->
        <div
            v-show="isOpen"
            @click="isOpen = false"
            class="absolute z-50 mt-2 w-64 rounded-md shadow-lg origin-top-right right-0"
        >
            <div class="rounded-md ring-1 ring-black ring-opacity-5 py-1 bg-white dark:bg-gray-700">
                <div class="block px-4 py-2 text-xs text-gray-400">
                    Switch Company
                </div>
                <button
                    v-for="company in contextStore.availableContexts"
                    :key="company.id"
                    @click="switchContext(company.id)"
                    class="block w-full text-left px-4 py-2 text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 transition duration-150 ease-in-out"
                    :class="{ 'bg-gray-50 dark:bg-gray-600': contextStore.currentContext?.id === company.id }"
                >
                    <div class="font-semibold">{{ company.nombre }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                        {{ company.pais.toUpperCase() }} - {{ company.tipo_identificador.toUpperCase() }}: {{ company.identificador }}
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>
