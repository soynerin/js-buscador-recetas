function initApp() {

    const selectCategorias = document.getElementById('categorias');
    selectCategorias.addEventListener('change', seleccionarCategoriaReceta);

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

    function seleccionarCategoriaReceta(e) {
        e.preventDefault();
        const categoria = e.target.value;
        obtenerRecetasPorCategoria(categoria);
    }

    function obtenerRecetasPorCategoria(categoria) {
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`)
            .then(respuesta => respuesta.json())
            .then(resultado => mostrarRecetasPorCategoria(resultado.meals));
    }

    function mostrarRecetasPorCategoria(recetas = []) {
        recetas.forEach(receta => {
            const { idMeal, strMeal, strMealThumb } = receta;
            const div = document.createElement('div');
            div.classList.add('col-md-4');
            div.innerHTML = `
                <div class="card mb-4">
                    <img src="${strMealThumb}" alt="${strMeal}" class="card-img-top">
                    <div class="card-body">
                        <h3 class="card-title text-center mb-3">${strMeal}</h3>
                        <a href="#" class="btn btn-primary w-100" data-id="${idMeal}">Ver Receta</a>
                    </div>
                </div>
            `;
            document.querySelector('#recetas').appendChild(div);
        });
    }
}

document.addEventListener('DOMContentLoaded', initApp, false);