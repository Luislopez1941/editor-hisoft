# 🎨 Web Editor - Editor de Páginas Web Tipo Wix

Un editor web completo y moderno para crear páginas web de manera visual, similar a Wix. Construido con React, Vite y styled-components.

## ✨ Características Principales

### 🎯 Editor Visual
- **Drag & Drop**: Arrastra elementos desde el sidebar al canvas
- **Edición en Tiempo Real**: Modifica propiedades y ve los cambios instantáneamente
- **Vista Previa**: Cambia entre modo edición y vista previa
- **Zoom**: Controla el nivel de zoom del canvas (25% - 200%)

### 📦 Elementos Disponibles
- **Layout**: Secciones, Contenedores, Grid, Columnas, Filas
- **Contenido**: Texto, Títulos, Párrafos, Listas
- **Media**: Imágenes, Videos, Galerías
- **Formas**: Rectángulos, Círculos, Triángulos
- **Interactivos**: Botones, Formularios, Menús
- **Negocios**: Contacto, Mapas, Calendarios, Tiendas
- **Social**: Iconos sociales, Reseñas, Botones de like
- **Avanzado**: Código HTML, Embeds, Personalizados

### 🎨 Personalización
- **Colores**: Selector de colores para fondo y texto
- **Tipografía**: Fuente, tamaño, peso, alineación
- **Layout**: Posición, tamaño, padding, margin
- **Estilos**: Bordes, border-radius, efectos

### 💾 Funcionalidades
- **Guardar Proyecto**: Exporta tu proyecto como JSON
- **Exportar HTML**: Genera código HTML listo para usar
- **Historial**: Undo/Redo de acciones
- **Responsive**: Vista previa en diferentes dispositivos

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd web-editor

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

### Scripts Disponibles
```bash
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Construye para producción
npm run preview      # Vista previa de la build
npm run lint         # Ejecuta el linter
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── Sidebar.jsx     # Panel lateral con elementos
│   ├── Toolbar.jsx     # Barra de herramientas
│   ├── Canvas.jsx      # Área de edición principal
│   ├── ElementRenderer.jsx # Renderizador de elementos
│   └── PropertyPanel.jsx   # Panel de propiedades
├── context/
│   └── EditorContext.jsx   # Contexto global del editor
├── App.jsx             # Componente principal
└── main.jsx           # Punto de entrada
```

## 🎮 Cómo Usar

### 1. Agregar Elementos
- Navega por las categorías en el sidebar izquierdo
- Haz clic en cualquier elemento para agregarlo al canvas
- Los elementos se posicionan automáticamente

### 2. Editar Elementos
- Selecciona un elemento haciendo clic en él
- Usa el panel de propiedades en la derecha para modificar:
  - **Contenido**: Texto, imágenes, enlaces
  - **Estilos**: Colores, fuentes, tamaños
  - **Layout**: Posición, dimensiones, espaciado

### 3. Mover y Redimensionar
- Arrastra elementos para moverlos
- Usa los controles de redimensionamiento para cambiar el tamaño
- Los elementos se ajustan automáticamente a la cuadrícula

### 4. Vista Previa
- Haz clic en el botón "Preview" en la toolbar
- Ve cómo se verá tu página web
- Haz clic en "Exit Preview" para volver a editar

### 5. Guardar y Exportar
- **Guardar**: Exporta tu proyecto como archivo JSON
- **Exportar**: Genera código HTML listo para usar

## 🛠️ Tecnologías Utilizadas

- **React 19**: Framework principal
- **Vite**: Build tool y dev server
- **styled-components**: Estilos CSS-in-JS
- **@dnd-kit**: Drag and drop functionality
- **lucide-react**: Iconos modernos
- **framer-motion**: Animaciones

## 🎨 Personalización

### Agregar Nuevos Elementos
Para agregar un nuevo tipo de elemento:

1. Agrega el elemento en `Sidebar.jsx` en la categoría correspondiente
2. Implementa el renderizado en `ElementRenderer.jsx`
3. Agrega las propiedades en `PropertyPanel.jsx`

### Modificar Estilos
Los estilos están organizados en:
- `src/App.css`: Estilos globales
- `src/index.css`: Estilos base y utilidades
- Componentes individuales: Estilos específicos con styled-components

## 📱 Responsive Design

El editor es completamente responsive:
- **Desktop**: Panel completo con sidebar, toolbar y property panel
- **Tablet**: Paneles ajustados para pantallas medianas
- **Mobile**: Interfaz optimizada para pantallas pequeñas

## 🔧 Configuración Avanzada

### Variables de Entorno
```bash
VITE_API_URL=your-api-url
VITE_APP_NAME=Web Editor
```

### Personalización de Temas
Modifica las variables CSS en `src/index.css`:
```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #6b7280;
  --background-color: #f5f5f5;
  --text-color: #1a1a1a;
}
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- Inspirado en editores como Wix, Webflow y Figma
- Iconos proporcionados por [Lucide](https://lucide.dev/)
- Componentes de drag & drop por [@dnd-kit](https://dndkit.com/)

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:
- Abre un issue en GitHub
- Contacta al equipo de desarrollo
- Revisa la documentación en el wiki

---

**¡Disfruta creando páginas web increíbles! 🎉**
