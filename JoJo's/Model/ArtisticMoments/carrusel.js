document.addEventListener('DOMContentLoaded', () => {
    const carrusel = document.querySelector('.carrusel');
    const elementos = document.querySelectorAll('.elemento');
    let currentIndex = 0;

    //Centra elemento
    const centrarElemento = () => {
        const container = document.querySelector('.carrusel-container');
        const elemento = elementos[currentIndex];
        const containerWidth = container.offsetWidth;
        const elementoLeft = elemento.offsetLeft;
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