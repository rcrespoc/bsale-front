//@ts-check
/**
 * Modulo que ejecuta las consultas a la API de categorias.
 * @module fetch/categorias
 */

/**
 * Función que hace la consulta a la API a través del endpoint declarado.
 * @async
 * @function cargarCategorias
 * @returns {Promise<Array<Object>>} Retorna un Array con la información de las categorias.
 * @throws {Error} Si la aplicación no logra realizar la consulta al    
 * backend, va a disparar el error avisandole al cliente.
 * @since 1.0.0
 * @version 1.0.0
 * @author {@link https://github.com/rcrespoc|Richard Crespo}
 */
export const cargarCategorias = async() => {
  const url = `https://bsale-test-prod.herokuapp.com/api/categorias?limite=10&desde=0`;
  try {
    const resp = await fetch(url);
    const {categorias} = await resp.json();
    return categorias;
  } catch (error) {
    throw new Error(error);
  }
}