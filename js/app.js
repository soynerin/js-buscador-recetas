function initApp() {
    obtenerCategoriasRecetas();

    function obtenerCategoriasRecetas() {
        fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
            .then(respuesta => respuesta.json())
            .then(resultado => console.log(resultado));
    }
}

document.addEventListener('DOMContentLoaded', initApp, false);