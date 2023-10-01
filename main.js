// variable atracciones como un arreglo vacío
let atracciones = [];

// Función para mostrar un SweetAlert de éxito
const mostrarSweetAlertExito = () => {
    Swal.fire({
        title: 'Carga Exitosa',
        text: 'El archivo JSON se ha cargado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });
};

// Función para mostrar un SweetAlert de error
const mostrarSweetAlertError = (error) => {
    Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al cargar el archivo JSON: ' + error,
        icon: 'error',
        confirmButtonText: 'Aceptar'
    });
};


// Cargar el archivo JSON 
fetch("./productos.json")
    .then(response => response.json())
    .then(data => {
        //  datos JSON en la variable "atracciones"
        atracciones = data;

        // función para mostrar las atracciones en la página
        mostrarAtracciones();

        // Actualiza el carrito en la página
        actualizarCarrito();

        // Muestra un SweetAlert de éxito
        mostrarSweetAlertExito();
    })
    .catch(error => {
        console.error('Error al cargar el archivo JSON:', error);

        // Muestra un SweetAlert de error
        mostrarSweetAlertError(error);
    });

// 
class Producto {
    constructor(id, nombre, precio, img, alt, cantidad = 1) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
        this.img = img;
        this.alt = alt;
    }
    // ...
}
// Inicializar el carrito desde el almacenamiento local (localStorage)
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Función para agregar una atracción al carrito
const agregarAlCarrito = (atraccion) => {
    // Buscar si la atracción ya está en el carrito
    const index = carrito.findIndex((item) => item.id === atraccion.id);

    if (index !== -1) {
        // Si la atracción ya está en el carrito, aumentar la cantidad
        carrito[index].Cantidad++;
    } else {
        // Si no está en el carrito, agregarla con cantidad 1
        atraccion.Cantidad = 1;
        carrito.push(atraccion);
    }

    // Actualizar el almacenamiento local (localStorage)
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Actualizar la lista del carrito en la página
    actualizarCarrito();
};

// Función para quitar una atracción del carrito
const quitarDelCarrito = (index) => {
    carrito.splice(index, 1);

    // Actualizar el almacenamiento local (localStorage)
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Actualizar la lista del carrito en la página
    actualizarCarrito();
};

// Función para calcular el costo total del carrito
const calcularCostoTotal = () => {
    return carrito.reduce((total, atraccion) => total + atraccion.precio * atraccion.Cantidad, 0);
};

// Función para mostrar las atracciones en la página
const mostrarAtracciones = () => {
    const atraccionesContainer = document.querySelector(".col-md-6");
    atracciones.forEach((atraccion, index) => {
        const card = document.createElement("div");
        card.classList.add("card", "mb-3");
        card.innerHTML = `
            <img src="${atraccion.imagen}" class="card-img-top" alt="${atraccion.alt}">
            <div class="card-body">
                <h5 class="card-title">${atraccion.nombre}</h5>
                <p class="card-text">Precio: $${atraccion.precio.toFixed(2)}</p>
                <button class="btn btn-primary" onclick="agregarAlCarrito(atracciones[${index}])">Agregar al Carrito</button>
            </div>
        `;
        atraccionesContainer.appendChild(card);
    });
};

// Función para mostrar el carrito en la página
const actualizarCarrito = () => {
    const carritoList = document.getElementById("carrito");
    carritoList.innerHTML = "";

    carrito.forEach((atraccion, index) => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item";
        listItem.innerHTML = `
            <div class="d-flex justify-content-between">
                <span>${atraccion.nombre} - Precio: $${(atraccion.precio * atraccion.Cantidad).toFixed(2)}</span>
                <div class="input-group" style="width: 100px;">
                    <div class="input-group-prepend">
                        <button class="btn btn-secondary" type="button" onclick="restarCantidad(${index})">-</button>
                    </div>
                    <input type="text" class="form-control text-center" id="cantidad-${index}" value="${atraccion.Cantidad}" readonly>
                    <div class="input-group-append">
                        <button class="btn btn-secondary" type="button" onclick="sumarCantidad(${index})">+</button>
                    </div>
                </div>
                <button class="btn btn-danger btn-sm" onclick="quitarDelCarrito(${index})">Quitar</button>
            </div>
        `;
        carritoList.appendChild(listItem);
    });

    // Calcular y mostrar el costo total del carrito
    const totalElement = document.getElementById("total");
    const costoTotal = calcularCostoTotal();
    totalElement.textContent = costoTotal.toFixed(2);
};

// Función para sumar la cantidad de una atracción en el carrito
const sumarCantidad = (index) => {
    carrito[index].Cantidad++;
    actualizarCarrito();
};

// Función para restar la cantidad de una atracción en el carrito
const restarCantidad = (index) => {
    if (carrito[index].Cantidad > 1) {
        carrito[index].Cantidad--;
        actualizarCarrito();
    }
};

// Función para mostrar el formulario de forma de pago
const mostrarFormaPago = () => {
    const formaPagoForm = document.getElementById("formaPagoForm");
    formaPagoForm.style.display = "block";
};

// Función para ocultar el formulario de forma de pago
const ocultarFormaPago = () => {
    const formaPagoForm = document.getElementById("formaPagoForm");
    formaPagoForm.style.display = "none";
};

// Función para realizar la compra
const realizarCompra = () => {
    // Mostrar el formulario de forma de pago
    mostrarFormaPago();
};



const mostrarFormaPagoBtn = document.getElementById("mostrarFormaPagoBtn");
mostrarFormaPagoBtn.addEventListener("click", mostrarFormaPago);


// Manejar el evento de envío del formulario
const formPagoForm = document.getElementById("formPagoForm");
formPagoForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe
    const formaPago = document.querySelector('input[name="formaPago"]:checked').value;
    const costoTotal = calcularCostoTotal();
    const descuento = formaPago === "1" ? costoTotal * 0.2 : formaPago === "2" ? costoTotal * 0.1 : 0;
    const montoFinal = costoTotal - descuento;

    // Mostrar el resultado en HTML
    const resumenCompra = document.getElementById("resumenCompra");
    resumenCompra.innerHTML = `
        <p>Costo total: $${costoTotal.toFixed(2)}</p>
        <p>Descuento: $${descuento.toFixed(2)}</p>
        <p>Monto final a pagar: $${montoFinal.toFixed(2)}</p>
        <p>¡Compra exitosa!</p>
    `;

    // Ocultar el formulario de forma de pago
    ocultarFormaPago();

    // Limpiar el carrito después de la compra
    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Actualizar el carrito en la página
    actualizarCarrito();
});
// Ejecutar la función para mostrar las atracciones en la página
mostrarAtracciones();
// Actualizar el carrito en la página
actualizarCarrito();

