# FlorGest

FlorGest es un sistema diseñado para facilitar la gestión comercial e inventario en la industria floricultora. La plataforma permite controlar el catálogo de productos, gestionar compras a proveedores, registrar ventas y visualizar reportes para apoyar la toma de decisiones.

## 🎯 Objetivos y Módulos Principales

El sistema está compuesto por los siguientes módulos principales, orientados a diferentes tipos de usuarios (Administrador, Vendedor, Cliente):

- **Usuarios y Accesos:** Inicio de sesión seguro para validación y acceso según el rol del usuario (Administrador / Vendedor).
- **Catálogo e Inventario:** Visualización de las flores disponibles, precio, categoría y control de stock actual.
- **Registro de Compras:** Funcionalidad para que el administrador registre compras a proveedores, aumentando automáticamente el inventario disponible.
- **Registro de Ventas:** Interfaz para que el vendedor seleccione productos, calcule totales y genere comprobantes (boletas) tras la venta.
- **Reportes:** Visualización del historial de ventas, compras e inventario (productos disponibles y de bajo stock) para analizar el negocio y tomar decisiones.

## 💻 Stack Tecnológico

La plataforma se ha desarrollado separando las responsabilidades de frontend y backend:

- **Frontend:** React, Next.js y Tailwind CSS (ubicado en `florgest-frontend`).
- **Backend:** Java con Spring Boot (ubicado en `florgest-backend`).

## 👥 Equipo de Desarrollo

- **Nicol González Cobi:** Product Backlog, historias de usuario y criterios de aceptación.
- **Valentina Santana Guajardo:** Prototipo e interfaces.
- **Abraham Vivas Hernández:** Control de versiones y organización del proyecto.
- **Martin Papic:** UML, diseño de datos y arquitectura.

## 🚀 Cómo arrancar el proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/florgest.git
cd florgest
```

### 2. Ejecutar el Backend (Spring Boot)

Navega al directorio del backend e inicia la aplicación:

```bash
cd florgest-backend
# En Windows:
mvnw.cmd spring-boot:run
# En Linux/macOS:
./mvnw spring-boot:run
```
El servidor backend se ejecutará en `http://localhost:8080`.

### 3. Ejecutar el Frontend (Next.js)

Navega al directorio del frontend, instala las dependencias e inicia el servidor:

```bash
cd florgest-frontend
npm install
npm run dev
```
La aplicación web estará disponible en `http://localhost:3000`.

## 🔀 Control de Versiones (Flujo de Trabajo)

Este proyecto utiliza GitHub como herramienta de control de versiones.
- **Rama principal:** Se utiliza la rama `main` para mantener la versión estable del proyecto.
- **Ramas secundarias:** Cualquier funcionalidad o actualización nueva se debe realizar en ramas secundarias.
- **Commits:** Se deben utilizar commits descriptivos para mantener el historial claro.
- **Integración:** Revisar los cambios de la rama secundaria antes de integrarlos a la rama `main`.