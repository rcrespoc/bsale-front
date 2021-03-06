//@ts-check


/**
 * Modulo que se encarga de la gestión del carrito de compras.
 * @module helpers/carritoCompras
 */

import { insertarNuevo } from '../renderizado/templates.js';
import { ls, totalCompra } from '../variables.js';
/**
 * Array que contiene los productos elegidos por el cliente.
 * @type {Array.<Object>}
 */
let carritoCompras = [];
/**
 * Esta función agrega el producto elegido por el cliente al carrito de compras
 * siempre y cuando el producto no haya sido agregado antes, en cuyo caso
 * solo modificará su cantidad en el arreglo de productos.
 * 
 * @param {Object} productoElegido Producto que se va a agregar al carrito.
 * @returns {{nuevo: boolean | Object, repetido: boolean}} Retorna un objeto dependiendo del
 * resultado de dicha adición de producto.
 * Caso 1: Si el objeto es nuevo, retorna en su atributo 'nuevo' al producto nuevo mientras
 * que en su atributo 'repetido' retorna false.
 * Case 2: Si el objeto es repetido, retorna en su atributo 'nuevo' un false mientras que en
 * su atributo 'repetido' retorna el producto repetido.
 */
export function agregarAlCarrito (productoElegido){
  const id = productoElegido.dataset.id;
  const h5 = productoElegido.querySelector('h5');
  const img = productoElegido.querySelector('img');
  const precio = productoElegido.querySelector('.item-producto-precio > span');
  const producto = {
    nombre: h5.textContent,
    img: img.src,
    precio: precio.textContent,
    id,
    cantidad: 1,
    total: `${precio.textContent.slice(1)}`
  }
  const repetido = carritoCompras.find(item => producto.id === item.id);
  if(repetido){
    repetido.cantidad++;
    repetido.total = repetido.cantidad*repetido.precio.slice(1);
  }else{
    carritoCompras.push(producto)
  }
  actualizarTotal(carritoCompras);
  ls.setItem('carrito', JSON.stringify(carritoCompras));
  return {
    nuevo: (repetido) ? false : producto,
    repetido: (repetido) || false
  };
}

/**
 * 
 * @param {string} articulo El id del producto que se desea eliminar del carrito de compras
 * Esta función borra del carrito de compras aquel producto que ha decidido eliminar el cliente,
 * actualiza el total de la compra y también el LocalStorage.
 */
export function borrarProducto(articulo){
  carritoCompras = carritoCompras.filter(item => item.id !== articulo);
  actualizarTotal(carritoCompras);
  ls.setItem('carrito', JSON.stringify(carritoCompras));
}

/**
 * 
 * @param {Array<Object>} carrito El carrito de compras que se desea reestablecer.
 * Esta función reestablece el carrito de compras cuando el cliente recargue la página
 */
export function establecerCarrito(carrito){
  carrito.forEach(item => {
    carritoCompras.push(item);
    insertarNuevo(item);
  })
  actualizarTotal(carritoCompras);
}

/**
 * 
 * @param {Array<Object>} carritoCompras El array con los productos que ha agregado el cliente al carrito
 * Esta función actualiza el total de la compra que el cliente lleva hasta el momento.
 */
function actualizarTotal(carritoCompras){
  const total = carritoCompras.reduce((a, b) => a + Number(b.total), 0)
  totalCompra.textContent = `$${total}`;
}

/**
 * 
 * @param {Object} productoElegido El producto al que se le debe sumar una unidad.
 * Esta función agrega una unidad al producto deseado. Modifica el carrito de compras y la ventana del carrito de compras.
 */
export function sumarProducto(productoElegido){
  const producto = carritoCompras.find(item => item.id === productoElegido);
  producto.cantidad++;
  producto.total = producto.cantidad*producto.precio.slice(1);
  actualizarTotal(carritoCompras);
  ls.setItem('carrito', JSON.stringify(carritoCompras));
}

/**
 * 
 * @param {Object} productoElegido El producto elegido al que se le debe restar una unidad.
 * Esta función resta una unidad al producto deseado. Modifica el carrito de compras y la ventana del carrito de compras.
 * La función evalúa si la cantidad es mayor a cero, en cuyo caso hace su tarea, de lo contrario, no hace nada.
 * Nota: Si el objeto llega a 0 unidades, no borra el producto para mejor experiencia del usuario, ya que de arrepentirse
 * no deberá buscar de nuevo el producto.
 */
export function restarProducto(productoElegido){
  const producto = carritoCompras.find(item => item.id === productoElegido);
  if(producto.cantidad > 0){
    producto.cantidad--;
    producto.total = producto.cantidad*producto.precio.slice(1);
    actualizarTotal(carritoCompras);
    ls.setItem('carrito', JSON.stringify(carritoCompras));
  }
}
