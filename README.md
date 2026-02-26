# Instalaciones previas

Guía paso a paso para configurar el entorno de desarrollo del proyecto React Native (Android y Web únicamente).

## Requisitos Previos

- Sistema operativo: Windows 10+, macOS 12+ o Linux (Ubuntu 20.04+)
- Mínimo 8 GB de RAM (recomendado 16 GB)
- Al menos 20 GB de espacio libre en disco

## 1. Instalar Node.js (v18+)

Descargar el instalador desde https://nodejs.org/ (versión LTS 18 o superior) y seguir el asistente de instalación.

### Verificar la instalación

```bash
node --version   # Debe mostrar v18.x.x o superior
npm --version    # Debe mostrar 9.x.x o superior
```

## 2. Instalar Expo (ÚNICA opción permitida)

Este proyecto utiliza Expo y es la única opción de desarrollo soportada.

```bash
npm install -g expo-cli
```

Verificar instalación:

```bash
expo --version
```

## 3. Configurar Android Studio y Emulador

Necesario únicamente para ejecutar la app en Android.

1. Descargar e instalar https://developer.android.com/studio
2. Durante la instalación, asegurarse de marcar:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)
3. Abrir Android Studio → More Actions → SDK Manager
4. En SDK Platforms, instalar:
   - Android 14 (API 34) o la versión más reciente
5. En SDK Tools, verificar que estén instalados:
   - Android SDK Build-Tools
   - Android Emulator
   - Android SDK Platform-Tools
6. Configurar variables de entorno (`~/.bashrc`, `~/.zshrc` o equivalente):

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

7. Crear un emulador:
   - Android Studio → More Actions → Virtual Device Manager
   - Create Device
   - Seleccionar dispositivo (ej. Pixel 7)
   - Seleccionar imagen del sistema (API 34)
   - Finalizar y ejecutar

### Verificar el emulador

```bash
adb devices   # Debe mostrar el emulador en la lista
```

## 4. Instalar Extensiones de VSCode

Instalar Visual Studio Code y añadir:

| Extensión | ID | Descripción |
|---|---|---|
| ESLint | `dbaeumer.vscode-eslint` | Linter para JavaScript/TypeScript |
| Prettier | `esbenp.prettier-vscode` | Formateador de código |
| React Native Tools | `msjsdiag.vscode-react-native` | Depuración |

Instalación por terminal:

```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension msjsdiag.vscode-react-native
```

## 5. Iniciar el Proyecto (Android y Web)

```bash
# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd <nombre-del-proyecto>

# Instalar dependencias
npm install

# Iniciar Expo
npx expo start
```

Una vez iniciado:

- Presionar **a** → Ejecutar en emulador Android
- Presionar **w** → Ejecutar en navegador (Web)