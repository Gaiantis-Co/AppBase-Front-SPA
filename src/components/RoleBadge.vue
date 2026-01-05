<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    role: string;
    isGlobalAdmin?: boolean;
}

const props = defineProps<Props>();

const roleLabel = computed(() => {
    return props.role.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
});

const roleColorClass = computed(() => {
    const role = props.role;
    
    // Special roles with gradients
    const specialRoles: Record<string, string> = {
        'Rusbelito': 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md animate-pulse ring-1 ring-cyan-300',
        'MasterChief': 'bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white shadow-sm ring-1 ring-yellow-300',
        'SuperAdministrador': 'bg-red-600 text-white shadow-sm',
        'Desarrollador': 'bg-emerald-600 text-white shadow-sm',
    };
    
    if (specialRoles[role]) {
        return specialRoles[role];
    }
    
    // Company roles
    const companyRoles: Record<string, string> = {
        'representante_legal': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        'representante_legal_visor': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        'administrador_total': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        'administrador_operativo': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        'empleado': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        'contador': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    };
    
    if (companyRoles[role]) {
        return companyRoles[role];
    }
    
    // Default
    return props.isGlobalAdmin 
        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
        : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
});
</script>

<template>
    <span :class="['inline-flex items-center px-3 py-1 rounded-full text-xs font-medium', roleColorClass]">
        <svg v-if="isGlobalAdmin" class="w-3 h-3 me-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else class="w-3 h-3 me-1.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
        </svg>
        {{ roleLabel }}
    </span>
</template>
