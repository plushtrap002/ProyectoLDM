const opciones = ["Premio 1", "Premio 2", "Nada", "Otra vez", "Premio 3", "Sorpresa"];
const ruletaDiv = document.getElementById('ruleta');
const carrusel = document.createElement('div');
carrusel.style.display = 'flex';
carrusel.style.transition = 'transform 0.3s ease';
ruletaDiv.appendChild(carrusel);

const opcionAncho = 120; // Ancho de cada opción
const opcionesVisibles = 4; // Número de opciones visibles

// Div para mostrar el mensaje de resultado
const mensajeResultado = document.createElement('div');
mensajeResultado.id = 'mensajeResultado'; // Agregamos un ID para el estilo
document.querySelector('.contenido').appendChild(mensajeResultado);

function mostrarOpciones() {
    carrusel.innerHTML = '';
    const opcionesExtendidas = [...opciones, ...opciones, ...opciones]; // Opciones extendidas para permitir desplazamiento infinito
    opcionesExtendidas.forEach(op => {
        const div = document.createElement('div');
        div.classList.add('opcion');
        div.textContent = op;
        carrusel.appendChild(div);
    });
}

function girarRuleta() {
    const totalOpciones = opciones.length * 3;
    let posicionActual = opciones.length;
    let pasos = Math.floor(Math.random() * 15) + 15;  // Número aleatorio de pasos
    let contador = 0;

    const intervalo = setInterval(() => {
        contador++;
        posicionActual++;

        if (posicionActual >= totalOpciones - opcionesVisibles) {
            posicionActual = opciones.length;
        }

        const offset = -posicionActual * opcionAncho;
        carrusel.style.transform = `translateX(${offset}px)`;  // Movemos el carrusel

        if (contador >= pasos) {
            clearInterval(intervalo);

            setTimeout(() => {
                // Calcular el centro visible
                const centroVisualX = ruletaDiv.offsetWidth / 2;
                const opcionesDOM = carrusel.querySelectorAll('.opcion');
                let seleccionada = null;

                // Buscar la opción que está más cerca del centro
                opcionesDOM.forEach(opcion => {
                    const rect = opcion.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;

                    // Depuración: mostramos las posiciones calculadas para verificar
                    console.log(`Opción: ${opcion.textContent}, Posición X: ${rect.left}, Center X: ${centerX}`);

                    // Limpiar la clase de la opción antes de aplicar la nueva
                    opcion.classList.remove('seleccionada');

                    // Verificamos cuál opción está más cerca del centro visual
                    if (Math.abs(centerX - centroVisualX) < opcionAncho / 2) {
                        seleccionada = opcion;
                    }
                });

                if (seleccionada) {
                    seleccionada.classList.add('seleccionada');
                    mensajeResultado.textContent = `¡Has ganado: ${seleccionada.textContent}!`;
                    console.log(`Seleccionada: ${seleccionada.textContent}`);
                } else {
                    console.log("No se seleccionó ninguna opción correctamente");
                }
            }, 100);  // Tiempo de espera para asegurar que el desplazamiento termine antes de calcular el centro
        }
    }, 100);
}

document.getElementById('botonRuleta').addEventListener('click',girarRuleta);
mostrarOpciones();
