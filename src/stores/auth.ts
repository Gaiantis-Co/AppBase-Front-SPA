import { defineStore } from 'pinia';
import api from '../lib/axios';
import { ref, computed } from 'vue';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Company {
    id: number;
    nombre: string;
    identificacion: string;
    alias?: string;
    logo?: string;
}

interface AccessMode {
    type: 'global_admin' | 'company';
    rol: string;
    empresa_id: number | null;
    empresa?: Company;
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const token = ref<string | null>(localStorage.getItem('auth_token'));
    const sincronizerCode = ref<string | null>(localStorage.getItem('sincronizer_code'));
    const accessModes = ref<AccessMode[]>([]);
    const requiresCompany = ref<boolean | 'optional'>(true);
    const selectedCompany = ref<Partial<Company> | null>(null);
    const companies = ref<Company[]>([]); // Compatibilidad con código existente

    const isAuthenticated = computed(() => !!user.value && !!token.value);

    /**
     * Iniciar flujo OAuth - redirige a AccountsApp
     */
    async function login() {
        try {
            // 1. Obtener URL de autorización OAuth
            const response = await api.get('/api/auth/redirect');

            // 2. Redirigir al usuario a AccountsApp
            window.location.href = response.data.url;
        } catch (error: any) {
            console.error('Error al iniciar OAuth:', error);
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                config: error.config,
                response: error.response?.data
            });
            throw error;
        }
    }

    /**
     * Manejar callback OAuth con el código de autorización
     */
    async function handleOAuthCallback(code: string, state?: string) {
        try {
            // 3. Intercambiar código por token
            const response = await api.get('/api/auth/callback', {
                params: { code, state }
            });

            // 4. Guardar datos de autenticación
            const {
                token: sanctumToken,
                user: userData,
                access_modes,
                requires_company,
                companies: responseCompanies,
                sincronizer: responseSincronizer
            } = response.data;

            token.value = sanctumToken;
            user.value = userData;
            sincronizerCode.value = responseSincronizer;
            accessModes.value = access_modes || [];
            requiresCompany.value = requires_company;
            companies.value = responseCompanies || [];

            // Guardar en localStorage
            localStorage.setItem('auth_token', sanctumToken);
            localStorage.setItem('user', JSON.stringify(userData));
            if (responseSincronizer) {
                localStorage.setItem('sincronizer_code', responseSincronizer);
            }

            // 5. Si hay una sola empresa, seleccionarla automáticamente
            const companyModes = access_modes?.filter((mode: AccessMode) => mode.type === 'company') || [];
            if (companyModes.length === 1 && requires_company === true) {
                selectedCompany.value = companyModes[0];
            }

            return response.data;
        } catch (error) {
            console.error('Error en callback OAuth:', error);
            throw error;
        }
    }

    /**
     * Seleccionar empresa
     */
    async function selectCompany(companyId: number) {
        try {
            const response = await api.post('/api/select-company', {
                company_id: companyId
            });

            selectedCompany.value = response.data;
            return response.data;
        } catch (error) {
            console.error('Error al seleccionar empresa:', error);
            throw error;
        }
    }

    /**
     * Obtener usuario autenticado
     */
    async function fetchUser() {
        try {
            const response = await api.get('/api/user');
            user.value = response.data.user;
            selectedCompany.value = response.data.selected_company_id ? {
                id: response.data.selected_company_id
            } : null;
            return response.data;
        } catch (error) {
            // Si falla, limpiar autenticación
            logout();
            throw error;
        }
    }

    /**
     * Cerrar sesión
     */
    async function logout() {
        try {
            if (token.value) {
                await api.post('/api/logout', {
                    sincronizer: sincronizerCode.value
                });
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            // Limpiar estado local
            user.value = null;
            token.value = null;
            sincronizerCode.value = null;
            accessModes.value = [];
            selectedCompany.value = null;
            companies.value = [];

            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            localStorage.removeItem('sincronizer_code');
            localStorage.removeItem('current_context');
        }
    }

    return {
        user,
        token,
        sincronizerCode,
        isAuthenticated,
        accessModes,
        requiresCompany,
        selectedCompany,
        companies,
        login,
        handleOAuthCallback,
        selectCompany,
        fetchUser,
        logout
    };
});
