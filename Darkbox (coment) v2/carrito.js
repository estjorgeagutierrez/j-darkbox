/*
   ══════════════════════════════════════════════════════════════════════
   DARKBOX — carrito.js  (versión Supabase)
   Módulo central del carrito de compras.

   CAMBIO PRINCIPAL vs versión anterior:
   Ya NO usa localStorage. Ahora guarda en la tabla "carrito" de Supabase.
   Todas las funciones ahora son ASYNC (usan await internamente).

   Requiere que supabase.js se cargue ANTES de este archivo.

   ── CÓMO USAR EN UNA PÁGINA ──
   1. Espera el evento 'db-listo' antes de llamar funciones.
   2. Usa await porque todo es asíncrono:

   document.addEventListener('db-listo', async function() {
       var lista = await Carrito.obtener();
       var badge = await Carrito.actualizarBadge();
   });

   ── FUNCIONES DISPONIBLES ──
   await Carrito.agregar(juego)         → true si se agregó, false si ya existía
   await Carrito.eliminar(juegoId)      → elimina del carrito
   await Carrito.obtener()              → array de juegos en el carrito
   await Carrito.total()                → suma total en pesos
   await Carrito.contiene(juegoId)      → true/false
   await Carrito.actualizarBadge()      → actualiza el contador rojo del header
         Carrito.formatearPrecio(num)   → "$149.000" (no es async)
         Carrito.notificar(msg, tipo)   → toast flotante (no es async)
   ══════════════════════════════════════════════════════════════════════
*/

var Carrito = (function () {

    return {

        /* ── AGREGAR UN JUEGO ────────────────────────────────────────
           Recibe: { id, nombre, genero, precio, imagen }
           Devuelve: true si se agregó, false si ya estaba.

           Uso:
             var ok = await Carrito.agregar(JUEGO);
        ─────────────────────────────────────────────────────────── */
        agregar: async function (juego) {
            /* Verificar si ya está en la biblioteca (no comprar dos veces) */
            var yaComprado = await db.biblioteca.contiene(juego.id);
            if (yaComprado) return false;

            /* Agregar al carrito en Supabase */
            var agregado = await db.carrito.agregar(juego);

            if (agregado) {
                await this.actualizarBadge();
            }

            return agregado;
        },


        /* ── ELIMINAR UN JUEGO ───────────────────────────────────────
           Recibe: el id del juego (ej: "helldrivers2")
        ─────────────────────────────────────────────────────────── */
        eliminar: async function (juegoId) {
            await db.carrito.eliminar(juegoId);
            await this.actualizarBadge();
        },


        /* ── OBTENER TODOS LOS JUEGOS ────────────────────────────────
           Devuelve el array de juegos del carrito actual.
        ─────────────────────────────────────────────────────────── */
        obtener: async function () {
            return await db.carrito.obtener();
        },


        /* ── CONTIENE ────────────────────────────────────────────────
           true si el juego ya está en el carrito.
        ─────────────────────────────────────────────────────────── */
        contiene: async function (juegoId) {
            return await db.carrito.contiene(juegoId);
        },


        /* ── CALCULAR TOTAL ──────────────────────────────────────────
           Suma los precios de todos los juegos.
        ─────────────────────────────────────────────────────────── */
        total: async function () {
            var lista = await db.carrito.obtener();
            return lista.reduce(function (suma, item) {
                return suma + item.precio;
            }, 0);
        },


        /* ── FORMATEAR PRECIO ────────────────────────────────────────
           149000 → "$149.000"
           Esta función NO es async porque no necesita Supabase.
        ─────────────────────────────────────────────────────────── */
        formatearPrecio: function (numero) {
            return '$' + numero.toLocaleString('es-CO');
        },


        /* ── ACTUALIZAR BADGE DEL HEADER ─────────────────────────────
           Actualiza el contador rojo encima del botón Carrito.
        ─────────────────────────────────────────────────────────── */
        actualizarBadge: async function () {
            var cantidad = await db.carrito.contar();

            /* Badge escritorio */
            var badge = document.getElementById('carrito-badge');
            if (badge) {
                badge.style.display = cantidad === 0 ? 'none' : 'flex';
                badge.textContent = cantidad;
            }

            /* Badge menú móvil */
            var badgesMovil = document.querySelectorAll('.carrito-badge-movil');
            for (var i = 0; i < badgesMovil.length; i++) {
                badgesMovil[i].style.display = cantidad === 0 ? 'none' : 'flex';
                badgesMovil[i].textContent = cantidad;
            }
        },


        /* ── NOTIFICAR (Toast) ───────────────────────────────────────
           Muestra un mensaje flotante. tipo: "ok" o "aviso".
           Esta función NO es async.
        ─────────────────────────────────────────────────────────── */
        notificar: function (mensaje, tipo) {
            var existente = document.getElementById('darkbox-toast');
            if (existente) existente.remove();

            var toast = document.createElement('div');
            toast.id = 'darkbox-toast';

            toast.style.cssText = [
                'position: fixed',
                'bottom: 28px',
                'right: 28px',
                'z-index: 9999',
                'padding: 14px 22px',
                'border-radius: 10px',
                'font-family: Inter, sans-serif',
                'font-size: 0.95rem',
                'font-weight: 600',
                'color: white',
                'box-shadow: 0 4px 20px rgba(0,0,0,0.4)',
                'transition: opacity 0.4s ease, transform 0.4s ease',
                'opacity: 0',
                'transform: translateY(12px)'
            ].join(';');

            toast.style.background = (tipo === 'ok')
                ? 'linear-gradient(90deg, #16a34a, #22c55e)'
                : 'linear-gradient(90deg, #b45309, #f59e0b)';

            toast.textContent = mensaje;
            document.body.appendChild(toast);

            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    toast.style.opacity = '1';
                    toast.style.transform = 'translateY(0)';
                });
            });

            setTimeout(function () {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(12px)';
                setTimeout(function () {
                    if (toast.parentNode) toast.remove();
                }, 400);
            }, 3000);
        }

    };

})();


/* ══════════════════════════════════════════════════════════════════════
   INICIALIZACIÓN AUTOMÁTICA
   Cuando Supabase está listo, actualizamos el badge del header.
   ══════════════════════════════════════════════════════════════════════ */
document.addEventListener('db-listo', async function () {
    await Carrito.actualizarBadge();
});