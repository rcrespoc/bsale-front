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