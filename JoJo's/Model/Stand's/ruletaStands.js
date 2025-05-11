const opciones = ["Silver Chariot Requiem", "King Crimson", "Made In Heaven", "Killer Queen", "Purple Haze"];
const repeticiones = 15; //Muchas repeticiones para evitar llegar al final
const opcionAncho = 120;
const opcionesVisibles = 4;

const ruletaDiv = document.getElementById('ruleta');
const carrusel = document.createElement('div');
carrusel.style.display = 'flex';
carrusel.style.transition = 'transform 0.1s ease'; //Más lenta por paso
ruletaDiv.appendChild(carrusel);

const mensajeResultado = document.createElement('div');
mensajeResultado.id = 'mensajeResultado';
document.querySelector('.contenido').appendChild(mensajeResultado);

let opcionesExtendidas = [];

function mostrarOpciones() {
    carrusel.innerHTML = '';
    opcionesExtendidas = Array(repeticiones).fill(opciones).flat();

    opcionesExtendidas.forEach(op => {
        const div = document.createElement('div');
        div.classList.add('opcion');
        div.textContent = op;
        carrusel.appendChild(div);
    });

    //Centrar en medio
    posicionActual = Math.floor(opciones.length * repeticiones / 2);
    const offset = -posicionActual * opcionAncho;
    carrusel.style.transition = 'none';
    carrusel.style.transform = `translateX(${offset}px)`;

    //Restaurar transición
    setTimeout(() => {
        carrusel.style.transition = 'transform 0.1s ease';
    }, 50);
}

let posicionActual = 0;

function girarRuleta() {
    //Limpiar opción ganadora anterior
    carrusel.querySelectorAll('.opcion').forEach(op => op.classList.remove('seleccionada'));
    mensajeResultado.textContent = '';

    //Reiniciar al centro
    posicionActual = Math.floor(opciones.length * repeticiones / 2);
    carrusel.style.transition = 'none';
    const offsetReset = -posicionActual * opcionAncho;
    carrusel.style.transform = `translateX(${offsetReset}px)`;

    setTimeout(() => {
        carrusel.style.transition = 'transform 0.1s ease';

        const pasos = Math.floor(Math.random() * 15) + 15;
        let contador = 0;

        const intervalo = setInterval(() => {
            contador++;
            posicionActual++;

            if (posicionActual >= opcionesExtendidas.length - opcionesVisibles) {
                // Nunca debe llegar al final
                posicionActual = Math.floor(opciones.length * repeticiones / 2);
            }

            const offset = -posicionActual * opcionAncho;
            carrusel.style.transform = `translateX(${offset}px)`;

            if (contador >= pasos) {
                clearInterval(intervalo);

                setTimeout(() => {
                    const opcionesDOM = carrusel.querySelectorAll('.opcion');

                    //Encuentra el centro visual
                    const centroVisualX = ruletaDiv.offsetLeft + ruletaDiv.offsetWidth / 2;

                    let seleccionada = null;
                    let distanciaMinima = Infinity;

                    //Buscamos la opción más cercana al centro
                    opcionesDOM.forEach(opcion => {
                        const rect = opcion.getBoundingClientRect();
                        const centerX = rect.left + rect.width / 2;

                        //Calculamos la distancia entre el centro visual y el centro de la opción
                        const distancia = Math.abs(centerX - centroVisualX);

                        //Si la distancia es más pequeña que la mínima registrada, seleccionamos esta opción
                        if (distancia < distanciaMinima) {
                            distanciaMinima = distancia;
                            seleccionada = opcion;
                        }
                    });

                    //Si encontramos una opción cerca del centro, la seleccionamos
                    //Dentro del bloque donde seleccionas la opción ganadora:
                    if (seleccionada) {
                        seleccionada.classList.add('seleccionada');

                        // Limpiar mensajeResultado
                        mensajeResultado.innerHTML = '';

                        // Crear texto del resultado
                        const texto = document.createElement('div');
                        texto.textContent = `¡Te ha tocado: ${seleccionada.textContent}!`;
                        mensajeResultado.appendChild(texto);

                        // Crear contenedor para contenido del archivo
                        const contenedorContenido = document.createElement('div');
                        contenedorContenido.id = 'contenidoExtra';
                        mensajeResultado.appendChild(contenedorContenido);

                        // Leer y mostrar contenido del archivo
                        const nombre = seleccionada.textContent.trim();
                        const rutaArchivo = `./archivos/${nombre}.txt`; // O .html si usas HTML
                        fetch(rutaArchivo)
                            .then(response => {
                                if (!response.ok) throw new Error("Archivo no encontrado");
                                return response.text();
                            })
                            .then(textoArchivo => {
                                contenedorContenido.textContent = textoArchivo;

                                // Luego mostrar la imagen
                                const imagen = document.createElement('img');
                                imagen.src = `../IMG/${nombre}.png`;
                                imagen.alt = nombre;
                                imagen.classList.add('resultado-imagen');
                                mensajeResultado.appendChild(imagen);
                            })
                            .catch(err => {
                                contenedorContenido.textContent = "No se pudo cargar el contenido.";
                                console.warn("No se pudo cargar el archivo:", err);
                            });
                    }


                }, 200);  //Tiempo de espera después de terminar el giro
                //Tiempo de espera después de terminar el giro

            }
        }, 50); //Velocidad por paso (más lento = número más alto)
    }, 20);
}

document.getElementById('botonRuleta').addEventListener('click', girarRuleta);
mostrarOpciones();
