const FAVORITOS_KEY = "techstore_favoritos_v1";


function obtenerFavoritos() {

    const favoritosGuardados =
        localStorage.getItem(FAVORITOS_KEY);

    if (!favoritosGuardados) {

        return [];
    }

    try {

        return JSON.parse(favoritosGuardados);

    } catch (error) {

        console.error(
            "Error al leer los favoritos:",
            error
        );

        return [];
    }
}


function esProductoFavorito(id) {

    const favoritos = obtenerFavoritos();

    return favoritos.includes(id);
}


function alternarFavorito(id) {

    const favoritos = obtenerFavoritos();

    const posicion = favoritos.indexOf(id);

    if (posicion !== -1) {

        favoritos.splice(posicion, 1);

    } else {

        favoritos.push(id);
    }

    localStorage.setItem(
        FAVORITOS_KEY,
        JSON.stringify(favoritos)
    );
}


export {
    obtenerFavoritos,
    esProductoFavorito,
    alternarFavorito
};