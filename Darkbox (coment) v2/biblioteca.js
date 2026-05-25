/*
   ══════════════════════════════════════════════════════════════════════
   DARKBOX — biblioteca.js  (versión Supabase)
   Módulo de la biblioteca personal del usuario.

   CAMBIO PRINCIPAL vs versión anterior:
   Ya NO usa localStorage. Ahora lee de la tabla "biblioteca" de Supabase.
   guardarCompra() ya NO existe aquí — esa lógica la hace la función SQL
   completar_compra() llamada desde pago.html vía db.completarCompra().

   Requiere que supabase.js se cargue ANTES de este archivo.

   ── FUNCIONES DISPONIBLES ──
   await Biblioteca.obtener()          → array de juegos comprados
   await Biblioteca.contiene(juegoId) → true si el juego ya fue comprado
         Biblioteca.contar()           → (async) cuántos juegos tiene el usuario
   ══════════════════════════════════════════════════════════════════════
*/

var Biblioteca = (function () {

    return {

        /* ── OBTENER TODOS LOS JUEGOS ────────────────────────────────
           Devuelve el array completo de juegos en la biblioteca.
           Cada objeto tiene: juego_id, nombre, genero, precio,
                              imagen, key_activacion, creado_en

           Uso:
             var juegos = await Biblioteca.obtener();
        ─────────────────────────────────────────────────────────── */
        obtener: async function () {
            return await db.biblioteca.obtener();
        },


        /* ── CONTIENE UN JUEGO ───────────────────────────────────────
           Recibe el id del juego y devuelve true si ya fue comprado.
           Se usa en las páginas de juego para deshabilitar el botón.

           Uso:
             if (await Biblioteca.contiene("helldrivers2")) { ... }
        ─────────────────────────────────────────────────────────── */
        contiene: async function (juegoId) {
            return await db.biblioteca.contiene(juegoId);
        },


        /* ── CONTAR JUEGOS ───────────────────────────────────────────
           Devuelve cuántos juegos tiene el usuario en su biblioteca.
        ─────────────────────────────────────────────────────────── */
        contar: async function () {
            var lista = await db.biblioteca.obtener();
            return lista.length;
        }

    };

})();