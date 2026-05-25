/*
   DARKBOX — buscador.js
   Buscador global con desplegable. Va en la raíz del proyecto.
   Incluir en cada página antes de </body>:
     Raíz:        <script src="buscador.js"></script>
     Subcarpetas: <script src="../buscador.js"></script>
*/
(function () {

    var enSubcarpeta = window.location.pathname.includes('juego-ssesion') ||
                       window.location.pathname.includes('juego-nsesion') ||
                       window.location.pathname.includes('proceso-compra');
    var base = enSubcarpeta ? '../' : '';

    var API_URL = (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
    ) ? 'http://localhost:3000' : 'https://j-back-darkbox.onrender.com';

    /* ── JUEGOS ESTÁTICOS CON PRECIOS ─────────────────────────── */
    var JUEGOS_ESTATICOS = [
        {id:"helldrivers2",       precio:149000, nombre:"HELLDIVERS™ 2",                 genero:"JcE/Acción",           imagen:"https://a.storyblok.com/f/178900/768x432/1c7b91c44a/helldivers-2.jpg/m/filters:quality(95)format(webp)",        href:"juego-ssesion/juego-s-helldrivers2.html"},
        {id:"resident-evil-3",    precio:121800, nombre:"Resident Evil 3",                genero:"Acción/Aventura",      imagen:"https://imagenes.hobbyconsolas.com/files/image_640_360/uploads/imagenes/2023/04/25/690227fe3b5ba.jpeg",         href:"juego-ssesion/juego-s-resident-evil-3.html"},
        {id:"terraria",           precio:26000,  nombre:"Terraria",                       genero:"Sandbox",              imagen:"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/105600/capsule_616x353.jpg?t=1769844435",    href:"juego-ssesion/juego-s-terraria.html"},
        {id:"mortal-kombat-11",   precio:143999, nombre:"Mortal Kombat 11",               genero:"Lucha",                imagen:"https://i0.wp.com/nerfeados.com/wp-content/uploads/2019/05/MK11_Portada.jpg?fit=1024%2C576&ssl=1",             href:"juego-ssesion/juego-s-mortal-kombat-11.html"},
        {id:"peak",               precio:19000,  nombre:"PEAK",                           genero:"Multijugador",         imagen:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0oVEeG-Npltjzsc_XvP0d2D1O3BvZlBX_5Q&s",              href:"juego-ssesion/juego-s-peak.html"},
        {id:"deep-rock-galactic", precio:53000,  nombre:"Deep Rock Galactic",             genero:"Cooperativo/FPS",      imagen:"https://www.zonammorpg.com/wp-content/uploads/2020/04/deeprockgalacticpic04-1620x800.jpg",                     href:"juego-ssesion/juego-s-deep-rock-galactic.html"},
        {id:"darkwood",           precio:29900,  nombre:"Darkwood",                       genero:"Terror",               imagen:"https://image.api.playstation.com/vulcan/ap/rnd/202206/2011/zvvEqRTkLYJlNEKLz4hjwbGz.jpg",                     href:"juego-ssesion/juego-s-darkwood.html"},
        {id:"doom-eternal",       precio:120000, nombre:"DOOM Eternal",                   genero:"FPS/Acción",           imagen:"https://orgullogamers.com/wp-content/uploads/2020/05/doometernal.webp",                                        href:"juego-ssesion/juego-s-doom-eternal.html"},
        {id:"hunt-showdown-1896", precio:94000,  nombre:"Hunt: Showdown 1896",            genero:"Acción/Shooter",       imagen:"https://www.zonammorpg.com/wp-content/uploads/2024/08/huntshowdown1896-1620x800.jpg",                          href:"juego-ssesion/juego-s-hunt-showdown-1896.html"},
        {id:"death-stranding",    precio:129900, nombre:"DEATH STRANDING DIRECTOR'S CUT", genero:"Mundo abierto",        imagen:"https://cdn1.epicgames.com/offer/0a9e3c5ab6684506bd624a849ca0cf39/EGS_DeathStrandingDirectorsCut_KOJIMAPRODUCTIONS_S3_2560x1440-fe4e51f1801fba36e452aa3466625789", href:"juego-ssesion/juego-s-death-stranding.html"},
        {id:"astroner",           precio:70000,  nombre:"ASTRONEER",                      genero:"Espacial",             imagen:"https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_1240/b_white/f_auto/q_auto/store/software/switch/70010000037336/27b7c212e9900ebbf3fba4c6cb0d0d137e7d0be05f86ab5a954bb7d161e7fb64", href:"juego-ssesion/juego-s-astroner.html"},
        {id:"palworld",           precio:70000,  nombre:"Palworld",                       genero:"Aventura",             imagen:"https://phantom.estaticos-marca.com/9be94779ed15ddbde4016330d68fb500/resize/828/f/jpg/assets/multimedia/imagenes/2024/01/10/17048900622330.jpg", href:"juego-ssesion/juego-s-palworld.html"},
        {id:"stalker-2",          precio:198900, nombre:"S.T.A.L.K.E.R. 2",              genero:"FPS",                  imagen:"https://locosxlosjuegos.com/wp-content/uploads/2026/01/S.T.A.L.K.E.R.-Heart-of-Chernobyl-Portada.jpg",         href:"juego-ssesion/juego-s-stalker-2.html"},
        {id:"the-long-dark",      precio:81000,  nombre:"The Long Dark",                  genero:"Supervivencia",        imagen:"https://cdn1.epicgames.com/58dfcd1952ee48c1a1fa31c6ace5fe3d/offer/EGS_TheLongDark_HinterlandStudioInc_S5-1920x1080-fcfdd407ac1990bec320b49101862585.jpg", href:"juego-ssesion/juego-s-the-long-dark.html"},
        {id:"rdr-2",              precio:239999, nombre:"Red Dead Redemption 2",          genero:"Mundo abierto",        imagen:"https://sm.ign.com/ign_latam/screenshot/default/rdr2_29y8.jpg",                                                href:"juego-ssesion/juego-s-rdr-2.html"},
        {id:"outlast",            precio:86000,  nombre:"The Outlast Trials",             genero:"Terror",               imagen:"https://media.vandal.net/m/80035/the-outlast-trials-2022103118301040_9.jpg",                                   href:"juego-ssesion/juego-s-outlast.html"},
        {id:"madness",            precio:33500,  nombre:"MADNESS: Project Nexus",         genero:"Hack and slash",       imagen:"https://static.wikia.nocookie.net/madnesscombat/images/2/26/ProjectNexus.jpg/revision/latest?cb=20221024203408&path-prefix=es", href:"juego-ssesion/juego-s-madness.html"},
        {id:"ultrakill",          precio:58800,  nombre:"ULTRAKILL",                      genero:"FPS/Retro",            imagen:"https://i.3djuegos.com/juegos/17573/fotos/ficha/-5268516.jpg",                                                 href:"juego-ssesion/juego-s-ultrakill.html"},
        {id:"brawlhalla",         precio:0,      nombre:"Brawlhalla",                     genero:"Lucha",                imagen:"https://cdn.aptoide.com/imgs/8/4/a/84aaa60ac0a211285722dfc7bffb134a_fgraphic.jpg",                            href:"juego-ssesion/juego-s-brawlhalla.html"},
        {id:"ball-x-pit",         precio:37500,  nombre:"BALL x PIT",                    genero:"Arcade",               imagen:"https://cdn.dlcompare.com/others_jpg/upload/news/image/ball-x-pit-is-expanding-with-new-541a4ac8-image-704004ab4.jpg.webp", href:"juego-ssesion/juego-s-ball-x-pit.html"},
        {id:"borderlands-3",      precio:169900, nombre:"Borderlands 3",                  genero:"Rol/Disparos",         imagen:"https://i.blogs.es/juegos/11199/borderlands_3/fotos/noticias/borderlands_3-4855853.jpg",                       href:"juego-ssesion/juego-s-borderlands-3.html"},
        {id:"dying-light",        precio:199900, nombre:"Dying Light: The Beast",         genero:"Zombie/Mundo abierto", imagen:"https://www.zonammorpg.com/wp-content/uploads/2026/03/Dying-Light-The-Beast-Restored-Land-key-visual.jpg",      href:"juego-ssesion/juego-s-dying-light.html"},
        {id:"look-outside",       precio:26000,  nombre:"Look Outside",                   genero:"Terror/RPG",           imagen:"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3373660/770f4d1538b590421beba1e1217d9e6a8411fde9/header_alt_assets_2.jpg", href:"juego-ssesion/juego-s-look-outside.html"},
        {id:"lethal-company",     precio:26000,  nombre:"Lethal Company",                 genero:"Cooperativo/Terror",   imagen:"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1966720/capsule_616x353.jpg?t=1762544438",   href:"juego-ssesion/juego-s-lethal-company.html"},
        {id:"cloverpit",          precio:26000,  nombre:"CloverPit",                      genero:"Roguelite",            imagen:"https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3314790/e6955b668c667da7b5019f481707f69b4fb814b5/capsule_616x353.jpg?t=1773337831", href:"juego-ssesion/juego-s-cloverpit.html"},
        {id:"crysol",             precio:43500,  nombre:"Crisol: Theater of Idols",       genero:"Terror/FPS",           imagen:"https://periodismo.ull.es/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-03-at-11.07.32.jpeg",               href:"juego-ssesion/juego-s-crysol.html"}
    ];

    var catalogo = JUEGOS_ESTATICOS.slice();

    /* Cargar juegos del admin */
    fetch(API_URL + '/api/juegos')
        .then(function(r){ return r.json(); })
        .then(function(data){
            if (!data.ok) return;
            var idsEstaticos = JUEGOS_ESTATICOS.map(function(j){ return j.id; });
            data.datos.forEach(function(j){
                if (!idsEstaticos.includes(j.id)) {
                    catalogo.push({
                        id:     j.id,
                        nombre: j.nombre,
                        genero: j.genero  || '',
                        precio: j.precio  || 0,
                        imagen: j.imagen  || '',
                        href:   'juego-dinamico.html?id=' + j.id
                    });
                }
            });
        })
        .catch(function(){});

    /* ── CREAR DROPDOWN ────────────────────────────────────────── */
    var dropdown = document.createElement('div');
    dropdown.id = 'buscador-dropdown';
    dropdown.style.cssText = [
        'background:#151d2e',
        'border:1px solid rgba(168,85,247,0.35)',
        'border-radius:10px',
        'overflow:hidden',
        'z-index:99999',
        'display:none',
        'box-shadow:0 8px 32px rgba(0,0,0,0.5)',
        'max-height:70vh',
        'overflow-y:auto'
    ].join(';');
    document.body.appendChild(dropdown);

    function posicionarDropdown() {
        var esMobil = window.innerWidth <= 768;
        if (esMobil) {
            dropdown.style.position = 'fixed';
            dropdown.style.top      = '70px';
            dropdown.style.left     = '10px';
            dropdown.style.right    = '10px';
            dropdown.style.width    = 'auto';
        } else {
            var input = document.querySelector('header .buscador');
            if (!input) return;
            var rect = input.getBoundingClientRect();
            dropdown.style.position = 'fixed';
            dropdown.style.top      = (rect.bottom + 6) + 'px';
            dropdown.style.left     = rect.left + 'px';
            dropdown.style.width    = rect.width + 'px';
            dropdown.style.right    = 'auto';
        }
    }

    function mostrarResultados(q) {
        if (!q || q.length < 2) { dropdown.style.display = 'none'; return; }

        var resultados = catalogo.filter(function(j){
            return j.nombre.toLowerCase().includes(q) ||
                   (j.genero || '').toLowerCase().includes(q);
        }).slice(0, 8);

        if (resultados.length === 0) {
            dropdown.innerHTML = '<div style="padding:16px 18px;font-family:Inter,sans-serif;font-size:0.9rem;color:#8888aa;">No se encontraron juegos</div>';
            posicionarDropdown();
            dropdown.style.display = 'block';
            return;
        }

        dropdown.innerHTML = resultados.map(function(j, idx) {
            var precio = j.precio === 0 ? 'GRATIS' : '$' + Number(j.precio).toLocaleString('es-CO');
            /* Ajustar href según si estamos en subcarpeta */
            var hrefFinal = enSubcarpeta ? '../' + j.href : j.href;
            var sep = idx > 0 ? '<div style="border-top:1px solid rgba(255,255,255,0.05);"></div>' : '';
            return sep + [
                '<a href="' + hrefFinal + '" style="display:flex;align-items:center;gap:12px;padding:10px 14px;text-decoration:none;transition:background 0.15s;"',
                ' onmouseover="this.style.background=\'rgba(168,85,247,0.12)\'"',
                ' onmouseout="this.style.background=\'transparent\'">',
                '  <img src="' + j.imagen + '" style="width:56px;aspect-ratio:16/9;object-fit:cover;border-radius:5px;flex-shrink:0;background:#0a0f1e;" onerror="this.style.background=\'#1a2540\'">',
                '  <div style="flex:1;min-width:0;">',
                '    <div style="font-family:Inter,sans-serif;font-weight:700;font-size:0.9rem;color:white;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + j.nombre + '</div>',
                '    <div style="font-family:Inter,sans-serif;font-size:0.78rem;color:#8888aa;margin-top:2px;">' + (j.genero || '') + '</div>',
                '  </div>',
                '  <span style="font-family:Inter,sans-serif;font-weight:700;font-size:0.88rem;color:#22c55e;flex-shrink:0;">' + precio + '</span>',
                '</a>'
            ].join('');
        }).join('');

        posicionarDropdown();
        dropdown.style.display = 'block';
    }

    function iniciarBuscador() {
        /* Busca TODOS los inputs del buscador en la página (header + menú móvil) */
        var inputs = document.querySelectorAll('header .buscador input, .menu-movil .buscador input');
        if (!inputs.length) return;

        inputs.forEach(function(input) {
            input.addEventListener('input', function() {
                mostrarResultados(this.value.trim().toLowerCase());
            });
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') { dropdown.style.display = 'none'; this.value = ''; }
            });
        });

        document.addEventListener('click', function(e) {
            var dentroDeAlgunBuscador = false;
            inputs.forEach(function(inp) {
                if (inp.closest('.buscador') && inp.closest('.buscador').contains(e.target)) {
                    dentroDeAlgunBuscador = true;
                }
            });
            if (!dentroDeAlgunBuscador && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
                inputs.forEach(function(i){ i.value = ''; });
            }
        });

        window.addEventListener('resize', function() {
            if (dropdown.style.display !== 'none') posicionarDropdown();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciarBuscador);
    } else {
        iniciarBuscador();
    }

})();