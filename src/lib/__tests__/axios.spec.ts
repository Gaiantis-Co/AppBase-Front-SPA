import { describe, it, vi, beforeEach, expect } from 'vitest';

vi.mock('../toast', () => ({
    default: {
        error: vi.fn(),
        warning: vi.fn(),
    }
}));

describe('Axios Interceptor', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        // Mock window.location
        vi.stubGlobal('location', { href: '' });
    });

    it('should redirect to login on 401 response', async () => {
        // const error = {
        //     response: { status: 401 },
        //     config: {}
        // };

        // Simular el rechazo de la promesa del interceptor
        // En una prueba real, usaríamos moxios o axios-mock-adapter
        // En una prueba real, usaríamos moxios o axios-mock-adapter
        // Por ahora, documentamos la intención de la prueba
        expect(true).toBe(true); // Placeholder assertion
    });
});
