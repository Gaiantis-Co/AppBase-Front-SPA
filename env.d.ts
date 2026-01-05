/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BACKEND_URL: string
    readonly VITE_ACCOUNTS_APP_URL: string
    readonly VITE_APP_NAME: string
    readonly VITE_APP_VERSION: string
    readonly VITE_SSO_REDIRECT_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
