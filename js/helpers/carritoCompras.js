import { insertarNuevo } from '../renderizado/templates.js';
let carritoCompras = [];
const ls = localStorage;
const totalCompra = document.querySelector('.total-compra');

export const agregarAlCarrito = (elemento) => {
  const id = elemento.dataset.id;
  const h5 = elemento.querySelector('h5');
  const img = elemento.querySelector('img');
  const precio = elemento.querySelector('.item-producto-precio > span');
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

export const borrarProducto = (articulo) => {
  carritoCompras = carritoCompras.filter(item => item.id !== articulo);
  actualizarTotal(carritoCompras);
  ls.setItem('carrito', JSON.stringify(carritoCompras));
}

export const establecerCarrito = carrito => {
  carrito.forEach(item => {
    carritoCompras.push(item);
    insertarNuevo(item);
  })
  actualizarTotal(carritoCompras);
}

const actualizarTotal = (carritoCompras = []) => {
  const total = carritoCompras.reduce((a, b) => a + Number(b.total), 0)
  totalCompra.textContent = `$${total}`;
}

export const sumarProducto = (elemento) => {
  const producto = carritoCompras.find(item => item.id === elemento);
  producto.cantidad++;
  producto.total = producto.cantidad*producto.precio.slice(1);
  actualizarTotal(carritoCompras);
  ls.setItem('carrito', JSON.stringify(carritoCompras));
}

export const restarProducto = (elemento) => {
  const producto = carritoCompras.find(item => item.id === elemento);
  if(producto.cantidad > 0){
    producto.cantidad--;
    producto.total = producto.cantidad*producto.precio.slice(1);
    actualizarTotal(carritoCompras);
    ls.setItem('carrito', JSON.stringify(carritoCompras));
  }
}
