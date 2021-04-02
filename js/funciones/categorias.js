//@ts-check
/**
 * Modulo que ejecuta las consultas a la API de categorias.
 * @module fetch/categorias
 */

/**
 * Función para consumir la API y descargar las categorias.
 * @async
 * @function cargarCategorias
 * @returns {Promise<Array<Object>>} Retorna un Array con la información de las categorias.
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