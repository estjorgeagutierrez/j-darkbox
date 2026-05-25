/*
   DARKBOX — supabase.js (versión producción)
   Detecta automáticamente si estás en local o en producción.
*/
 
(function () {
 
    var esLocal = (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
    );
 
    var API_URL = esLocal
        ? 'http://localhost:3000'
        : 'https://j-back-darkbox.onrender.com';
 
    var TOKEN_KEY = 'darkbox_token';
 
    function getToken()   { return localStorage.getItem(TOKEN_KEY) || null; }
    function saveToken(t) { localStorage.setItem(TOKEN_KEY, t); }
    function delToken()   { localStorage.removeItem(TOKEN_KEY); }
 
    async function call(metodo, ruta, body, conAuth) {
        var headers = { 'Content-Type': 'application/json' };
        if (conAuth) {
            var t = getToken();
            if (t) headers['Authorization'] = 'Bearer ' + t;
        }
        var opts = { method: metodo, headers: headers };
        if (body) opts.body = JSON.stringify(body);
        try {
            var res  = await fetch(API_URL + ruta, opts);
            var data = await res.json();
            console.log('[db]', metodo, ruta, data.ok ? 'OK' : 'ERROR: ' + data.error);
            return data;
        } catch (e) {
            console.error('[db] Sin conexión:', metodo, ruta, e.message);
            return { ok: false, error: 'Sin conexión con el servidor.' };
        }
    }
 
    window.db = {
 
        auth: {
            login: async function (email, password) {
                var r = await call('POST', '/api/auth/login', { email: email, password: password });
                if (r.ok && r.token) saveToken(r.token);
                return r;
            },
            registrar: async function (email, password, nombre) {
                return await call('POST', '/api/auth/registro', { email: email, password: password, nombre: nombre });
            },
            logout: async function () {
                await call('POST', '/api/auth/logout', null, true);
                delToken();
            },
            obtenerUsuario: async function () {
                var r = await call('GET', '/api/auth/usuario', null, true);
                return r.ok ? r.usuario : null;
            },
            haySesion: async function () {
                if (!getToken()) return false;
                var r = await call('GET', '/api/auth/sesion', null, true);
                return !!(r.ok && r.activa);
            }
        },
 
        carrito: {
            agregar: async function (juego) {
                var r = await call('POST', '/api/carrito', {
                    id: juego.id, nombre: juego.nombre,
                    genero: juego.genero || '', precio: juego.precio,
                    imagen: juego.imagen || ''
                }, true);
                return r.ok;
            },
            obtener: async function () {
                var r = await call('GET', '/api/carrito', null, true);
                return r.ok ? r.datos : [];
            },
            eliminar: async function (juegoId) {
                await call('DELETE', '/api/carrito/' + juegoId, null, true);
            },
            contiene: async function (juegoId) {
                var r = await call('GET', '/api/carrito/contiene/' + encodeURIComponent(juegoId), null, true);
                return !!(r.ok && r.contiene);
            },
            vaciar: async function () {
                await call('DELETE', '/api/carrito', null, true);
            },
            contar: async function () {
                var r = await call('GET', '/api/carrito/total', null, true);
                return r.ok ? (r.cantidad || 0) : 0;
            }
        },
 
        biblioteca: {
            obtener: async function () {
                var r = await call('GET', '/api/biblioteca', null, true);
                return r.ok ? r.datos : [];
            },
            contiene: async function (juegoId) {
                var r = await call('GET', '/api/biblioteca/contiene/' + encodeURIComponent(juegoId), null, true);
                return !!(r.ok && r.contiene);
            }
        },
 
        completarCompra: async function (metodo) {
            return await call('POST', '/api/compra/completar', { metodoPago: metodo }, true);
        }
    };
 
    setTimeout(function () { document.dispatchEvent(new Event('db-listo')); }, 50);
 
})();