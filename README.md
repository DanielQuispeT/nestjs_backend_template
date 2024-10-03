## Uso del proyecto para empezar un nuevo proyecto

# Guía rápida de uso: Módulo de Autenticación y Permisos

Este módulo proporciona autenticación segura y gestión de roles y permisos para aplicaciones NestJS. Aquí aprenderás cómo integrarlo rápidamente en tu proyecto.

## 1. Instalación Rápida

### Paso 1. **Clonar el repositorio base:**

```bash
git clone https://tu-repositorio/nestjs_backend_template nuevo-proyecto
```

- **`https://tu-repositorio/nestjs_backend_template`:** Reemplaza con la URL exacta de tu repositorio.
- **`nuevo-proyecto`:** El nombre que deseas asignar a tu nuevo proyecto.

### Paso 2. **Acceder al directorio del proyecto:**

```bash
cd nuevo-proyecto
```

### Paso 3. **Eliminar el repositorio remoto original:**

```bash
git remote remove origin
```

### Paso 4. **Agregar el nuevo repositorio remoto:**

```bash
git remote add origin https://tu-nuevo-repositorio.git
```

- **`https://tu-nuevo-repositorio.git`:** Reemplaza con la URL de tu nuevo repositorio en GitHub, GitLab o cualquier otra plataforma.

### Paso 5. **Buscar y reemplazar nombres:**

- **Utilizar un editor de código con búsqueda y reemplazo:** Herramientas como Visual Studio Code, Sublime Text o Atom ofrecen funciones de búsqueda y reemplazo global para encontrar y reemplazar todas las ocurrencias de un término en múltiples archivos.
- **Remplazamos:** Reemplazamos `nestjs_backend_template` por el nombre de tu nuevo proyecto, por ejemplo `nuevo-proyecto`.

### Paso 6. **Commit y push:**

No es necesario hacer el `git add .` ni el `git commit -m "Mensaje"` si no se realizo cambio antes de hacer el push.

```bash
git add .
git commit -m "Inicialización del proyecto [nuevo-proyecto]"
git push -u origin main
```

### Paso 7. **Instalar dependencias:**

Se instalan las dependencias del proyecto.

```bash
npm install
```

### Paso 8. **Configurar el archivo .env:**

- **Crear un archivo `.env`** si no existe.
- **Copiar el contenido del archivo `.env.example`** y pegarlo en el nuevo archivo `.env`, despues modificar los valores según correspoda.

### Paso 9. **Iniciar el proyecto:**

```bash
npm run start:dev
```

## 2. Personalización y Configuración

Si necesitas personalizar o ampliar este proyecto, puedes seguir las guías avanzadas en la [documentación completa](./README_detailed.md) que te guiará paso a paso para crear un proyecto desde cero.
