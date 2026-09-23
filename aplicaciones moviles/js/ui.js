import { esProductoFavorito } from "./storage.js";


function crearTarjetaProductoHTML(producto, esFavorito) {

    const {
        id,
        title,
        price,
        category,
        thumbnail,
        stock
    } = producto;

    return `
        <article class="tarjeta-producto" data-id="${id}">

            <div class="tarjeta-img-wrap">

                <img
                    src="${thumbnail}"
                    alt="${title}"
                    loading="lazy"
                    class="tarjeta-img"
                >

                <span class="badge-categoria">
                    ${category}
                </span>

                <button
                    class="btn-fav-card ${esFavorito ? "en-favoritos" : ""}"
                    data-id="${id}"
                    aria-label="Guardar favorito"
                >
                    ${esFavorito ? "⭐" : "☆"}
                </button>

            </div>

            <div class="tarjeta-cuerpo">

                <h3 class="tarjeta-titulo">
                    ${title}
                </h3>

                <div class="tarjeta-precio-wrap">

                    <span class="tarjeta-precio">
                        $${price.toFixed(2)}
                    </span>

                    <span class="tarjeta-stock">
                        Stock: ${stock}
                    </span>

                </div>

            </div>

        </article>
    `;
}


function filtrarProductos(
    lista,
    textoBusqueda,
    categoria,
    favoritosIds = []
) {

    const texto = textoBusqueda
        .toLowerCase()
        .trim();

    return lista.filter(producto => {

        const coincideTexto =
            producto.title
                .toLowerCase()
                .includes(texto);

        let coincideCategoria = true;

        if (categoria === "favoritos") {

            coincideCategoria =
                favoritosIds.includes(producto.id);

        } else if (categoria !== "todas") {

            coincideCategoria =
                producto.category === categoria;
        }

        return coincideTexto && coincideCategoria;
    });
}


function calcularTotalCatalogo(lista) {

    return lista.reduce(
        (total, producto) => total + producto.price,
        0
    );
}


export {
    crearTarjetaProductoHTML,
    filtrarProductos,
    calcularTotalCatalogo
};