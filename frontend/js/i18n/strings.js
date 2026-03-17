// Complete bilingual content for the entire application
// All text is managed here - switch language instantly without page reload

const L = {
  es: {
    // Navigation
    nav_learn: "Aprender",
    nav_compose: "Componer",

    // Footer
    footer: "Karplus-Strong Synthesizer \u00a9 2026",
    footer_sub: "Herramienta educativa interactiva para aprender procesamiento digital de se\u00f1ales",

    // Home page
    hero_sub: "Aprende procesamiento digital de se\u00f1ales a trav\u00e9s de demos interactivas y crea tu propia m\u00fasica de cuerdas pulsadas",
    hero_learn: "Comenzar a Aprender",
    hero_compose: "Crear M\u00fasica",
    features_title: "Caracter\u00edsticas",
    feat_learn: "Aprendizaje Interactivo",
    feat_learn_desc: "Entiende el algoritmo Karplus-Strong con visualizaciones, ecuaciones y demos de audio en tiempo real",
    feat_piano: "Editor Piano Roll",
    feat_piano_desc: "Crea melod\u00edas con una interfaz de cuadr\u00edcula intuitiva. Coloca notas y esc\u00fachalas sintetizadas",
    feat_preset: "Canciones Preset",
    feat_preset_desc: "Carga melod\u00edas pre-construidas para empezar, o crea y guarda tus propias composiciones",
    what_is_title: "\u00bfQu\u00e9 es Karplus-Strong?",
    what_is_p1: "El algoritmo Karplus-Strong es un m\u00e9todo simple y elegante para sintetizar instrumentos de cuerda pulsada como guitarras, arpas y pianos. Desarrollado en 1983, utiliza un breve estallido de ruido filtrado a trav\u00e9s de una l\u00ednea de retardo para crear sonidos de cuerdas sorprendentemente realistas.",
    what_is_p2: "Esta aplicaci\u00f3n web trae el algoritmo a la vida en tu navegador usando la Web Audio API, permiti\u00e9ndote aprender la teor\u00eda y experimentar creando m\u00fasica.",

    // ===================== LEARN PAGE =====================

    // Section 0: Introduction
    learn_title: "Aprende el Algoritmo Karplus-Strong",
    learn_intro: "Desde cero, paso a paso. No necesitas saber nada de programaci\u00f3n ni de m\u00fasica.",
    learn_toc: "Contenido",
    toc_1: "1. \u00bfQu\u00e9 vamos a hacer?",
    toc_2: "2. El ruido: la materia prima",
    toc_3: "3. Frecuencia y sonido digital",
    toc_3a: "3a. \u00bfQu\u00e9 es una onda?",
    toc_3b: "3b. De anal\u00f3gico a digital",
    toc_3c: "3c. El truco de Karplus-Strong",
    toc_4: "4. El coraz\u00f3n del algoritmo",
    toc_4a: "4a. El buffer circular",
    toc_4b: "4b. Filtro pasada a pasada",
    toc_4c: "4c. El decaimiento",
    toc_5: "5. El espectro: ver dentro del sonido",
    toc_6: "6. Afinando el sonido",
    toc_7: "7. S\u00edntesis completa: todo junto",

    // Section 1: What are we going to do?
    s1_title: "1. \u00bfQu\u00e9 vamos a hacer?",
    s1_p1: "Imagina que pulsas una cuerda de guitarra. Escuchas un sonido que empieza fuerte y poco a poco se apaga. \u00bfC\u00f3mo podr\u00edamos recrear ese sonido con una computadora?",
    s1_p2: "En 1983, Kevin Karplus y Alex Strong descubrieron un truco genial: si tomas un peque\u00f1o trozo de ruido aleatorio y lo pasas una y otra vez por un filtro que lo suaviza, el resultado suena como una cuerda pulsada.",
    s1_p2b: "Este algoritmo todav\u00eda se usa hoy en sintetizadores, audio de videojuegos y software de producci\u00f3n musical. Es uno de los ejemplos m\u00e1s simples de s\u00edntesis por modelado f\u00edsico \u2014 usar matem\u00e1ticas para simular c\u00f3mo se comporta un objeto f\u00edsico real (una cuerda).",
    s1_p2c: "En las siguientes secciones, construiremos el algoritmo pieza por pieza. Al final, entender\u00e1s cada parte y podr\u00e1s crear tus propios sonidos de instrumentos.",
    s1_p3: "El proceso tiene 3 pasos:",
    s1_step1_title: "Paso 1: Ruido",
    s1_step1: "Generar un peque\u00f1o trozo de n\u00fameros aleatorios (como est\u00e1tica de TV)",
    s1_step2_title: "Paso 2: Repetir",
    s1_step2: "Repetir ese trozo en un bucle circular",
    s1_step3_title: "Paso 3: Suavizar",
    s1_step3: "Cada vez que pasa por el bucle, promediar cada muestra con la siguiente",

    // Section 2: The noise burst
    s2_title: "2. El ruido: la materia prima",
    s2_p1: "Todo empieza con ruido \u2014 n\u00fameros aleatorios. Piensa en la est\u00e1tica de una TV vieja, o el sonido \"shhh\" entre estaciones de radio. Eso es ruido blanco: valores al azar que suben y bajan sin patr\u00f3n.",
    s2_p1b: "\u00bfPor qu\u00e9 se llama ruido \"blanco\"? As\u00ed como la luz blanca contiene todos los colores mezclados, el ruido blanco contiene todas las frecuencias de sonido mezcladas. Es el \"todo a la vez\" del sonido.",
    s2_p1c: "En una computadora, representamos el sonido como una lista de n\u00fameros. Cada n\u00famero le dice al parlante qu\u00e9 tanto empujar el aire en ese instante. N\u00fameros positivos empujan el parlante hacia afuera, n\u00fameros negativos lo jalan hacia adentro. N\u00fameros aleatorios = empujones aleatorios = ruido.",
    s2_p2: "A nuestro algoritmo le damos un trozo peque\u00f1o de este ruido. \u00bfQu\u00e9 tan peque\u00f1o? Eso depende de la nota que queremos tocar (lo veremos en la siguiente secci\u00f3n).",
    s2_demo_label: "Cantidad de muestras de ruido:",
    s2_duration_label: "Duración:",
    s2_btn_generate: "Generar ruido",
    s2_btn_listen: "Escuchar ruido",
    s2_p3: "El gr\u00e1fico de arriba muestra el ruido: cada punto es un n\u00famero aleatorio entre -1 y 1. No tiene forma, no tiene patr\u00f3n. Pero es exactamente lo que necesitamos como punto de partida.",
    s2_p3b: "Quiz\u00e1s te preguntes: \u00bfc\u00f3mo puede el ruido aleatorio convertirse en una nota musical? El secreto est\u00e1 en CU\u00c1NTO ruido usamos. Un trozo corto de ruido se convertir\u00e1 en una nota aguda, y un trozo m\u00e1s largo se convertir\u00e1 en una nota grave. Veamos por qu\u00e9.",

    // Section 3: Frequency (now split into 3a, 3b, 3c)
    s3_title: "3. Frecuencia y sonido digital",
    
    // Section 3a: What is a wave?
    s3a_title: "3a. \u00bfQu\u00e9 es una onda?",
    s3a_p1: "Cuando tocas una cuerda, el aire vibra. Esas vibraciones son ondas. Mientras m\u00e1s r\u00e1pido vibra, m\u00e1s agudo es el sonido.",
    s3a_p1b: "Piensa en dejar caer una piedra en el agua. Las ondas se expanden \u2014 crestas y valles altern\u00e1ndose. El sonido funciona igual, pero en vez de agua, son mol\u00e9culas de aire empuj\u00e1ndose de un lado a otro. Cuando esas ondas de aire llegan a tu o\u00eddo, tu cerebro las interpreta como sonido.",
    s3a_p1c: "Una cuerda gruesa de guitarra vibra lentamente \u2014 escuchas un sonido grave y profundo. Una cuerda delgada vibra r\u00e1pido \u2014 escuchas un sonido agudo y brillante. Esta velocidad de vibraci\u00f3n es lo que los m\u00fasicos llaman \"tono\" o \"altura\".",
    s3a_p2: "La frecuencia mide qu\u00e9 tan r\u00e1pido vibra algo. Se mide en Hertz (Hz) = vibraciones por segundo. Mira esta onda pura:",
    s3a_freq_label: "Frecuencia:",
    s3a_btn_play: "Escuchar onda pura",
    s3a_p3: "Una nota LA (440 Hz) vibra 440 veces por segundo. Una nota grave (110 Hz) vibra solo 110 veces. \u00a1Mueve el slider y mira c\u00f3mo cambia la onda!",
    
    // Section 3b: Analog to digital
    s3b_title: "3b. De anal\u00f3gico a digital",
    s3b_p1: "Una onda de sonido real es continua, fluye sin pausas. Pero una computadora no puede guardar algo continuo \u2014 necesita n\u00fameros.",
    s3b_p2: "La soluci\u00f3n: tomar instant\u00e1neas (muestras) de la onda miles de veces por segundo. Es como tomar fotos de algo que se mueve r\u00e1pido.",
    s3b_p2b: "\u00bfPor qu\u00e9 exactamente 44,100? El o\u00eddo humano puede escuchar frecuencias hasta unos 20,000 Hz. Una regla matem\u00e1tica llamada el teorema de Nyquist dice que necesitamos al menos el DOBLE de muestras por segundo para capturar el sonido con precisi\u00f3n. 2 \u00d7 20,000 = 40,000, m\u00e1s un poco de margen = 44,100. Esta es la misma tasa de muestreo que usan los CDs y la mayor\u00eda del audio digital.",
    s3b_p3: "Usamos 44,100 muestras por segundo. \u00a1Suficientes para capturar el sonido perfectamente! Los puntos naranjas muestran cada muestra:",
    s3b_sample_rate: "Tasa de muestreo: 44,100 muestras/segundo",
    s3b_zoom_label: "Acercar:",
    s3b_rate_label: "Tasa de muestreo:",
    s3b_rate_low: "Pocas muestras",
    s3b_rate_high: "Muchas muestras (CD: 44,100)",
    
    // Section 3c: The KS trick
    s3c_title: "3c. El truco de Karplus-Strong",
    s3c_p1: "Ahora que entiendes Hz y muestras, viene el truco m\u00e1gico de Karplus-Strong:",
    s3c_formula_explain: "La longitud del trozo de ruido determina la frecuencia. Si queremos una nota de 440 Hz:",
    s3c_formula_result: "= 100 muestras",
    s3c_p2_expanded: "Pero, \u00bfPOR QU\u00c9 la longitud del buffer determina la nota? Aqu\u00ed est\u00e1 la clave: cuando repetimos esas 100 muestras a 44,100 muestras por segundo, el ciclo se completa 44,100 \u00f7 100 = 441 veces por segundo. \u00a1Esa tasa de repetici\u00f3n ES la frecuencia! Un ciclo m\u00e1s corto se repite m\u00e1s r\u00e1pido (nota aguda), un ciclo m\u00e1s largo se repite m\u00e1s lento (nota grave). Es como un peque\u00f1o disco reproduci\u00e9ndose en bucle \u2014 cuanto m\u00e1s corto el disco, m\u00e1s r\u00e1pido completa el ciclo, m\u00e1s agudo el tono.",
    s3c_p2: "\u00a1Solo 100 n\u00fameros aleatorios para crear una nota musical! Mueve el slider para escuchar c\u00f3mo cambian las notas:",
    s3c_freq_label: "Frecuencia:",
    s3c_samples_label: "muestras",
    s3c_btn_play: "Tocar nota",
    s3c_note_display: "Nota:",
    s3c_low: "Grave",
    s3c_high: "Agudo",

    // Section 4: The heart of the algorithm (redesigned with 4a, 4b, 4c)
    s4_title: "4. El corazón del algoritmo",
    s4_intro: "Ahora viene la magia. Veremos cómo combinar el ruido con un bucle circular y un filtro simple para crear sonidos musicales.",
    
    // Section 4a: Circular buffer
    s4a_title: "4a. El buffer circular",
    s4a_p1: "Tomamos nuestro trozo de ruido y lo ponemos en un bucle circular (como una cinta sin fin). El \"cabezal de lectura\" recorre las muestras una y otra vez.",
    s4a_p1b: "Imagina una caja de m\u00fasica con un cilindro que tiene protuberancias. Mientras el cilindro gira, cada protuberancia pulsa un diente del peine, produciendo un sonido. Cuando el cilindro completa una rotaci\u00f3n, vuelve a empezar con las mismas protuberancias. Nuestro buffer circular funciona igual \u2014 las \"protuberancias\" son nuestras muestras de ruido, y la \"rotaci\u00f3n\" es el ciclo.",
    s4a_p2: "Mira cómo el cabezal (punto rojo) recorre el buffer circular:",
    s4a_btn_play: "Reproducir Loop",
    s4a_btn_stop: "Detener",
    s4a_speed_label: "Velocidad:",
    s4a_transition: "Sin filtro, el loop suena como ruido repetido. Pero cuando aplicamos el promediado en cada pasada, algo mágico sucede...",
    
    // Section 4b: Filter pass by pass
    s4b_title: "4b. El filtro pasada a pasada",
    s4b_p1: "Cada vez que el cabezal recorre el bucle completo, aplicamos un filtro muy simple:",
    s4b_formula_explain: "Esto significa: cada muestra se reemplaza por el promedio entre ella y la siguiente. Es como difuminar una imagen — cada pasada suaviza más.",
    s4b_p1b: "Pero, \u00bfpor qu\u00e9 el simple promediado convierte ruido en m\u00fasica? Pi\u00e9nsalo as\u00ed: el ruido tiene saltos bruscos \u2014 picos agudos subiendo y bajando r\u00e1pidamente. Cuando promedias cada muestra con su vecina, esos picos se suavizan. Los componentes r\u00e1pidos y agudos del ruido desaparecen primero, mientras que el patr\u00f3n lento y grave (determinado por la longitud del buffer) sobrevive. Despu\u00e9s de varias pasadas, solo queda el patr\u00f3n suave en forma de onda \u2014 \u00a1y esa es tu nota musical!",
    s4b_p1c: "Es como agitar un taz\u00f3n de arena con piedras y canicas. Los granos peque\u00f1os de arena (frecuencias altas) se asientan r\u00e1pido, las piedras (frecuencias medias) se asientan despu\u00e9s, pero las canicas (la frecuencia fundamental de tu nota) siguen rebotando m\u00e1s tiempo.",
    s4b_p2: "Mira cómo el ruido se transforma en una onda suave. ¡Escucha en diferentes pasadas para oír cómo emerge el tono!",
    s4b_pass_label: "Pasadas del filtro:",
    s4b_btn_animate: "Animar filtrado",
    s4b_btn_reset: "Reiniciar",
    s4b_btn_listen: "Escuchar esta pasada",
    s4b_transition: "Después de unas pocas pasadas, ¡el ruido aleatorio se convierte en una nota musical! Pero, ¿cuánto tiempo dura ese sonido?",
    
    // Section 4c: Decay factor
    s4c_title: "4c. El decaimiento",
    s4c_p1: "El factor de decaimiento controla qué tan rápido se apaga el sonido. Recuerda la fórmula del filtro:",
    s4c_formula_explain: "Donde $d$ es el factor de decaimiento. Un valor cercano a 2.0 (el mínimo, promedio puro) produce decaimiento lento. Un valor más alto (2.3, 2.5) pierde más energía en cada pasada y se apaga rápido.",
    s4c_p1b: "Pi\u00e9nsalo en t\u00e9rminos de energ\u00eda. Cuando dividimos exactamente por 2.0, conservamos TODA la energ\u00eda (la suma de dos muestras, dividida por dos, preserva el promedio). Pero cuando dividimos por 2.1 o 2.2, perdemos un poco de energ\u00eda cada vez \u2014 como un balde con fugas. Cuanto mayor el divisor, mayor la \"fuga\", y m\u00e1s r\u00e1pido el sonido se desvanece al silencio.",
    s4c_p1c: "\u00a1Esto imita la f\u00edsica real! Una cuerda de guitarra pierde energ\u00eda por la fricci\u00f3n y la resistencia del aire. Una cuerda de guitarra cl\u00e1sica de nylon (baja fricci\u00f3n) suena por mucho tiempo. Una cuerda corta de banjo (alta fricci\u00f3n) se apaga r\u00e1pido. El factor de decaimiento nos permite simular estos diferentes materiales.",
    s4c_p2: "Compara cómo cambia la forma de onda con diferentes valores de decaimiento:",
    s4c_decay_slow: "Decay = 2.00 (Lento)",
    s4c_decay_medium: "Decay = 2.10 (Medio)",
    s4c_decay_fast: "Decay = 2.20 (Rápido)",
    s4c_decay_label: "Decaimiento:",
    s4c_long: "Largo",
    s4c_short: "Corto",
    s4c_btn_play: "Escuchar",

    // Section 5: Spectrum visualization (NEW)
    s5_title: "5. El espectro: ver dentro del sonido",
    s5_p1: "Hasta ahora hemos visto las ondas en el tiempo (waveforms). Pero hay otra forma de ver el sonido: en el dominio de la frecuencia. Esto nos muestra QUÉ frecuencias componen un sonido.",
    s5_p1b: "\u00bfQu\u00e9 es un \"espectro\"? Imagina que tienes un prisma que separa la luz blanca en un arco\u00edris \u2014 cada color tiene una frecuencia diferente. Un espectro de frecuencias hace lo mismo con el sonido: te muestra qu\u00e9 \"colores\" (frecuencias) componen un sonido, y qu\u00e9 tan fuerte es cada uno.",
    s5_p1c: "Cuando ves m\u00faltiples picos en el espectro, esos se llaman \"arm\u00f3nicos\". El pico m\u00e1s bajo es la \"fundamental\" \u2014 la nota que realmente escuchas. Los picos m\u00e1s altos son m\u00faltiplos de la fundamental (2\u00d7, 3\u00d7, 4\u00d7...) y le dan al sonido su car\u00e1cter o \"timbre\". Una flauta tiene pocos arm\u00f3nicos (pura), mientras que una guitarra tiene muchos (rica).",
    s5_p2: "El ruido inicial tiene TODAS las frecuencias por igual (espectro plano). Después del filtrado, solo quedan ciertas frecuencias: la fundamental (la nota que escuchamos) y sus armónicos (múltiplos de la fundamental).",
    s5_passes_label: "Pasadas del filtro:",
    s5_btn_update: "Actualizar espectro",
    s5_spectrum_note: "Arriba: Forma de onda | Abajo: Espectro de frecuencias",
    s5_info_title: "💡 Entendiendo el espectro",
    s5_info_1: "<strong>Pasada 0 (ruido):</strong> Espectro plano — todas las frecuencias tienen la misma energía.",
    s5_info_2: "<strong>Pasadas 5-10:</strong> Empiezan a emerger picos en la fundamental y armónicos.",
    s5_info_3: "<strong>Pasadas 20+:</strong> Espectro definido — solo quedan las frecuencias de la nota musical.",
    s5_transition: "El filtro Karplus-Strong actúa como un \"peine\" que solo deja pasar ciertas frecuencias. ¡Por eso el ruido se convierte en una nota!",

    // Section 6: Advanced tuning (NEW)
    s6_title: "6. Afinando el sonido: hacia una guitarra real",
    s6_p1: "El algoritmo básico de Karplus-Strong ya suena sorprendentemente bien. Pero podemos hacerlo aún más realista agregando parámetros que simulan propiedades físicas de una cuerda real.",
    s6_p1b: "Cada instrumento suena diferente incluso tocando la misma nota \u2014 ese \"color\" \u00fanico del sonido se llama timbre (se pronuncia \"TAM-bre\"). Una guitarra y un piano tocando la misma nota LA suenan completamente diferentes por su timbre. Los siguientes par\u00e1metros nos permiten moldear el timbre de nuestra cuerda sintetizada.",
    s6_pluck_title: "📍 Posición del punteo",
    s6_pluck_desc: "Donde \"pellizcan\" la cuerda. Cerca del centro (0.5) suena cálido. Cerca del puente (0.1) suena nasal y brillante.",
    s6_pluck_label: "Posición:",
    s6_pluck_center: "Centro (0.5)",
    s6_pluck_bridge: "Puente (0.1)",
    s6_stiff_title: "🎸 Rigidez de la cuerda",
    s6_stiff_desc: "Las cuerdas reales no son perfectamente flexibles. La rigidez desafina ligeramente los armónicos agudos, dando un timbre más orgánico.",
    s6_stiff_label: "Rigidez:",
    s6_stiff_none: "Sin (0.0)",
    s6_stiff_high: "Alta (0.04)",
    s6_body_title: "🎵 Resonancia de la caja",
    s6_body_desc: "La caja de resonancia de la guitarra amplifica ciertas frecuencias (formantes). Esto da riqueza y profundidad al sonido.",
    s6_body_desc_expanded: "La caja de la guitarra act\u00faa como una c\u00e1mara de resonancia \u2014 amplifica ciertas frecuencias m\u00e1s que otras. Estas frecuencias amplificadas se llaman \"formantes\". Son lo que le da a una guitarra ac\u00fastica su sonido c\u00e1lido y amaderado, en contraste con el tono m\u00e1s delgado de una guitarra el\u00e9ctrica.",
    s6_body_label: "Intensidad:",
    s6_body_none: "Sin (0.0)",
    s6_body_high: "Alta (0.7)",
    s6_bright_title: "✨ Brillo",
    s6_bright_desc: "Controla cuántas frecuencias agudas se mantienen. Valores bajos suenan apagados (cuerda vieja), valores altos suenan brillantes (cuerda nueva).",
    s6_bright_label: "Frecuencia de corte:",
    s6_bright_dull: "Apagado (2000)",
    s6_bright_bright: "Brillante (8000)",
    s6_btn_play: "Tocar con parámetros avanzados",
    s6_btn_reset: "Resetear todo",
    s6_p2: "Experimenta con diferentes combinaciones. Cada instrumento de cuerda tiene su propia \"firma\" en estos parámetros.",

    // Section 7: Full synthesis (renamed from 5, enhanced)
    s7_title: "7. Síntesis completa: todo junto",
    s7_p1: "Ahora combinemos todo. Todos los parámetros que vimos están disponibles. ¡Crea el sonido de tu instrumento ideal!",
    s7_freq: "Frecuencia",
    s7_decay: "Decaimiento",
    s7_duration: "Duración",
    s7_btn_play: "Tocar cuerda",
    s7_presets_title: "Ejemplos de instrumentos realistas",
    s7_presets_desc: "Escucha cómo diferentes parámetros crean diferentes instrumentos. ¡Ahora suenan mucho más reales!",
    s7_preset_guitar_classic: "Guitarra Clásica",
    s7_preset_guitar_classic_desc: "Cálida y resonante",
    s7_preset_guitar_acoustic: "Guitarra Acústica",
    s7_preset_guitar_acoustic_desc: "Brillante y atácante",
    s7_preset_harp: "Arpa",
    s7_preset_harp_desc: "Cristalina, decae rápido",
    s7_preset_bass: "Bajo Eléctrico",
    s7_preset_bass_desc: "Profundo y punchante",
    s7_preset_banjo: "Banjo",
    s7_preset_banjo_desc: "Corto y percusivo",
    s7_preset_sitar: "Sitar",
    s7_preset_sitar_desc: "Exótico y resonante",
    s7_p2: "Felicidades — acabas de sintetizar el sonido de una cuerda pulsada usando solo matemáticas. Este es el mismo principio que usan los sintetizadores profesionales. ¡Ahora ve a la sección Componer para crear tu propia música!",
    s7_p3: "\u00bfListo para hacer m\u00fasica? Ve a la p\u00e1gina Componer para crear melod\u00edas usando todo lo que aprendiste. Puedes colocar notas en una cuadr\u00edcula de piano roll y escucharlas tocadas con el algoritmo Karplus-Strong. Prueba diferentes valores de decaimiento y configuraciones de BPM para crear tu sonido perfecto.",
    s7_p4: "\u00bfQuieres profundizar m\u00e1s? El algoritmo Karplus-Strong es solo el comienzo de la s\u00edntesis por modelado f\u00edsico. Los mismos principios \u2014 l\u00edneas de retardo, filtros y retroalimentaci\u00f3n \u2014 se usan para simular tambores, instrumentos de viento, e incluso cuerdas vocales.",

    // Old section 4 and 5 keys (kept for backwards compatibility, but not used in new design)
    s4_p1: "Ahora viene la magia. Tomamos nuestro trozo de ruido y lo ponemos en un bucle circular (como una cinta sin fin). Cada vez que recorre el bucle, aplicamos un filtro muy simple:",
    s4_formula_explain_old: "Esto significa: cada muestra se reemplaza por el promedio entre ella y la siguiente. Es como difuminar una imagen — cada pasada suaviza más.",
    s4_p2: "Mira cómo el ruido se transforma en una onda suave después de varias pasadas:",
    s4_pass_label_old: "Pasadas del filtro:",
    s4_btn_animate_old: "Animar filtrado",
    s4_btn_reset_old: "Reiniciar",
    s4_p3: "El factor de decaimiento controla qué tan rápido se apaga el sonido. Un valor cercano a 2.0 produce decaimiento lento (sonido largo). Un valor mayor (2.3, 2.5) se apaga rápido.",
    s4_decay_label_old: "Decaimiento:",
    s4_long_old: "Largo",
    s4_short_old: "Corto",
    s5_title_old: "5. Síntesis completa: todo junto",
    s5_p1: "Ahora combinemos todo. Selecciona una frecuencia, ajusta el decaimiento, y escucha tu cuerda sintetizada:",
    s5_freq: "Frecuencia",
    s5_decay: "Decaimiento",
    s5_duration: "Duración",
    s5_btn_play: "Tocar cuerda",
    s5_presets_title: "Ejemplos de instrumentos",
    s5_presets_desc: "Escucha cómo diferentes parámetros crean diferentes instrumentos:",
    s5_preset_guitar_low: "Guitarra Grave",
    s5_preset_guitar_low_desc: "Cuerda gruesa, cálida y larga",
    s5_preset_guitar_high: "Guitarra Aguda",
    s5_preset_guitar_high_desc: "Cuerda delgada, brillante",
    s5_preset_harp: "Arpa",
    s5_preset_harp_desc: "Cristalina, decae rápido",
    s5_preset_bass: "Bajo",
    s5_preset_bass_desc: "Profundo y resonante",
    s5_preset_banjo: "Banjo",
    s5_preset_banjo_desc: "Corto y percusivo",
    s5_p2: "Felicidades — acabas de sintetizar el sonido de una cuerda pulsada usando solo matemáticas. Este es el mismo principio que usan los sintetizadores profesionales.",

    // Compose page
    compose_title: "Componer M\u00fasica",
    compose_desc: "Haz clic en la cuadr\u00edcula para colocar notas. Clic de nuevo para quitar. Arrastra para extender duraci\u00f3n.",
    play: "Reproducir",
    stop: "Detener",
    decay: "Decaimiento",
    instrument: "Instrumento",
    toolbar_transport: "Transporte",
    toolbar_sound: "Sonido",
    toolbar_presets: "Presets",
    inst_basic: "KS B\u00e1sico",
    inst_guitar_classic: "Guitarra Cl\u00e1sica",
    inst_guitar_acoustic: "Guitarra Ac\u00fastica",
    inst_harp: "Arpa",
    inst_bass: "Bajo",
    inst_banjo: "Banjo",
    inst_sitar: "Sitar",
    preset: "Presets",
    select_preset: "Selecciona un preset...",
    preset_scale: "Escala DO Mayor",
    preset_matlab: "Canci\u00f3n Demo MATLAB",
    preset_ode_to_joy: "Oda a la Alegr\u00eda",
    preset_twinkle: "Twinkle Twinkle",
    preset_canon: "Canon en Re",
    preset_happy_birthday: "Cumplea\u00f1os Feliz",
    preset_fur_elise: "Para Elisa",
    clear: "Limpiar",
    save: "Guardar",
    tips_title: "Consejos",
    tip_1: "Las notas se ajustan a la cuadr\u00edcula de semicorcheas",
    tip_2: "Decaimiento bajo = sonido se apaga r\u00e1pido",
    tip_3: "Prueba BPM entre 60-180 para mejores resultados",
    tip_4: "Selecciona un instrumento para usar s\u00edntesis KS avanzada",
    waveform_title: "Visualizaci\u00f3n de Forma de Onda",
    waveform_noise: "1. Ruido Inicial",
    waveform_filtered: "2. Despu\u00e9s del Filtrado",
    waveform_final: "3. Se\u00f1al Final",
    waveform_final_mix: "4. Mezcla Final",
    no_notes: "No hay notas para reproducir",
    saved: "Guardado exitosamente",
    confirm_clear: "\u00bfEst\u00e1s seguro?",
    audio_error: "Error de audio",
  },

  en: {
    // Navigation
    nav_learn: "Learn",
    nav_compose: "Compose",

    // Footer
    footer: "Karplus-Strong Synthesizer \u00a9 2026",
    footer_sub: "An interactive educational tool for learning digital signal processing",

    // Home page
    hero_sub: "Learn digital signal processing through interactive demos and create your own plucked-string music",
    hero_learn: "Start Learning",
    hero_compose: "Create Music",
    features_title: "Features",
    feat_learn: "Interactive Learning",
    feat_learn_desc: "Understand the Karplus-Strong algorithm through visualizations, equations, and real-time audio demos",
    feat_piano: "Piano Roll Editor",
    feat_piano_desc: "Create melodies with an intuitive grid-based interface. Place notes and hear them synthesized",
    feat_preset: "Preset Songs",
    feat_preset_desc: "Load pre-built melodies to get started, or create and save your own compositions",
    what_is_title: "What is Karplus-Strong?",
    what_is_p1: "The Karplus-Strong algorithm is a simple and elegant method for synthesizing plucked string instruments like guitars, harps, and pianos. Developed in 1983, it uses a short burst of noise filtered through a delay line to create surprisingly realistic string sounds.",
    what_is_p2: "This web application brings the algorithm to life in your browser using the Web Audio API, letting you both learn the theory and experiment with creating music.",

    // ===================== LEARN PAGE =====================

    // Section 0: Introduction
    learn_title: "Learn the Karplus-Strong Algorithm",
    learn_intro: "From scratch, step by step. You don't need to know anything about programming or music.",
    learn_toc: "Contents",
    toc_1: "1. What are we going to do?",
    toc_2: "2. The noise: the raw material",
    toc_3: "3. Frequency and digital sound",
    toc_3a: "3a. What is a wave?",
    toc_3b: "3b. From analog to digital",
    toc_3c: "3c. The Karplus-Strong trick",
    toc_4: "4. The circular buffer and the filter",
    toc_4a: "4a. The circular buffer: looping endlessly",
    toc_4b: "4b. The filter: smoothing the sound",
    toc_4c: "4c. The decay factor: controlling the echo",
    toc_5: "5. From noise to harmony: the spectrum",
    toc_6: "6. Advanced synthesis: realistic strings",
    toc_7: "7. Full synthesis: putting it all together",

    // Section 1: What are we going to do?
    s1_title: "1. What are we going to do?",
    s1_p1: "Imagine you pluck a guitar string. You hear a sound that starts loud and gradually fades. How could we recreate that sound with a computer?",
    s1_p2: "In 1983, Kevin Karplus and Alex Strong discovered a clever trick: if you take a small chunk of random noise and pass it through a smoothing filter over and over, the result sounds like a plucked string.",
    s1_p2b: "This algorithm is still used today in synthesizers, video game audio, and music production software. It's one of the simplest examples of physical modeling synthesis \u2014 using math to simulate how a real physical object (a string) behaves.",
    s1_p2c: "In the next sections, we'll build the algorithm piece by piece. By the end, you'll understand every part and be able to create your own instrument sounds.",
    s1_p3: "The process has 3 steps:",
    s1_step1_title: "Step 1: Noise",
    s1_step1: "Generate a small chunk of random numbers (like TV static)",
    s1_step2_title: "Step 2: Loop",
    s1_step2: "Repeat that chunk in a circular loop",
    s1_step3_title: "Step 3: Smooth",
    s1_step3: "Every time it goes through the loop, average each sample with the next one",

    // Section 2: The noise burst
    s2_title: "2. The noise: the raw material",
    s2_p1: "It all starts with noise \u2014 random numbers. Think of an old TV's static, or the \"shhh\" sound between radio stations. That's white noise: random values going up and down with no pattern.",
    s2_p1b: "Why is it called 'white' noise? Just like white light contains all colors mixed together, white noise contains all sound frequencies mixed together. It's the 'everything at once' of sound.",
    s2_p1c: "In a computer, we represent sound as a list of numbers. Each number tells the speaker how far to push the air at that instant. Positive numbers push the speaker out, negative numbers pull it in. Random numbers = random pushes = noise.",
    s2_p2: "We give our algorithm a small chunk of this noise. How small? That depends on the note we want to play (we'll see that in the next section).",
    s2_demo_label: "Number of noise samples:",    s2_duration_label: "Duration:",    s2_btn_generate: "Generate noise",
    s2_btn_listen: "Listen to noise",
    s2_p3: "The graph above shows the noise: each dot is a random number between -1 and 1. It has no shape, no pattern. But it's exactly what we need as a starting point.",
    s2_p3b: "You might wonder: how can random noise become a musical note? The secret is in HOW MUCH noise we use. A short chunk of noise will become a high note, and a longer chunk will become a low note. Let's see why.",

    // Section 3: Frequency (now split into 3a, 3b, 3c)
    s3_title: "3. Frequency and digital sound",
    
    // Section 3a: What is a wave?
    s3a_title: "3a. What is a wave?",
    s3a_p1: "When you pluck a string, the air vibrates. Those vibrations are waves. The faster it vibrates, the higher the pitch.",
    s3a_p1b: "Think of dropping a stone in water. The ripples spread out in waves \u2014 peaks and valleys alternating. Sound works the same way, but instead of water, it's air molecules being pushed back and forth. When those air waves reach your ear, your brain interprets them as sound.",
    s3a_p1c: "A thick guitar string vibrates slowly \u2014 you hear a deep, low sound. A thin string vibrates fast \u2014 you hear a high, bright sound. This speed of vibration is what musicians call 'pitch'.",
    s3a_p2: "Frequency measures how fast something vibrates. It's measured in Hertz (Hz) = vibrations per second. Look at this pure wave:",
    s3a_freq_label: "Frequency:",
    s3a_btn_play: "Listen to pure wave",
    s3a_p3: "An A note (440 Hz) vibrates 440 times per second. A low note (110 Hz) vibrates only 110 times. Move the slider and watch the wave change!",
    
    // Section 3b: Analog to digital
    s3b_title: "3b. From analog to digital",
    s3b_p1: "A real sound wave is continuous, it flows without pauses. But a computer can't store something continuous \u2014 it needs numbers.",
    s3b_p2: "The solution: take snapshots (samples) of the wave thousands of times per second. It's like taking photos of something moving fast.",
    s3b_p2b: "Why exactly 44,100? The human ear can hear frequencies up to about 20,000 Hz. A mathematical rule called the Nyquist theorem says we need at least TWICE that many samples per second to capture sound accurately. 2 \u00d7 20,000 = 40,000, plus a bit of margin = 44,100. This is the same sample rate used by CDs and most digital audio.",
    s3b_p3: "We use 44,100 samples per second. Enough to capture sound perfectly! The orange dots show each sample:",
    s3b_sample_rate: "Sample rate: 44,100 samples/second",
    s3b_zoom_label: "Zoom:",
    s3b_rate_label: "Sample rate:",
    s3b_rate_low: "Few samples",
    s3b_rate_high: "Many samples (CD: 44,100)",
    
    // Section 3c: The KS trick
    s3c_title: "3c. The Karplus-Strong trick",
    s3c_p1: "Now that you understand Hz and samples, here's the magic Karplus-Strong trick:",
    s3c_formula_explain: "The length of the noise chunk determines the frequency. If we want a 440 Hz note:",
    s3c_formula_result: "= 100 samples",
    s3c_p2_expanded: "But WHY does the buffer length determine the note? Here's the key insight: when we loop those 100 samples at 44,100 samples per second, the loop completes 44,100 \u00f7 100 = 441 times per second. That repetition rate IS the frequency! A shorter loop repeats faster (higher note), a longer loop repeats slower (lower note). It's like a tiny record playing on repeat \u2014 the shorter the record, the faster it loops, the higher the pitch.",
    s3c_p2: "Just 100 random numbers to create a musical note! Move the slider to hear how notes change:",
    s3c_freq_label: "Frequency:",
    s3c_samples_label: "samples",
    s3c_btn_play: "Play note",
    s3c_note_display: "Note:",
    s3c_low: "Low",
    s3c_high: "High",

    // Section 4: The circular buffer and the filter
    
    // Section 4a: The circular buffer
    s4a_title: "4a. The circular buffer: looping endlessly",
    s4a_p1: "Now comes the magic. Instead of playing the noise once and done, we put it in a circular loop (like an endless tape). Imagine 100 samples arranged in a circle, and a reader that keeps going around:",
    s4a_p1b: "Imagine a music box with a cylinder that has bumps on it. As the cylinder rotates, each bump plucks a tooth of the comb, making a sound. When the cylinder completes a full rotation, it starts over with the same bumps. Our circular buffer works the same way \u2014 the 'bumps' are our noise samples, and the 'rotation' is the loop.",
    s4a_p2: "The visualization shows how the buffer repeats. This loop is essential for Karplus-Strong: each time the reader completes a lap, the sound repeats the same pattern. Without processing, it would sound like a loop of noise. But with the filter (next section), it transforms into a musical note.",
    s4a_btn_play: "Play loop",
    s4a_btn_stop: "Stop",
    s4a_speed_label: "Animation speed:",
    s4a_transition: "Great! Now that you understand the circular buffer, let's see what happens when we smooth the samples each time around...",

    // Section 4b: The filter
    s4b_title: "4b. The filter: smoothing the sound",
    s4b_p1: "Each time the reader goes around the loop, we apply a very simple filter before storing the sample again:",
    s4b_formula_explain: "This means: each sample is replaced by the average of itself and the next one. It's like blurring an image — each pass smooths it more.",
    s4b_p1b: "But why does simple averaging turn noise into music? Think about it this way: noise has wild jumps \u2014 sharp spikes going up and down rapidly. When you average each sample with its neighbor, those sharp spikes get smoothed out. The rapid, high-pitched components of the noise disappear first, while the slow, low-pitched pattern (determined by the buffer length) survives. After several passes, only the smooth, wave-like pattern remains \u2014 and that's your musical note!",
    s4b_p1c: "It's like shaking a bowl of sand with pebbles and marbles. The tiny sand grains (high frequencies) settle quickly, the pebbles (mid frequencies) settle next, but the marbles (the fundamental frequency of your note) keep bouncing the longest.",
    s4b_p2: "Watch how noise transforms into a smooth wave after several passes. Notice how the sharp spikes disappear and it starts looking like a musical wave:",
    s4b_pass_label: "Filter passes:",
    s4b_btn_listen: "Listen to this pass",
    s4b_transition: "Perfect! You can see (and hear) how each filter pass smooths the sound more. But how do we control how long the sound lasts?",

    // Section 4c: The decay factor
    s4c_title: "4c. The decay factor: controlling the echo",
    s4c_p1: "The decay factor controls how fast the sound fades. In the filter, instead of a pure average, we use:",
    s4c_formula_explain: "Dividing by 2.0 produces very slow decay (long sound). Dividing by a higher number (2.1, 2.2...) makes it fade faster. Compare these three:",
    s4c_p1b: "Think of it in terms of energy. When we divide by exactly 2.0, we're keeping ALL the energy (the sum of two samples, divided by two, preserves the average). But when we divide by 2.1 or 2.2, we're losing a little bit of energy each time \u2014 like a leaky bucket. The bigger the divisor, the bigger the 'leak', and the faster the sound fades to silence.",
    s4c_p1c: "This mimics real physics! A guitar string loses energy to friction and air resistance. A nylon classical guitar string (low friction) rings for a long time. A short banjo string (high friction) fades quickly. The decay factor lets us simulate these different materials.",
    s4c_decay_slow: "Slow decay (÷2.00) - Long sound",
    s4c_decay_medium: "Medium decay (÷2.10) - Balanced",
    s4c_decay_fast: "Fast decay (÷2.20) - Short sound",
    s4c_p2: "Try different values and hear how the sound changes:",
    s4c_decay_label: "Decay:",
    s4c_btn_play: "Play decay",

    // Section 5: The spectrum
    s5_title: "5. From noise to harmony: the spectrum",
    s5_p1: "We've seen noise transform into a wave in time. But there's another way to see what's happening: the frequency spectrum. This shows which frequencies are present in the sound.",
    s5_p1b: "What is a 'spectrum'? Imagine you have a prism that splits white light into a rainbow \u2014 each color has a different frequency. A frequency spectrum does the same thing for sound: it shows you which 'colors' (frequencies) make up a sound, and how loud each one is.",
    s5_p1c: "When you see multiple peaks in the spectrum, those are called 'harmonics'. The lowest peak is the 'fundamental' \u2014 the note you actually hear. The higher peaks are multiples of the fundamental (2\u00d7, 3\u00d7, 4\u00d7...) and they give the sound its character or 'timbre'. A flute has few harmonics (pure), while a guitar has many (rich).",
    s5_p2: "The top graph shows the waveform (time). The bottom shows the spectrum (frequencies). Watch what happens as the filter smooths the noise:",
    s5_passes_label: "Filter passes:",
    s5_info_title: "What are you seeing?",
    s5_info_1: "The spectrum shows which frequencies make up the sound. A pure tone (like a sine wave) is a single vertical bar. Complex sounds have many bars.",
    s5_info_2: "Noise has all frequencies equally (flat spectrum). As we filter, some frequencies get stronger and others disappear. That's what creates the musical note!",
    s5_info_3: "Notice how the dominant frequency matches the buffer length: 100 samples at 44,100 Hz = 441 Hz, very close to the A note (440 Hz).",
    s5_transition: "Amazing! From chaotic noise to a clear note with visible harmonics. But to sound more realistic, we need a few more tricks...",

    // Section 6: Advanced synthesis
    s6_title: "6. Advanced synthesis: realistic strings",
    s6_p1: "The basic Karplus-Strong sounds good, but real strings have more nuances. Professional synthesizers add several physical details:",
    s6_p1b: "Every instrument sounds different even playing the same note \u2014 that unique 'color' of sound is called timbre (pronounced 'TAM-ber'). A guitar and a piano playing the same A note sound completely different because of their timbre. The following parameters let us shape the timbre of our synthesized string.",

    s6_pluck_title: "Pluck position",
    s6_pluck_p: "Where you pluck the string changes the timbre. Plucking in the center gives a warm, balanced sound. Near the bridge (guitar end) sounds brighter and more metallic:",
    s6_pluck_label: "Pluck position:",
    s6_pluck_center: "Center",
    s6_pluck_bridge: "Bridge",
    s6_pluck_btn_a: "A: Center",
    s6_pluck_btn_b: "B: Bridge",
    
    s6_stiffness_title: "String stiffness",
    s6_stiffness_p: "Real strings aren't perfectly flexible. Stiffness makes higher frequencies slightly out of tune (inharmonicity), which sounds more realistic:",
    s6_stiffness_label: "Stiffness:",
    s6_stiffness_none: "None",
    s6_stiffness_high: "High",
    s6_stiffness_btn_a: "A: No stiffness",
    s6_stiffness_btn_b: "B: Stiff",
    
    s6_body_title: "Body resonance",
    s6_body_p: "The instrument body (guitar, harp, etc.) amplifies certain frequencies and creates resonances. This gives each instrument its characteristic color:",
    s6_body_desc_expanded: "The guitar body acts like a resonance chamber \u2014 it amplifies certain frequencies more than others. These amplified frequencies are called 'formants'. They're what give a guitar its warm, woody sound versus an electric guitar's thinner tone.",
    s6_body_label: "Resonance:",
    s6_body_none: "None",
    s6_body_strong: "Strong",
    s6_body_btn_a: "A: No resonance",
    s6_body_btn_b: "B: Resonant body",
    
    s6_brightness_title: "Brightness (tone)",
    s6_brightness_p: "Adjusts high-frequency content. Low brightness sounds muffled and warm (like a nylon guitar). High brightness sounds crisp and percussive (like a steel guitar):",
    s6_brightness_label: "Brightness:",
    s6_brightness_dark: "Dark",
    s6_brightness_bright: "Bright",
    s6_brightness_btn_a: "A: Dark tone",
    s6_brightness_btn_b: "B: Bright tone",
    
    s6_reset_all: "Reset all",
    s6_play_current: "Play current",
    s6_transition: "Experiment with these parameters and hear how they transform the basic algorithm into realistic instruments!",

    // Section 7: Full synthesis
    s7_title: "7. Full synthesis: putting it all together",
    s7_p1: "Now let's combine everything. Select a preset and hear the sound of different instruments, all synthesized with the same core algorithm but different advanced parameters:",
    s7_presets_title: "Instrument examples",
    s7_presets_desc: "Each preset combines frequency, decay, pluck position, stiffness, body resonance, and brightness to create a characteristic sound:",
    s7_preset_guitar_classic: "Classic Guitar",
    s7_preset_guitar_classic_desc: "Nylon string, center pluck, warm",
    s7_preset_guitar_acoustic: "Acoustic Guitar",
    s7_preset_guitar_acoustic_desc: "Steel string, bright and resonant",
    s7_preset_harp: "Harp",
    s7_preset_harp_desc: "Crystalline, near bridge, fast decay",
    s7_preset_bass: "Bass",
    s7_preset_bass_desc: "Deep, slow, strong body resonance",
    s7_preset_banjo: "Banjo",
    s7_preset_banjo_desc: "Very bright, metallic, fast decay",
    s7_preset_sitar: "Sitar",
    s7_preset_sitar_desc: "High stiffness, body resonance, exotic",
    s7_p2: "Congratulations — you just synthesized the sound of plucked strings using only math. This is the same principle used by professional synthesizers, from guitar pedals to digital pianos.",
    s7_p3: "Ready to make music? Head over to the Compose page to create melodies using everything you've learned. You can place notes on a piano roll grid and hear them played with the Karplus-Strong algorithm. Try different decay values and BPM settings to create your perfect sound.",
    s7_p4: "Want to go deeper? The Karplus-Strong algorithm is just the beginning of physical modeling synthesis. The same principles \u2014 delay lines, filters, and feedback \u2014 are used to simulate drums, wind instruments, and even vocal cords.",

    // Compose page
    compose_title: "Compose Music",
    compose_desc: "Click on the grid to place notes. Click again to remove. Drag to extend duration.",
    play: "Play",
    stop: "Stop",
    decay: "Decay",
    instrument: "Instrument",
    toolbar_transport: "Transport",
    toolbar_sound: "Sound",
    toolbar_presets: "Presets",
    inst_basic: "KS Basic",
    inst_guitar_classic: "Classic Guitar",
    inst_guitar_acoustic: "Acoustic Guitar",
    inst_harp: "Harp",
    inst_bass: "Bass",
    inst_banjo: "Banjo",
    inst_sitar: "Sitar",
    preset: "Presets",
    select_preset: "Select a preset...",
    preset_scale: "C Major Scale",
    preset_matlab: "MATLAB Demo Song",
    preset_ode_to_joy: "Ode to Joy",
    preset_twinkle: "Twinkle Twinkle",
    preset_canon: "Canon in D",
    preset_happy_birthday: "Happy Birthday",
    preset_fur_elise: "F\u00fcr Elise",
    clear: "Clear",
    save: "Save",
    tips_title: "Tips",
    tip_1: "Notes snap to 16th note grid",
    tip_2: "Low decay = sound fades quickly",
    tip_3: "Try BPM between 60-180 for best results",
    tip_4: "Select an instrument to use advanced KS synthesis",
    waveform_title: "Waveform Visualization",
    waveform_noise: "1. Initial Noise",
    waveform_filtered: "2. After Filtering",
    waveform_final: "3. Final Signal",
    waveform_final_mix: "4. Final Mix",
    no_notes: "No notes to play",
    saved: "Saved successfully",
    confirm_clear: "Are you sure?",
    audio_error: "Audio error",
  }
};

// Current language state
let currentLang = localStorage.getItem('ks-lang') || 'es';

// Get translation
function t(key) {
    return L[currentLang][key] || L['es'][key] || key;
}

// Apply translations to all [data-i18n] elements
function applyLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = t(key);
        if (text) el.textContent = text;
    });
    // Update lang label
    const label = document.getElementById('langLabel');
    if (label) label.textContent = currentLang.toUpperCase();
    // Update html lang attribute
    document.documentElement.lang = currentLang;
}

// Toggle language
function toggleLanguage() {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    localStorage.setItem('ks-lang', currentLang);
    applyLanguage();
}
