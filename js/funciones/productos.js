//@ts-check

/**
 * Modulo que ejecuta las consultas a la API de productos.
 * @module fetch/productos
 */

/**
 * Función que recupera productos por categoria.
 * @function traerProductosPorCategoria
 * @param {String} id Id de la categoria a la cual pertenecen los productos que se van a retornar.
 * @param {Number} [limite=6] La cantidad máxima de productos que se van a retornar por búsqueda.
 * @param {Number} [desde=0] Desde qué producto se va a iniciar la búsqueda. Sirve para paginación.
 * @returns {Promise<Object>} Retorna un objeto que contiene la información los productos de dicha categoria y el total de productos que existen en dicha categoria.
 * NOTA: No retorna todos, ver el parámetro 'limite'.
 * @throws {Error} Si la aplicación no logra realizar la consulta al    
 * backend, va a disparar el error avisandole al cliente.
 * @since 1.0.0
 * @version 1.0.0
 * @author {@link https://github.com/rcrespoc|Richard Crespo}
 */
export const traerProductosPorCategoria = async (id, limite = 6, desde = 0) => {
  const url = `https://bsale-test-prod.herokuapp.com/api/productos/category/${id}?limite=${limite}&desde=${desde}`;
  try {
    const resp = await fetch(url);
    const data = await resp.json(); 
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Función que recupera productos por nombre.
 * @function traerProductosPorNombre
 * @param {string} nombre Nombre del producto
 * @param {Number} [limite=6] La cantidad máxima de productos que se van a retornar por búsqueda.
 * @param {Number} [desde=0] Desde qué producto se va a iniciar la búsqueda. Sirve para paginación.
 * @returns {Promise<Object>} Retorna un objeto que contiene la información los productos de dicha búsqueda y el total de productos que existen en dicha categoria.
 * NOTA: No retorna todos, ver el parámetro 'limite'.
 * @throws {Error} Si la aplicación no logra realizar la consulta al    
 * backend, va a disparar el error avisandole al cliente.
 * @since 1.0.0
 * @version 1.0.0
 * @author {@link https://github.com/rcrespoc|Richard Crespo}
 */
export const traerProductosPorNombre = async(nombre, limite = 6, desde = 0) => {
  const url = `https://bsale-test-prod.herokuapp.com/api/productos/nombre/${nombre}?limite=${limite}&desde=${desde}`;
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}