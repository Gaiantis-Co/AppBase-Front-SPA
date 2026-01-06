import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import api from '../lib/axios';

export interface Company {
    id: number;
    nombre: string;
    pais: string;
    identificador: string;
    tipo_identificador: string;
    rol_empresa?: string;
}

export interface AccessMode {
    type: 'company' | 'admin';
    empresa?: Company;
    rol?: string;
    empresa_id?: number;
}

export const useContextStore = defineStore('context', () => {
    const availableContexts = ref<Company[]>([]);
    const currentContext = ref<Company | null>(null);

    // Getters
    const hasContext = computed(() => !!currentContext.value);

    // Actions
    function setAvailableContexts(contexts: Company[]) {
        availableContexts.value = contexts;
    }

    async function selectContext(companyId: number) {
        const found = availableContexts.value.find(c => c.id === companyId);
        if (found) {
            try {
                // Sincronizar con el backend
                await api.post('/api/select-company', {
                    company_id: companyId,
                    rol_empresa: found.rol_empresa || 'usuario'
                });

                currentContext.value = found;
                localStorage.setItem('current_context', JSON.stringify(found));
            } catch (error) {
                console.error('Error selecting company context:', error);
                throw error;
            }
        }
    }

    function clearContext() {
        currentContext.value = null;
        availableContexts.value = [];
        localStorage.removeItem('current_context');
    }

    // Initialize from storage if available
    function initialize() {
        const stored = localStorage.getItem('current_context');
        if (stored) {
            try {
                currentContext.value = JSON.parse(stored);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (_) {
                localStorage.removeItem('current_context');
            }
        }
    }

    return {
        availableContexts,
        currentContext,
        hasContext,
        setAvailableContexts,
        selectContext,
        clearContext,
        initialize
    };
});
