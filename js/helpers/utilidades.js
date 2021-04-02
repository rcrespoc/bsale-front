import { traerProductosPorCategoria, traerProductosPorNombre } from "../funciones/productos.js";
import { dibujarHTMLProductos } from "../renderizado/templates.js";
import { d } from "../variables.js";
let productosxPagina = 6;
let paginaActual = 1;
let paginasTotal = 0;
let categoria = 0;
let desde = 0;
let nombre = '';
let termino = '';

export const productosPorNombre = async(palabra = '') => {
  nombre = '';
  termino = palabra;
  desde = 0;
  mostrarSpinner(d.querySelector('.productos'))
  const {productos, total} = await traerProductosPorNombre(termino,productosxPagina, desde);
  if(productos.length !== 0){
    paginasTotal = Math.ceil(total / productosxPagina);
    desde = (paginaActual - 1)*productosxPagina;
    dibujarHTMLProductos(productos, termino);
    imprimirPaginador(paginaActual, traerProductosPorNombre, termino, '.productos');
    location.hash = '#'+'main-section';
  }else{
    modalError('No existen productos con el término buscado. Volviendo a la página principal.');
    setTimeout(() => {
      window.location.replace(window.location.pathname);
    }, 3000);
  }
}

// Coloca todos los enlaces de categorias a la escucha.
export const agregarEnlacesACategorias = () => {
  const $itemCategorias = d.querySelectorAll('.item-categoria');
  productosxPagina = establecerProductosXPagina();
  $itemCategorias.forEach(item => {
    item.addEventListener('click', async() => {
      categoria = item.dataset.id;
      nombre = item.firstElementChild.textContent;
      mostrarSpinner(d.querySelector('.categorias-productos'));
      const {productos, total} = await traerProductosPorCategoria(categoria, productosxPagina, desde);
      paginasTotal = Math.ceil(total / productosxPagina);
      desde = (paginaActual-1)*productosxPagina;
      dibujarHTMLProductos(productos, nombre);
      imprimirPaginador(paginaActual, traerProductosPorCategoria, categoria, '.productos');
    })
  })
}

export const limpiarHTML = ($elemento) => {
  while($elemento.firstElementChild){
    $elemento.removeChild($elemento.firstElementChild);
  }
}

const imprimirPaginador = (paginaActual, fn, busqueda, elemento) => {
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
        dibujarHTMLProductos(productos, nombre || busqueda);
        imprimirPaginador(paginaActual, fn, busqueda, elemento);
      }
    }else{
      a.disabled = true;
    }
    fragment.appendChild(a);
  }
  $paginador.appendChild(fragment);
}

export const funcionMenu = ($menuBtn, $menu) => {
  $menuBtn.firstElementChild.classList.toggle('none');
  $menuBtn.lastElementChild.classList.toggle('none');
  $menu.classList.toggle('is-active');
}

export const palabraMayuscula = (string = '') => {
  const nombre = string.split(' ');
  nombre[0] = mayuscula(nombre[0]);
  return nombre.join(' ');
}

const mayuscula = (palabra) => {
  return palabra[0].toUpperCase()+palabra.slice(1);
}

export const mostrarSpinner = (elemento) => {
  limpiarHTML(elemento);
  elemento.innerHTML = `
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

const establecerProductosXPagina = () => {
  if(window.innerWidth > 0 && window.innerWidth < 768){
    return 6;
  }else if(window.innerWidth >= 768 && window.innerWidth <= 1024 ){
    return 9;
  }else if(window.innerWidth > 1024 ){
    return 8;
  }
}

export const modalError = (mensaje) => {
  Swal.fire({
    title: 'Error',
    text: mensaje,
    icon: 'error'
  })
}