import { descargarProductosTech } from "./api.js";
import {
    obtenerFavoritos,
    alternarFavorito
} from "./storage.js";
import {
    crearTarjetaProductoHTML,
    filtrarProductos,
    calcularTotalCatalogo
} from "./ui.js";


// ==========================================================
// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// ==========================================================

const btnTema = document.querySelector("#btn-tema");
const iconoTema = document.querySelector("#icono-tema");

const btnVerFavoritos = document.querySelector("#btn-ver-favoritos");
const badgeFavoritos = document.querySelector("#badge-favoritos-contador");

const inputBuscador = document.querySelector("#input-buscador");
const botonesFiltro = document.querySelectorAll(".btn-filtro");

const contenedorCatalogo = document.querySelector("#contenedor-catalogo");

const totalProductosSpan = document.querySelector("#total-productos-visibles");
const totalPrecioSpan = document.querySelector("#total-precio-acumulado");

const estadoLoading = document.querySelector("#estado-loading");
const estadoError = document.querySelector("#estado-error");
const btnReintentar = document.querySelector("#btn-reintentar");
const sinResultadosBox = document.querySelector("#sin-resultados");


// ==========================================================
// 2. ESTADO GLOBAL
// ==========================================================

let productosEnMemoria = [
        samsung,
    lenovo,
    cargadorusbc,
    spiner
];
let categoriaActual = "todas"; //indica que filtro está seleccionado.


// ==========================================================
// 3. ACTUALIZAR CONTADOR DE FAVORITOS
// ==========================================================

function actualizarBadgeFavoritos() {

    const favoritos = obtenerFavoritos(); //obtiene los favoritos

    badgeFavoritos.textContent = favoritos.length; //pone  en el contador del encabezado.
}


// ==========================================================
// 4. APLICAR FILTROS
// ==========================================================

function aplicarFiltros() {

    const texto = inputBuscador.value.trim(); //primero obtenemos lo escrito en el buscador

    const favoritosIds = obtenerFavoritos();//dsp los favoritos

    const productosFiltrados = filtrarProductos(  //aca Le estoy diciendo a ui.js Toma todos mis productos y devolveme solamente los que coincidan con lo que estoy buscando
        productosEnMemoria,
        texto,
        categoriaActual,
        favoritosIds
    );

    totalProductosSpan.textContent = productosFiltrados.length;

    const totalPrecio = calcularTotalCatalogo(productosFiltrados);

    totalPrecioSpan.textContent = `$${totalPrecio.toFixed(2)}`;


    if (productosFiltrados.length === 0) {

        contenedorCatalogo.innerHTML = "";

        sinResultadosBox.classList.remove("oculto");

    } else {

        sinResultadosBox.classList.add("oculto");

        contenedorCatalogo.innerHTML = productosFiltrados
            .map(producto => {

                const esFavorito = favoritosIds.includes(producto.id);

                return crearTarjetaProductoHTML(
                    producto,
                    esFavorito
                );

            })
            .join("");
    }
}


// ==========================================================
// 5. ACTIVAR FILTRO DE CATEGORIA
// ==========================================================

function activarFiltroCategoria(categoria) {

    categoriaActual = categoria;

    botonesFiltro.forEach(boton => {

        const categoriaBoton = boton.dataset.categoria;

        if (categoriaBoton === categoria) {

            boton.classList.add("activo");

        } else {

            boton.classList.remove("activo");
        }
    });

    aplicarFiltros();
}


// ==========================================================
// 6. CARGAR CATALOGO DESDE LA API
// ==========================================================

async function cargarCatalogo() {

    estadoLoading.classList.remove("oculto");

    estadoError.classList.add("oculto");

    contenedorCatalogo.innerHTML = "";

    try {

        productosEnMemoria = await descargarProductosTech();

        estadoLoading.classList.add("oculto");

        aplicarFiltros();

    } catch (error) {

        console.error("Error al cargar el catálogo:", error);

        estadoLoading.classList.add("oculto");

        estadoError.classList.remove("oculto");
    }
}


// ==========================================================
// 7. MODO OSCURO
// ==========================================================

btnTema.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        iconoTema.textContent = "☀️";

    } else {

        iconoTema.textContent = "🌙";
    }
});


// ==========================================================
// 8. BOTON DE FAVORITOS
// ==========================================================

btnVerFavoritos.addEventListener("click", () => {

    activarFiltroCategoria("favoritos");
});


// ==========================================================
// 9. BOTONES DE CATEGORIA
// ==========================================================

botonesFiltro.forEach(boton => {

    boton.addEventListener("click", () => {

        const categoria = boton.dataset.categoria;

        activarFiltroCategoria(categoria);
    });
});


// ==========================================================
// 10. BUSQUEDA EN TIEMPO REAL
// ==========================================================

inputBuscador.addEventListener("input", () => {

    aplicarFiltros();
});


// ==========================================================
// 11. BOTON DE REINTENTO
// ==========================================================

btnReintentar.addEventListener("click", () => {

    cargarCatalogo();
});


// ==========================================================
// 12. DELEGACION DE EVENTOS PARA FAVORITOS
// ==========================================================

contenedorCatalogo.addEventListener("click", evento => {

    const botonFavorito = evento.target.closest(".btn-fav-card");

    if (!botonFavorito) {

        return;
    }

    const id = Number(botonFavorito.dataset.id);

    alternarFavorito(id);

    actualizarBadgeFavoritos();

    aplicarFiltros();
});


// ==========================================================
// 13. INICIALIZACION
// ==========================================================

actualizarBadgeFavoritos();

cargarCatalogo();