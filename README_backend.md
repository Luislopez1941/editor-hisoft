# Servidor Backend para Editor Web

Este servidor Python maneja las peticiones del editor web, compila las secciones a HTML y almacena las páginas en una base de datos SQLite.

## Características

- **Compilación de HTML**: Convierte las secciones del editor en HTML completo
- **Almacenamiento**: Guarda páginas en base de datos SQLite
- **API REST**: Endpoints para guardar, obtener y compilar páginas
- **CORS habilitado**: Para desarrollo frontend
- **Compatibilidad**: Con todos los endpoints del frontend

## Instalación

1. **Instalar dependencias**:
```bash
pip install -r requirements.txt
```

2. **Ejecutar el servidor**:
```bash
python backend_server.py
```

El servidor se ejecutará en `http://localhost:84`

## Endpoints Disponibles

### Guardar Página
- **URL**: `POST /api_dev/guardarPagina`
- **Descripción**: Guarda una página en la base de datos
- **Body**: 
```json
{
  "nombre": "Mi Página",
  "descripcion": "Descripción de la página",
  "contenido": "{\"secciones\": {...}}"
}
```

### Obtener Página Específica
- **URL**: `GET /api_dev/getPaginaCompleta/<nombre>`
- **Descripción**: Obtiene una página por nombre
- **Respuesta**: JSON con datos de la página

### Obtener Todas las Páginas
- **URL**: `GET /api_dev/getTodasLasPaginas`
- **Descripción**: Lista todas las páginas disponibles
- **Respuesta**: Array de páginas

### Compilar HTML
- **URL**: `POST /api_dev/compilarHTML`
- **Descripción**: Compila secciones a HTML sin guardar
- **Body**:
```json
{
  "sections": {
    "home": {
      "elements": [...]
    }
  }
}
```

### Artículos (Simulación)
- **URL**: `POST /api_dev/articulos_get`
- **Descripción**: Simula obtención de artículos para catálogos

### Login (Simulación)
- **URL**: `POST /api_dev/usuario_login`
- **Descripción**: Simula autenticación de usuario

## Estructura de Base de Datos

```sql
CREATE TABLE paginas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT UNIQUE NOT NULL,
    descripcion TEXT,
    contenido TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Tipos de Elementos Soportados

1. **text**: Elementos de texto con estilos
2. **image**: Imágenes
3. **button**: Botones con estilos
4. **catalog**: Catálogos de productos
5. **container**: Contenedores

## Propiedades de Elementos

- `fontSize`: Tamaño de fuente
- `fontWeight`: Peso de fuente
- `color`: Color del texto
- `backgroundColor`: Color de fondo
- `textAlign`: Alineación de texto
- `position`: Posición absoluta (x, y)
- `size`: Tamaño (width, height)

## Configuración

El servidor está configurado para:
- **Host**: 0.0.0.0 (accesible desde cualquier IP)
- **Puerto**: 84
- **Debug**: Habilitado para desarrollo
- **CORS**: Habilitado para frontend

## Uso con Frontend

El servidor es compatible con el frontend React y maneja todas las peticiones necesarias:

1. **Guardar proyectos**: `guardarPagina`
2. **Cargar páginas**: `getPaginaCompleta`
3. **Listar páginas**: `getTodasLasPaginas`
4. **Compilar HTML**: `compilarHTML`
5. **Artículos**: `articulos_get`

## Notas

- La base de datos se crea automáticamente en `web_editor.db`
- Los endpoints de artículos y login son simulaciones para compatibilidad
- El HTML generado incluye CSS inline para estilos
- Soporte completo para modales y catálogos de productos 