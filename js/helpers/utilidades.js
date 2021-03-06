//@ts-check


/**
 * Modulo con funciones auxiliares.
 * @module helpers/utilidades
 */

import { traerProductosPorCategoria, traerProductosPorNombre } from "../funciones/productos.js";
import { dibujarHTMLProductos } from "../renderizado/templates.js";
import { d } from "../variables.js";

/**
 * Cantidad de productos por página
 * @type {Number}
 */
let productosxPagina = 6;
/**
 * Página en la que se encuentra el cliente.
 * @type {Number}
 */
let paginaActual = 1;
/**
 * Cantidad de páginas totales.
 * @type {Number}
 */
let paginasTotal = 0;
/**
 * "Desde qué producto mostrar".
 * Esta variable indica el primero número de producto que mostrará en la búsqueda.
 * La API lo solicita para realizar el paginado en el lado del cliente.
 * @type {Number}
 */
let desde = 0;

/**
 * Función que manda a consumir la API y recibe los resultados, modifica el DOM e imprime el paginador.
 * @function productosPorNombre
 * @param {string} terminoDeBusqueda Nombre que el usuario ha introducido para la búsqueda de productos.
 */
export const productosPorNombre = async(terminoDeBusqueda) => {
  desde = 0;
  mostrarSpinner(d.querySelector('.productos'))
  const {productos, total} = await traerProductosPorNombre(terminoDeBusqueda,productosxPagina, desde);
  if(productos.length !== 0){
    paginasTotal = Math.ceil(total / productosxPagina);
    desde = (paginaActual - 1)*productosxPagina;
    dibujarHTMLProductos(productos, terminoDeBusqueda);
    imprimirPaginador(paginaActual, traerProductosPorNombre, terminoDeBusqueda, '.productos');
    location.hash = '#'+'main-section';
  }else{
    modalError('No existen productos con el término buscado. Volviendo a la página principal.');
    setTimeout(() => {
      window.location.replace(window.location.pathname);
    }, 3000);
  }
}

/**
 * Función que coloca a todos los botones de categorias a la escucha para traer los productos.
 * Establece el numero de productos por página.
 * @function agregarEnlacesACategorias
 */
export const agregarEnlacesACategorias = () => {
  const $itemCategorias = d.querySelectorAll('.item-categoria');
  productosxPagina = establecerProductosXPagina(window.innerWidth);
  $itemCategorias.forEach(item => {
    item.addEventListener('click', async() => {
      const numeroCategoria = item.dataset.id;
      const nombreCategoria = item.firstElementChild.textContent;
      mostrarSpinner(d.querySelector('.categorias-productos'));
      const {productos, total} = await traerProductosPorCategoria(numeroCategoria, productosxPagina, desde);
      paginasTotal = Math.ceil(total / productosxPagina);
      desde = (paginaActual-1)*productosxPagina;
      dibujarHTMLProductos(productos, nombreCategoria);
      imprimirPaginador(paginaActual, traerProductosPorCategoria, numeroCategoria, '.productos', nombreCategoria);
    })
  })
}

/**
 * Función para limpiar un elemento específico del DOM.
 * @function limpiarHTML
 * @param {HTMLElement} elementoParaLimpiar El elemento sobre el cual se desean eliminar sus hijos. 
 * 
 */
export const limpiarHTML = (elementoParaLimpiar) => {
  while(elementoParaLimpiar.firstElementChild){
    elementoParaLimpiar.removeChild(elementoParaLimpiar.firstElementChild);
  }
}

/**
 * Función para imprimir el paginador de productos.
 * @function imprimirPaginador
 * @param {Number} paginaActual Página en la cual se encuentra el cliente.
 * @param {Function} fn Callback que recibe la función que será llamado posteriormente.
 * @param {string} busqueda Término de la búsqueda, para mantener el título.
 * @param {string} elemento Nombre de la clase para encontrar el elemento mediante querySelector.
 * @param {string} [nombreCategoria = ''] Titulo de la categoria que se está buscando. Se omite en caso de busqueda por nombre.
 */
const imprimirPaginador = (paginaActual, fn, busqueda, elemento, nombreCategoria = '') => {
  const fragment = d.createDocumentFragment();
  const $paginador = d.querySelector('.paginacion')
  limpiarHTML($paginador);
  for(let i = 1; i <= paginasTotal; i++){
    const a = d.createElement('button');
    a.textContent = i;
    if(!(paginaActual === i)){
      a.onclick = async(e) => {
        paginaActual = i;
        desde = (paginaActual-1)*productosxPagina;
        mostrarSpinner(d.querySelector(`${elemento}`))
        const {productos} = await fn(busqueda, productosxPagina, desde);
        dibujarHTMLProductos(productos, nombreCategoria || busqueda);
        imprimirPaginador(paginaActual, fn, busqueda, elemento, nombreCategoria);
      }
    }else{
      a.disabled = true;
    }
    fragment.appendChild(a);
  }
  $paginador.appendChild(fragment);
}

/**
 * Función para abrir y cerrar el menú de búsqueda.
 * @function funcionMenu
 * @param {HTMLElement} $menuBtn El elemento del DOM que referencia al botón del menú.
 * @param {HTMLElement} $menu El elemento del DOM que referencia a la ventana del menú de búsqueda.
 */
export const funcionMenu = ($menuBtn, $menu) => {
  $menuBtn.firstElementChild.classList.toggle('none');
  $menuBtn.lastElementChild.classList.toggle('none');
  $menu.classList.toggle('is-active');
}

/**
 * Función para capitalizar la primera letra de la primera palabra de la frase dada.
 * @function palabraMayuscula
 * @param {string} string Frase la cual se quiere la primera letra capitalizada de la primera palabra.
 * @returns {string} Palabra con la primera letra capitalizada.
 */
export const palabraMayuscula = (string = '') => {
  const nombre = string.split(' ');
  nombre[0] = mayuscula(nombre[0]);
  return nombre.join(' ');
}

/**
 * Funcion que vuelve la primera letra mayuscula.
 * @function mayuscula
 * @param {string} palabra Palabra que tendrá la primera letra mayúscula
 * @returns {string} Retorna la palabra con la primera letra capitalizada.
 */
const mayuscula = (palabra) => {
  return palabra[0].toUpperCase()+palabra.slice(1);
}

/**
 * Funcion que muestra un spinner de carga en la pantalla.
 * @function mostrarSpinner
 * @param {HTMLElement} elementoHTML Elemento donde se va a mostrar el spinner.
 */
export const mostrarSpinner = (elementoHTML) => {
  limpiarHTML(elementoHTML);
  elementoHTML.innerHTML = `
  <div class="sk-circle">
    <div class="sk-circle1 sk-child"></div>
    <div class="sk-circle2 sk-child"></div>
    <div class="sk-circle3 sk-child"></div>
    <div class="sk-circle4 sk-child"></div>
    <div class="sk-circle5 sk-child"></div>
    <div class="sk-circle6 sk-child"></div>
    <div class="sk-circle7 sk-child"></div>
    <div class="sk-circle8 sk-child"></div>
    <div class="sk-circle9 sk-child"></div>
    <div class="sk-circle10 sk-child"></div>
    <div class="sk-circle11 sk-child"></div>
    <div class="sk-circle12 sk-child"></div>
  </div>
  `
}

/**
 * Funcion que establece la cantidad de productos que se mostrarán por búsqueda.
 * @function establecerProductosXPagina
 * @param {Number} width Ancho de la pantalla donde se ejecuta la aplicación.
 * @returns {Number} Cantidad de elementos que van a mostrarse en pantalla.
 */
const establecerProductosXPagina = (width) => {
  if(width > 0 && width < 768){
    return 6;
  }else if(width >= 768 && width <= 1024 ){
    return 9;
  }else if(width > 1024 ){
    return 8;
  }
}

/**
 * Función que muestra mensaje de error en forma de modal.
 * @function modalError
 * @param {string} mensaje Mensaje de error que se mostrará al usuario.
 */
export const modalError = (mensaje) => {
  //@ts-ignore
  Swal.fire({
    title: 'Error',
    text: mensaje,
    icon: 'error'
  })
}