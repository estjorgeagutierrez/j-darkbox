/*
   DARKBOX — volver.js
   Hace que el botón "← Volver" lleve al lugar correcto
   según de dónde vino el usuario.
   Incluir en cada juego antes de </body>:
     En raíz:         <script src="volver.js"></script>
     En juego-ssesion: <script src="../volver.js"></script>
*/
(function() {
    var btn = document.querySelector('a.btn-volver');
    if (!btn) return;

    var ref = document.referrer || '';
    var svg = btn.querySelector('svg') ? btn.querySelector('svg').outerHTML : '';

    /* Detectar si estamos en subcarpeta para ajustar las rutas */
    var enSubcarpeta = window.location.pathname.includes('juego-ssesion') ||
                       window.location.pathname.includes('juego-nsesion') ||
                       window.location.pathname.includes('proceso-compra');
    var prefijo = enSubcarpeta ? '../' : '';

    if (ref.includes('catalogo')) {
        btn.href = prefijo + 'catalogo.html';
        btn.innerHTML = svg + ' Volver al catálogo';
    } else if (ref.includes('home-sesion')) {
        btn.href = prefijo + 'home-sesion.html';
        btn.innerHTML = svg + ' Volver al inicio';
    } else {
        btn.href = prefijo + 'catalogo.html';
        btn.innerHTML = svg + ' Volver al catálogo';
    }
})();