//Espera a que el html esté cargado para empezar
document.addEventListener('DOMContentLoaded', () => {
    //Selecciona carrusel y elemento
    const carrusel = document.querySelector('.carrusel');
    const elementos = document.querySelectorAll('.elemento');
    //Nos lleva al primer elemento del carrusel
    let currentIndex = 0;

    //Centra elemento
    const centrarElemento = () => {
        //Selecciona el contenedor principal de carrusel
        const container = document.querySelector('.carrusel-container');
        //Encuentra elemento en el que estamos usando currentIndex
        const elemento = elementos[currentIndex];
        //Obtiene el ancho visible del contenedor
        const containerWidth = container.offsetWidth;
        //Posición horizontal del elemento respecto al borde izquierdo
        const elementoLeft = elemento.offsetLeft;
        //Ancho del elemento
        const elementoWidth = elemento.offsetWidth;
        //Calcula la posición para centrar
        const scrollTo = elementoLeft - (containerWidth / 2) + (elementoWidth / 2);
        carrusel.style.transform = `translateX(-${scrollTo}px)`;
    };

    //Scrol con flechitas
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' && currentIndex < elementos.length - 1) {
            //Flecha derecha
            currentIndex++;
            centrarElemento();
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            //Flecha izquierda
            currentIndex--;
            centrarElemento();
        }
    });

    //Centrar el primer elemento
    centrarElemento();
});