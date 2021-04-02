export const traerProductosPorCategoria = async(id, limite = 6, desde = 0) => {
  const url = `https://bsale-test-prod.herokuapp.com/api/productos/category/${id}?limite=${limite}&desde=${desde}`;
  try {
    const resp = await fetch(url);
    const data = await resp.json(); 
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

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