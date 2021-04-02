import { cargarCategorias } from "./funciones/categorias.js";
import { dibujarHTMLCategorias } from "./renderizado/templates.js";
import { agregarEnlacesACategorias, funcionMenu, productosPorNombre, mostrarSpinner, modalError } from "./helpers/utilidades.js";
import { establecerCarrito } from "./helpers/carritoCompras.js";
import { $btnCarrito, $btnCerrar, $btnHome, $btnSearch, $inputSearch, $menu, $menuBtn, $ventanaCarrito, d, main } from "./variables.js";

d.addEventListener('DOMContentLoaded', async () => {
  mostrarSpinner(d.querySelector('.categorias-productos'))
  const categorias = await cargarCategorias();
  dibujarHTMLCategorias(categorias);
  agregarEnlacesACategorias();
  if(localStorage.getItem('carrito')){
    const carrito = JSON.parse(localStorage.getItem('carrito'));
    establecerCarrito(carrito);
  }
});
$btnCarrito.addEventListener('click', () => {
  $ventanaCarrito.classList.toggle('is-active');
  main.style.display = (window.innerWidth < 768) ? 'none' : 'block';
})
$menuBtn.addEventListener('click', () => {
  funcionMenu($menuBtn, $menu);
})

$btnSearch.addEventListener('click', (e) => {
  e.preventDefault();
  if($inputSearch.value !== ''){
    const regex = new RegExp('[^a-zA-Z0-9]', 'i');
    const termino = $inputSearch.value.trim();
    const error = termino.match(regex);
    if(!error || error[0] === ' '){
      const busqueda = termino;
      $inputSearch.value = '';
      if(busqueda.length < 4){
        modalError('El término de búsqueda debe ser mayor a 4 letras y no debe contener carácteres especiales');
        return;
      }
      productosPorNombre(busqueda);
      funcionMenu($menuBtn, $menu);
    }else{
      modalError('La búsqueda no puede contener carácteres especiales.');
      return;
    }
  }
})

$btnHome.addEventListener('click', () => {
  window.location.replace(window.location.pathname);
})

$btnCerrar.addEventListener('click', () => {
  $ventanaCarrito.classList.remove('is-active');
  main.style.display = 'block';
})