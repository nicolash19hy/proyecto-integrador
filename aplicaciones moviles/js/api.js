async function descargarProductosTech() {

    const urls = [
        "https://dummyjson.com/products/category/smartphones",
        "https://dummyjson.com/products/category/laptops",
        "https://dummyjson.com/products/category/mobile-accessories"
    ];

    const respuestas = await Promise.all(
        urls.map(url => fetch(url))
    );

    respuestas.forEach(respuesta => {

        if (!respuesta.ok) {

            throw new Error(
                `Error HTTP: ${respuesta.status}`
            );
        }
    });

    const datos = await Promise.all(
        respuestas.map(respuesta => respuesta.json())
    );

    const productos = datos.flatMap(
        datosCategoria => datosCategoria.products
    );

    return productos;
}

export {
    descargarProductosTech
};