const opciones = ["Silver Chariot Requiem", "King Crimson", "Made In Heaven", "Killer Queen", "Purple Haze"];
const repeticiones = 15; // Muchas repeticiones para evitar mostrar el final de estas al girar la ruleta
const opcionAncho = 120; // El ancho que ocupará cada opcion en el div
const opcionesVisibles = 4; // Cantidad de opciones visibles que estarán en el div

const ruletaDiv = document.getElementById('ruleta'); // Se coge el elemento "ruleta" del html y se guarda como variable ruletaDiv
const carrusel = document.createElement('div'); // Se crea un nuevo elemento de tipo div y se guarda como variable carrusel
carrusel.style.display = 'flex'; // El div será un display de tipo flex para que se muestren horizontalmente
ruletaDiv.appendChild(carrusel); // Se añade la ruleta al div del html

const mensajeResultado = document.createElement('div'); // Se crea otro elemento de tipo div para alojar el resultado
mensajeResultado.id = 'mensajeResultado'; // Y se le agrega el ID de mensajeResultado para el css
document.querySelector('.contenido').appendChild(mensajeResultado); // Se le agrega el contenido al mensajeResultado en el html para mostrarlo

let opcionesExtendidas = []; // Se crea un array llamado opcionesExtendidas para alojar las opciones de más para que se vayan repitiendo

function mostrarOpciones() {
    carrusel.innerHTML = ''; // Aquí se vacía el carrusel para que desaparezca la opcion seleccionada la ultima vez
    opcionesExtendidas = Array(repeticiones).fill(opciones).flat(); // Se llena el array con las opciones

    opcionesExtendidas.forEach(op => { // Esta función crea un div por cada opción que hay y se agrega al carrusel
        const div = document.createElement('div');
        div.classList.add('opcion');
        div.textContent = op;
        carrusel.appendChild(div);
    });
}

function girarRuleta() {
    // Esta función es la que hace que el carrusel gire, lo primero que hace es borrar lo seleccionado en anteriores tiradas
    // Para reiniciar cada vez que se gire de nuevo.
    carrusel.querySelectorAll('.opcion').forEach(op => op.classList.remove('seleccionada'));
    mensajeResultado.textContent = '';

    // La ruleta se reinicia cada vez que se ejecuta, para estar en el centro de las opciones y nunca llegar al final
    let posicionBase = Math.floor(opciones.length * repeticiones / 2);

    // Se elige una opción aleatoria dentro de las opciones originales
    const indiceAleatorio = Math.floor(Math.random() * opciones.length);

    // Se calcula la posición final como base + el índice aleatorio
    const posicionFinal = posicionBase + indiceAleatorio;

    // Se calcula el desplazamiento para que la opción quede centrada visualmente
    const offsetFinal = -posicionFinal * opcionAncho + (ruletaDiv.offsetWidth / 2 - opcionAncho / 2);

    // Se aplica la animación de desplazamiento
    carrusel.style.transition = 'transform 2s cubic-bezier(0.25, 1, 0.5, 1)';
    carrusel.style.transform = `translateX(${offsetFinal}px)`;

    setTimeout(() => {
        // En esta opción se escogerá la opción ganadora.
        const opcionesDOM = carrusel.querySelectorAll('.opcion');

        // En esta variable se guardará la opción que ha quedado en el centro del carrusel
        const centroVisualX = ruletaDiv.offsetLeft + ruletaDiv.offsetWidth / 2;

        let seleccionada = null;
        // No comprendo muy bien por qué se usa infinity aquí, pero si no lo pongo no funciona nada
        let distanciaMinima = Infinity;

        // Esta función me ha ayudado mucho ChatGPT, ya que había veces que se
        // quedaba en el centro entre dos opciones y no seleccionaba ninguna.
        // Esta función escoge la que más cerca esté del centro.
        opcionesDOM.forEach(opcion => {
            const rect = opcion.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;

            //Calculamos la distancia entre el centro visual y el centro de la opción
            const distancia = Math.abs(centerX - centroVisualX);

            // Si la distancia es más pequeña que la mínima registrada, seleccionamos esta opción
            if (distancia < distanciaMinima) {
                distanciaMinima = distancia;
                seleccionada = opcion;
            }
        });

        // Si encontramos una opción cerca del centro, la selecciona
        // Dentro del bloque donde se escoge la opción ganadora
        if (seleccionada) {
            seleccionada.classList.add('seleccionada');

            // Limpiar mensajeResultado de anteriores tiradas
            mensajeResultado.innerHTML = '';

            // Crear texto del resultado dentro de un div nuevo
            const texto = document.createElement('div');
            texto.textContent = `¡Te ha tocado: ${seleccionada.textContent}!`;
            mensajeResultado.appendChild(texto);

            // Se crea un contenedor para el contenido de un archivo que tiene texto
            // Personalizado dependiendo de la opción que te ha tocado
            const contenedorContenido = document.createElement('div');
            contenedorContenido.id = 'contenidoExtra';
            mensajeResultado.appendChild(contenedorContenido);

            // Para leer el contenido de este archivo
            // Guardamos el nombre de la opción ganadora en una variable
            // Y buscamos el nombre del archivo guardado como ese nombre.txt

            const nombre = seleccionada.textContent.trim();
            const rutaArchivo = `./archivos/${nombre}.txt`;

            fetch(rutaArchivo) //con esta función busca el archivo
                .then(response => {
                    if (!response.ok) throw new Error("Archivo no encontrado"); //si no lo encuentra muestra este error
                    return response.text();
                })
                .then(textoArchivo => {
                    // Si lo encuentra, se guarda el texto de dentro del archivo en el contenedor
                    contenedorContenido.textContent = textoArchivo;

                    // Después de mostrar el texto, mostrará una imagen con el mismo nombre
                    const imagen = document.createElement('img'); // Creando el elemento
                    imagen.src = `../IMG/${nombre}.png`; // Y todas sus opciones
                    imagen.alt = nombre;
                    imagen.classList.add('resultado-imagen');
                    mensajeResultado.appendChild(imagen);
                })
                .catch(err => { // Cualquier error que dé el fetch, mostrará un error tanto por consola como
                    //en el div, que mostrará "No se pudo cargar el contenido"
                    contenedorContenido.textContent = "No se pudo cargar el contenido.";
                    console.warn("No se pudo cargar el archivo:", err);
                });
        }

    }, 2100); // Tiempo de espera después de terminar el giro, si incrementamos este número
    // Tardará más en ir cambiando de opción y viceversa.
}


// Aquí hacemes que al dar clic en el botón etiquetado como botonRuleta, ejecute la función girarRuleta()
document.getElementById('botonRuleta').addEventListener('click', girarRuleta);

// En esta llamada hacemos que se cree tanto el div que muestra las opciones, como el carrusel y lo necesario
mostrarOpciones();
