# criptosistemas-clave-publica-s3

Blog de demostración sobre criptosistemas de clave pública (RSA, Web Crypto API).

Contenido
- Código fuente: `src/` (componentes, datos, librerías de demo).
- Datos de las entradas: `src/data/sections.js` (estructura JSON que alimenta el sitio).

Servir localmente

Usa un servidor estático en el directorio del proyecto (no abrir archivos con `file://`):

```bash
python -m http.server 8000
# o con Node.js (si instalaste http-server):
npx http-server -p 8000
```

Abrir http://localhost:8000/ en el navegador.

Notas de desarrollo
- Solo dependencias nativas del navegador (ES Modules). Archivos principales:
	- `src/main.js` — inicialización y routing básico.
	- `src/components/sectionCard.js` — renderer de secciones y bloques.
	- `src/data/sections.js` — contenido (array `sections`).
	- `src/lib/CriptoRSA.js` — módulo demo de RSA (Web Crypto API).

Estructura de los datos (`src/data/sections.js`)

Cada entrada es un objeto con las siguientes claves (ejemplos en español):

- `id` (string): identificador único para anclaje/URL.
- `title` (string): título de la entrada.
- `subtitle` (string): subtítulo opcional.
- `icon` (string): ruta a icono (se prefiere `.svg`, acepta `.webp` con fallback).
- `image` (string): imagen principal (opcional).
- `excerpt` (string): resumen corto para lista.
- `sources` (array of string): lista de fuentes / URLs.
- `content` (array): array de bloques. Cada bloque puede ser uno de los tipos siguientes:

	- `paragraph` / `html`:
		- `type`: 'paragraph' o 'html'
		- `text`: contenido HTML/texto.
		- `image`, `alt`, `imageWidth`, `imageHeight`: opcionales para insertar imagen dentro del bloque.

	- `image`:
		- `type`: 'image'
		- `src`: ruta de la imagen
		- `alt`, `align`, `width`, `height`: opcionales

	- `code`:
		- `type`: 'code'
		- `language`: 'javascript', 'html', etc. (opcional)
		- `code`: contenido inline (string)
		- `module`: ruta a un módulo JS cuyo código puede importarse/descargarse para mostrar
		- `show`: boolean — si está presente, el renderer añadirá un botón toggle "Mostrar/Ocultar código" (si `true` mostrará inicialmente)

	- `table`:
		- `type`: 'table'
		- `headers`: array de strings
		- `rows`: array de filas (cada fila es array de celdas)

	- `demo`:
		- `type`: 'demo'
		- `module`: ruta al módulo que expone la API usada en la demo (por ejemplo `../lib/CriptoRSA.js`)
		- `label`, `placeholder`, `example`, `buttonText`: textos para la UI del demo
		- `show`: opcional (mismo comportamiento que en `code` para mostrar código fuente del módulo)

Contribuir
- Haz cambios y prueba localmente con un servidor estático.
- Si quieres que haga el `git commit` y `push`, dímelo y lo realizo.

Licencia
- Proyecto de ejemplo / educativo.
