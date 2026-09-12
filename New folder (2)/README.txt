# Página romántica de rosas 🌹

## Archivos

- `index.html` → estructura de la página.
- `style.css` → diseño, responsive y animaciones.
- `script.js` → contraseña, pétalos, interacción y transición.
- `imagenes/` → coloca aquí tus fotografías.

## Cambiar la contraseña

Abre `script.js` y busca:

```js
password: "020626",
```

Cámbialo, por ejemplo:

```js
password: "NICOLExD",
```

## Agregar tu mensaje

Abre `index.html` y busca:

`TU MENSAJE EMPIEZA AQUÍ`

Puedes reemplazar los párrafos de ejemplo por tu carta completa.

## Agregar imágenes

Crea una carpeta llamada `imagenes` junto a `index.html`.

Ejemplo:

```text
pagina_amor/
├── index.html
├── style.css
├── script.js
└── imagenes/
    ├── foto1.jpg
    ├── foto2.jpg
    └── foto3.jpg
```

Después, en `index.html`:

```html
<img src="imagenes/foto3.jpg" alt="Nuestro recuerdo">
```

## Abrirla

No necesita servidor para probarla. Puedes abrir `index.html` directamente en el navegador.

Para publicarla, también funciona bien con GitHub Pages.
