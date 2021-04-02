import { agregarAlCarrito, borrarProducto, restarProducto, sumarProducto } from "../helpers/carritoCompras.js";
import { limpiarHTML, palabraMayuscula } from "../helpers/utilidades.js";
import { d } from "../variables.js";
const $tabla = d.querySelector('.tabla-productos-compras > tbody');

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

export const dibujarHTMLProductos = (datos = {}, categoria) => {
  const fragment = d.createDocumentFragment();
  const $sectionProductos = d.querySelector('.productos');
  const $sectionCategorias = d.querySelector('.categorias-productos');
  limpiarHTML($sectionCategorias);
  limpiarHTML($sectionProductos);

  const h5 = d.createElement('h5');
  h5.textContent = categoria;
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
    agregarClasesAElementos(divItem, 'item-producto-precio', 'flex');
    agregarClasesAElementos(i, 'fas', 'fa-shopping-cart')
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

const dibujarCarritoCompras = (carrito) => {
  const { repetido, nuevo } = carrito;
  (nuevo) ? insertarNuevo(nuevo) : modificarCantidad(repetido);
  Swal.fire(
    'Producto agregado!',
    (repetido) ? repetido.nombre : nuevo.nombre,
    'success'
  )
}

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
  agregarClasesAElementos(iMas, 'fas', 'fa-plus');
  agregarClasesAElementos(iMenos, 'fas', 'fa-minus');
  agregarClasesAElementos(iBorrar, 'fas', 'fa-times-circle');

  buttonMas.addEventListener('click', () => {
    sumarProducto(elemento.id);
    modificarCantidad({id: elemento.id, cantidad: elemento.cantidad})
  })
  buttonMenos.addEventListener('click', () => {
    restarProducto(elemento.id);
    modificarCantidad({id: elemento.id, cantidad: elemento.cantidad})
  })
  buttonBorrar.addEventListener('click', () => {
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

const modificarCantidad = (elemento) => {
  const items = Array.from($tabla.querySelectorAll('.item-producto-carrito-compras'));
  items.shift();
  items.forEach(item => {
    if(item.firstElementChild.value === elemento.id){
      item.querySelector('td:nth-of-type(5)').textContent = elemento.cantidad;
    }
  })
}

const agregarHijosAPadres = (padre, ...hijos) => {
  hijos.forEach(hijo => padre.appendChild(hijo));
}

const crearElementosEnMasa = (tipo, cantidad) => {
  const arr = [];
  for(let i = 0; i<=cantidad; i++){
    arr.push(d.createElement(tipo));
  }
  return arr;
}

const agregarClasesAElementos = (elemento, ...clases) => {
  clases.forEach(clase => elemento.classList.add(clase));
}

const atributosImagen = (imagen, src, alt) => {
  imagen.src = src;
  imagen.alt = alt;
}