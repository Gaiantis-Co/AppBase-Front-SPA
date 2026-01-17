# Guía de Hosting y Despliegue Multi-Entorno

Esta guía explica cómo configurar el proyecto para que funcione correctamente tanto en un servidor local (Laragon/Apache) como en GitHub Pages de forma automática.

## 1. Configuración de Vite (`vite.config.ts`)

Para soportar diferentes rutas base (raíz en local, subcarpeta en GitHub Pages), usamos la variable de entorno `VITE_BASE_PATH`.

```typescript
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  // ... resto de la configuración
})
```

## 2. Configuración de Variables de Entorno

### Local (`.env`)
Para Laragon (donde la app suele estar en la raíz de un dominio virtual):
```dotenv
VITE_BASE_PATH=/
```

### GitHub Pages (Configurado en el Workflow)
En el archivo `.github/workflows/deploy.yml`, añadimos la variable al paso de build:
```yaml
      - name: Build Vue app
        env:
          VITE_BASE_PATH: /Nombre-De-Tu-Repo/
        run: npm run build
```

## 3. Enrutamiento SPA con `.htaccess` Dinámico

Para que las rutas de Vue (`vue-router`) funcionen en Apache al recargar la página, necesitamos un archivo `.htaccess`. Como la ruta base cambia según el entorno, automatizamos su creación.

### Paso A: Crear el script de apoyo
Crea `scripts/configure-htaccess.js`:
```javascript
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
dotenv.config({ path: path.join(rootDir, '.env') });

const basePath = process.env.VITE_BASE_PATH || '/';
const htaccessPath = path.join(rootDir, 'dist', '.htaccess');

if (fs.existsSync(htaccessPath)) {
  let content = fs.readFileSync(htaccessPath, 'utf8');
  const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
  
  content = content.replace(/RewriteBase\s+\//g, `RewriteBase ${normalizedBase}`);
  content = content.replace(/RewriteRule\s+\.\s+\/index\.html/g, `RewriteRule . ${normalizedBase}index.html`);
  
  fs.writeFileSync(htaccessPath, content);
  console.log('.htaccess actualizado con base:', normalizedBase);
}
```

### Paso B: Actualizar `package.json`
Modifica el script de build para ejecutar el configurador:
```json
"scripts": {
  "build": "vite build && node scripts/configure-htaccess.js"
}
```

### Paso C: Archivo base `public/.htaccess`
Crea el archivo base en `public/.htaccess` con rutas a la raíz:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## 4. Configurar Laragon

Para que Vite funcione correctamente en Laragon:
1. Asegúrate de que el `DocumentRoot` en la configuración de Apache de Laragon apunte a la carpeta `/dist` del proyecto, **no** a la raíz ni a `public`.
2. Ejemplo de configuración en Laragon (`sites-enabled/tu-app.conf`):
   ```apache
   DocumentRoot "C:/laragon/www/tu-proyecto/dist"
   <Directory "C:/laragon/www/tu-proyecto/dist">
   ```

## 5. Configuración de CORS (Backend)

Si el frontend está en un dominio distinto al backend (ej: `app-front.test` vs `app-back.test`), debes añadir el dominio del frontend en el archivo `.env` del Backend:

```dotenv
ALLOWED_ORIGINS="...,https://app-front.test"
```
Luego ejecuta `php artisan config:clear` en el proyecto Laravel.
