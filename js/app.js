function initApp() {

    selectCategorias = document.getElementById('categorias');

    obtenerCategoriasRecetas();

    function obtenerCategoriasRecetas() {
        fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
            .then(respuesta => respuesta.json())
            .then(resultado => mostrarCategoriasRecetas(resultado.categories));
    }

    function mostrarCategoriasRecetas(categorias = []) {

        categorias.forEach(categoria => {
            const { strCategory } = categoria;
            const option = document.createElement('option');
            option.value = strCategory;
            option.textContent = strCategory;
            selectCategorias.appendChild(option);
        });
    }
}

document.addEventListener('DOMContentLoaded', initApp, false);