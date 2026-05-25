/*
   ══════════════════════════════════════════════════════════════════════
   DARKBOX — cookies.js
   Sistema de consentimiento de cookies.

   Cómo funciona:
   1. Al cargar cualquier página, revisa si el usuario ya respondió.
   2. Si no respondió aún, muestra el banner después de 0.5s.
   3. Si acepta → guarda "darkbox_cookies=aceptadas" en localStorage.
   4. Si rechaza → guarda "darkbox_cookies=rechazadas" en localStorage.
   5. Las próximas visitas no muestran el banner (ya hay respuesta).

   Para incluirlo en una página:
     <link rel="stylesheet" href="cookies.css">   ← en el <head>
     <script src="cookies.js"></script>            ← antes de </body>

   Para páginas en subcarpetas (proceso-compra/, juegos-ssesion/):
     <link rel="stylesheet" href="../cookies.css">
     <script src="../cookies.js"></script>
   ══════════════════════════════════════════════════════════════════════
*/

(function () {

    var CLAVE = 'darkbox_cookies';

    /* ── ¿YA RESPONDIÓ EL USUARIO? ──────────────────────────────────
       Si ya aceptó o rechazó, no mostramos el banner de nuevo. */
    var respuestaGuardada = localStorage.getItem(CLAVE);
    if (respuestaGuardada) return; /* salir sin hacer nada */


    /* ══════════════════════════════════════════════════════════════
       CREAR EL HTML DEL BANNER DINÁMICAMENTE
       Lo insertamos en el body para no tener que copiar HTML
       en cada página del proyecto.
       ══════════════════════════════════════════════════════════════ */
    var html = [
        /* Overlay semitransparente detrás del banner */
        '<div class="cookies-overlay" id="cookies-overlay"></div>',

        /* Banner principal */
        '<div class="cookies-banner" id="cookies-banner" role="dialog" aria-modal="true" aria-labelledby="cookies-titulo-id">',

        '  <div class="cookies-header">',
        '    <span class="cookies-icono" aria-hidden="true">🍪</span>',
        '    <h2 class="cookies-titulo" id="cookies-titulo-id">Usamos cookies</h2>',
        '  </div>',

        '  <p class="cookies-texto">',
        '    En DARKBOX usamos cookies propias y de terceros para mejorar tu experiencia,',
        '    mantener tu sesión iniciada y analizar el uso de la plataforma.',
        '    Puedes aceptar todas las cookies o rechazar las no esenciales.',
        '    Consulta nuestra <a href="#">Política de Cookies</a> para más información.',
        '  </p>',

        '  <div class="cookies-botones">',
        '    <button class="btn-cookies-aceptar" id="btn-aceptar-cookies"',
        '            onclick="Cookies.aceptar()">',
        '      ✓ Aceptar todas',
        '    </button>',
        '    <button class="btn-cookies-rechazar" id="btn-rechazar-cookies"',
        '            onclick="Cookies.rechazar()">',
        '      Rechazar no esenciales',
        '    </button>',
        '  </div>',

        '  <p class="cookies-nota">',
        '    Puedes cambiar tus preferencias en cualquier momento desde Configuración.',
        '  </p>',

        '</div>'
    ].join('\n');

    /* Insertar en el body */
    document.body.insertAdjacentHTML('beforeend', html);


    /* ── MOSTRAR EL BANNER con animación ─────────────────────────── */
    /* Pequeño retraso para que la animación se vea al entrar a la página */
    setTimeout(function () {
        var banner  = document.getElementById('cookies-banner');
        var overlay = document.getElementById('cookies-overlay');
        if (banner)  banner.classList.add('visible');
        if (overlay) overlay.classList.add('visible');
    }, 600);


    /* ══════════════════════════════════════════════════════════════
       API PÚBLICA: window.Cookies
       ══════════════════════════════════════════════════════════════ */
    window.Cookies = {

        /* ── ACEPTAR ─────────────────────────────────────────────── */
        aceptar: function () {
            localStorage.setItem(CLAVE, 'aceptadas');
            this._cerrar();

            /* Aquí podrías activar servicios de analítica, etc. */
            console.log('DARKBOX: cookies aceptadas');
        },

        /* ── RECHAZAR ────────────────────────────────────────────── */
        rechazar: function () {
            localStorage.setItem(CLAVE, 'rechazadas');
            this._cerrar();

            /* Aquí podrías desactivar cookies no esenciales */
            console.log('DARKBOX: cookies no esenciales rechazadas');
        },

        /* ── CERRAR EL BANNER (animación de salida) ──────────────── */
        _cerrar: function () {
            var banner  = document.getElementById('cookies-banner');
            var overlay = document.getElementById('cookies-overlay');

            if (banner)  banner.classList.remove('visible');
            if (overlay) overlay.classList.remove('visible');

            /* Eliminar del DOM después de que termine la animación */
            setTimeout(function () {
                if (banner  && banner.parentNode)  banner.remove();
                if (overlay && overlay.parentNode) overlay.remove();
            }, 400);
        },

        /* ── VERIFICAR ESTADO ────────────────────────────────────── */
        /* Devuelve "aceptadas", "rechazadas", o null si no respondió */
        estado: function () {
            return localStorage.getItem(CLAVE);
        },

        /* ── RESETEAR (para pruebas) ─────────────────────────────── */
        /* Llama Cookies.resetear() en la consola para ver el banner de nuevo */
        resetear: function () {
            localStorage.removeItem(CLAVE);
            location.reload();
        }
    };

})();