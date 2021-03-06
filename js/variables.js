//@ts-check

/**
 * Modulo de variables
 * @module variables
 */

/**
 * Este es el objeto document.
 * @type {Object}
 */
export const d = document;
/**
 * Este es el botón del Menú Hamburguesa.
 * @type {HTMLElement}
 */
export const $menuBtn = d.querySelector('.menu-btn');
/**
 * Este es el menú que contiene el Form de búsqueda.
 * @type {HTMLElement}
 */
export const $menu = d.querySelector('.menu');
/**
 * Este es el botón para buscar productos.
 * @type {HTMLElement}
 */
export const $btnSearch = d.querySelector('#submitBtn');
/**
 * Este es el Input de la búsqueda.
 * @type {HTMLElement}
 */
export const $inputSearch = d.querySelector('#search');
/**
 * Este es el botón para volver a la página principal.
 * @type {HTMLElement}
 */
export const $btnHome = d.querySelector('.btnHome');
/**
 * Este es el botón del carrito de compras.
 * @type {HTMLElement}
 */
export const $btnCarrito = d.querySelector('.btnCarrito');
/**
 * Esta es la interfaz del carrito de compras.
 * @type {HTMLElement}
 */
export const $ventanaCarrito = d.querySelector('.carrito-compras');
/**
 * Este es el botón para cerrar el carrito de compras.
 * @type {HTMLElement}
 */
export const $btnCerrar = d.querySelector('.btnCerrar');
/**
 * Este es el elemento main del DOM.
 * @type {HTMLElement}
 */
export const main = d.querySelector('main');
/**
 * Esta es la table de productos del carrito de compras.
 * @type {HTMLElement}
 */
export const $tabla = d.querySelector('.tabla-productos-compras > tbody');
/**
 * Referencia al LocalStorage del cliente.
 * @type {Storage}
 */
export const ls = localStorage;
/**
 * Elemento que refleja el total de compra del cliente.
 * @type {HTMLElement}
 */
export const totalCompra = document.querySelector('.total-compra');