//@ts-check

/**
 * Modulo que renderiza los elementos HTML.
 * @module render/templates
 */

import { agregarAlCarrito, borrarProducto, restarProducto, sumarProducto } from "../helpers/carritoCompras.js";
import { limpiarHTML, palabraMayuscula } from "../helpers/utilidades.js";
import { d, $tabla } from "../variables.js";

/**
 * Funcion que dibuja el HTML de las categorias.
 * @function dibujarHTMLCategorias
 * @param {Array<Object>} datos Array con las categorias que provienen de la consulta a la API.
 */
export const dibujarHTMLCategorias = (datos = []) => {
  const fragment = d.createDocumentFragment();
  const $sectionCategorias = d.querySelector('.categorias-productos');
  limpiarHTML(d.querySelector('.productos'));
  limpiarHTML($sectionCategorias);

  datos.forEach(dato => {
    const nombre = dato.name.split(' ').join('-');

    // Creando elementos
    const article = d.createElement('article');
    const h5 = d.createElement('h5');

    // Agregando clases
    article.classList.add('item-categoria');
    article.dataset.id = dato.id;
    article.style.backgroundImage = `url(./assets/images/${nombre}.jpg)`;

    // Agregando contenido
    h5.textContent = palabraMayuscula(dato.name);

    // Agregando hijos a sus padres
    article.appendChild(h5);
    fragment.appendChild(article);
  })
  $sectionCategorias.appendChild(fragment);
}

/**
 * Funcion que dibuja el HTML de los productos.
 * @function dibujarHTMLProductos
 * @param {Object} datos Array con las productos que provienen de la consulta a la API.
 * @param {string} titulo Titulo que abarca la búsqueda de productos.
 */
export const dibujarHTMLProductos = (datos = {}, titulo) => {
  const fragment = d.createDocumentFragment();
  const $sectionProductos = d.querySelector('.productos');
  const $sectionCategorias = d.querySelector('.categorias-productos');
  limpiarHTML($sectionCategorias);
  limpiarHTML($sectionProductos);

  const h5 = d.createElement('h5');
  h5.textContent = titulo;
  h5.style.fontSize = '2rem';
  h5.style.marginTop = '1rem';
  $sectionCategorias.appendChild(h5);

  datos.forEach(producto => {
    // Creando elementos
    const [divItem, divIcono] = crearElementosEnMasa('div', 2);
    const article = d.createElement('article');
    const h5 = d.createElement('h5');
    const img = d.createElement('img');
    const span = d.createElement('span');
    const i = d.createElement('i');

    // Agregando clases
    article.classList.add('item-producto');
    agregarClasesAElemento(divItem, 'item-producto-precio', 'flex');
    agregarClasesAElemento(i, 'fas', 'fa-shopping-cart')
    divIcono.classList.add('item-producto-precio-icono');

    // Atributos
    atributosImagen(img, producto.url_image || `./assets/images/no-image.jpg`, producto.nombre);
    article.dataset.id = producto.id;
    
    // Contenido
    h5.textContent = producto.name;
    span.textContent = `$${producto.price}`;
    
    // Agregando hijos a padres
    divIcono.appendChild(i);
    agregarHijosAPadres(divItem, span, divIcono);
    agregarHijosAPadres(article, h5, img, divItem);

    // Colocando el icono de carrito a la escucha
    divIcono.addEventListener('click', () => {
      const objetoCarrito = agregarAlCarrito(article);
      dibujarCarritoCompras(objetoCarrito);
    })

    // Gestionando descuento
    if(producto.discount > 0){
      const divDescuento = d.createElement('div');
      const spanDescuento = d.createElement('span');
      divDescuento.classList.add('descuento-producto');
      spanDescuento.textContent = `-${producto.discount}%`;
      divDescuento.appendChild(spanDescuento);
      article.appendChild(divDescuento);
    }
    fragment.appendChild(article);
    
  })
  $sectionProductos.appendChild(fragment);
}

/**
 * Función que manda a dibujar el elemento en el carrito de compras.
 * @function dibujarCarritoCompras
 * @param {Object} carrito Objeto que contiene el articulo elegido por el cliente y que se dibujará posteriormente
 */
const dibujarCarritoCompras = (carrito) => {
  const { repetido, nuevo } = carrito;
  (nuevo) ? insertarNuevo(nuevo) : modificarCantidad(repetido);
  //@ts-ignore
  Swal.fire(
    'Producto agregado!',
    (repetido) ? repetido.nombre : nuevo.nombre,
    'success'
  )
}

/**
 * Funcion que dibuja un producto nuevo en el carrito de compras.
 * @function insertarNuevo
 * @param {Object} elemento Producto elegido por el cliente, es un producto nuevo en el carrito de compras.
 */
export const insertarNuevo = (elemento) => {
  // Creando elementos
  const tr = d.createElement('tr');
  const input = d.createElement('input');
  const img = d.createElement('img');
  const [td1, td2, td3, td4, td5, td6, td7] = crearElementosEnMasa('td', 7);
  const [buttonMas, buttonMenos, buttonBorrar] = crearElementosEnMasa('button', 3);
  const [iMas, iMenos, iBorrar] = crearElementosEnMasa('i', 3);
  
  // Agregando atributos y clases
  tr.classList.add('item-producto-carrito-compras');
  input.setAttribute('type','hidden');
  atributosImagen(img, elemento.img, elemento.nombre);
  buttonMenos.classList.add('.btnMenos');
  buttonMas.classList.add('.btnMas');
  buttonBorrar.classList.add('.btnBorrar');
  agregarClasesAElemento(iMas, 'fas', 'fa-plus');
  agregarClasesAElemento(iMenos, 'fas', 'fa-minus');
  agregarClasesAElemento(iBorrar, 'fas', 'fa-times-circle');

  buttonMas.addEventListener('click', () => {
    sumarProducto(elemento.id);
    modificarCantidad({id: elemento.id, cantidad: elemento.cantidad})
  })
  buttonMenos.addEventListener('click', () => {
    restarProducto(elemento.id);
    modificarCantidad({id: elemento.id, cantidad: elemento.cantidad})
  })
  buttonBorrar.addEventListener('click', () => {
    //@ts-ignore
    Swal.fire({
      title: '¿Desea eliminar el producto elegido?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, quiero conservarlo.',
      confirmButtonText: 'Sí, quiero borrarlo.'
    }).then((result) => {
      if (result.isConfirmed) {
        borrarProducto(elemento.id);
        tr.remove();
        // @ts-ignore
        Swal.fire(
          'Producto removido del carrito.',
          elemento.nombre,
          'success'
        )
      }
    })
  })

  // Agregando contenido
  input.value = elemento.id;
  td2.textContent = elemento.nombre;
  td3.textContent = elemento.precio;
  td5.textContent = elemento.cantidad;

  // Agregando hijos a padres
  tr.appendChild(input);
  td1.appendChild(img);
  buttonMenos.appendChild(iMenos);
  td4.appendChild(buttonMenos)
  buttonBorrar.appendChild(iBorrar);
  td7.appendChild(buttonBorrar);
  buttonMas.appendChild(iMas);
  td6.appendChild(buttonMas);
  agregarHijosAPadres(tr, td1, td2, td3, td4, td5, td6, td7);

  $tabla.appendChild(tr);
}

/**
 * Funcion que aumenta la cantidad de un producto previamente insertado en el carrito de compras.
 * @function modificarCantidad
 * @param {Object} elemento Elemento repetido en el carrito de compras.
 */
const modificarCantidad = (elemento) => {
  const items = Array.from($tabla.querySelectorAll('.item-producto-carrito-compras'));
  items.shift();
  items.forEach(item => {
    // @ts-ignore
    if(item.firstElementChild.value === elemento.id){
      item.querySelector('td:nth-of-type(5)').textContent = elemento.cantidad;
    }
  })
}

/**
 * Funcion que inserta los elementos hijos a su respectivo padre.
 * @function agregarHijosAPadres
 * @param {HTMLElement} padre Elemento padre del DOM en el cual se insertarán los hijos.
 * @param  {...HTMLElement} hijos Elementos hijos que serán insertados en el padre.
 */
const agregarHijosAPadres = (padre, ...hijos) => {
  hijos.forEach(hijo => padre.appendChild(hijo));
}

/**
 * Funcion que crea la cantidad deseada de un mismo tipo de elemento para el DOM.
 * @function crearElementosEnMasa
 * @param {string} tipo Tipo de elemento que desea crearse
 * @param {Number} cantidad Cantidad de elementos que se desean crear
 * @returns {Array<HTMLElement>} Devuelve un arreglo de elementos para el DOM.
 */
const crearElementosEnMasa = (tipo, cantidad) => {
  const arr = [];
  for(let i = 1; i<=cantidad; i++){
    arr.push(d.createElement(tipo));
  }
  return arr;
}

/**
 * Funcion que inserta clases a un elemento específico.
 * @param {HTMLElement} elemento Elemento del DOM al cual se le quieren agregar las clases.
 * @param  {...string} clases Clases que se quieren insertar al elemento.
 */
const agregarClasesAElemento = (elemento, ...clases) => {
  clases.forEach(clase => elemento.classList.add(clase));
}

/**
 * 
 * @param {HTMLImageElement} imagen Elemento del DOM tipo Imagen a la cual se le quieren agregar los atributos.
 * @param {string} src URL de la imagen.
 * @param {string} alt Texto del alt.
 */
const atributosImagen = (imagen, src, alt) => {
  imagen.src = src;
  imagen.alt = alt;
}