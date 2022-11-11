function initApp() {

    const modal = new bootstrap.Modal(document.getElementById('modal'));
    const selectCategorias = document.getElementById('categorias');
    const resultadoRecetas = document.querySelector('#recetas');
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

        limpiarHtml(resultadoRecetas);
        obtenerRecetasPorCategoria(categoria);
    }

    function obtenerRecetasPorCategoria(categoria) {
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`)
            .then(respuesta => respuesta.json())
            .then(resultado => mostrarRecetasPorCategoria(resultado.meals));
    }

    function mostrarRecetasPorCategoria(recetas = []) {

        const heading = document.createElement('h2');
        heading.classList.add('text-center', 'my-5', 'text-uppercase');
        heading.textContent = recetas.length > 0 ? 'Recetas' : 'No hay recetas para mostrar';
        resultadoRecetas.appendChild(heading);

        recetas.forEach(receta => {
            const { idMeal, strMeal, strMealThumb } = receta;
            const div = document.createElement('div');
            div.classList.add('col-md-4');
            div.innerHTML = `
                <div class="card mb-4">
                    <img src="${strMealThumb}" alt="${strMeal}" class="card-img-top">
                    <div class="card-body">
                        <h3 class="card-title text-center mb-3">${strMeal}</h3>
                        <a href="#" class="btn btn-primary w-100" data-id="${idMeal}" id="buttonVerReceta">Ver Receta</a>
                    </div>
                </div>
            `;

            const buttonVerReceta = div.querySelector('#buttonVerReceta');
            buttonVerReceta.onclick = obtenerRecetaPorId;

            document.querySelector('#recetas').appendChild(div);
        });
    }

    function limpiarHtml(selector) {
        while (selector.firstChild) {
            selector.removeChild(selector.firstChild);
        }
    }

    function obtenerRecetaPorId(e) {
        e.preventDefault();
        const id = e.target.dataset.id;
        obtenerReceta(id);
    }

    function obtenerReceta(id) {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
            .then(respuesta => respuesta.json())
            .then(resultado => mostrarReceta(resultado.meals[0]));
    }

    function mostrarReceta(receta) {
        const { strMeal, strInstructions, strMealThumb } = receta;
        modalTitle = document.querySelector('.modal .modal-title');
        modalBody = document.querySelector('.modal .modal-body');

        modalTitle.textContent = strMeal;
        modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-12">
                    <img src="${strMealThumb}" alt="${strMeal}" class="img-fluid">
                </div>
                <div class="col-md-12">
                    <h3 class="text-center text-uppercase my-3">Instructions</h3>
                    <p>${strInstructions}</p>
                </div>
                <div class="col-md-12">
                    <h3 class="text-center text-uppercase my-3">Ingredients</h3>
                    <ul class="list-group">
                        ${mostrarIngredientes(receta)}
                    </ul>
                </div>
            </div>
        `;
        
        const modalFooter = document.querySelector('.modal .modal-footer');
        limpiarHtml(modalFooter);
        modalFooter.innerHTML = `
            <button type="button" class="btn btn-secondary col" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary col" id="buttonGuardarReceta"><i class="fa-regular fa-star"></i> Agregar a Favoritos</button>
        `;

        if(existeStorage(receta.idMeal)){
            modalFooter.querySelector('#buttonGuardarReceta').innerHTML = `<i class="fa-solid fa-star"></i> Eliminar Favorito`;            
        } else {
            modalFooter.querySelector('#buttonGuardarReceta').innerHTML = `<i class="fa-regular fa-star"></i> Agregar a Favoritos`;
        }

        const buttonGuardarReceta = document.querySelector('#buttonGuardarReceta');
        buttonGuardarReceta.onclick = () => {
            if(!existeStorage(receta.idMeal)){
                guardarReceta({
                    id: receta.idMeal,
                    nombre: receta.strMeal,
                    imagen: receta.strMealThumb
                });

                modalFooter.querySelector('#buttonGuardarReceta').innerHTML = `<i class="fa-solid fa-star"></i> Eliminar Favorito`;
                mostrarToast('Receta agregada correctamente');
                return;
            }       
            
            eliminarReceta(receta.idMeal);
            modalFooter.querySelector('#buttonGuardarReceta').innerHTML = `<i class="fa-regular fa-star"></i> Agregar a Favoritos`;
            mostrarToast('Receta eliminada correctamente');
        }

        function mostrarToast(mensaje){
            const toast = document.querySelector('#toast');
            const toastBody = document.querySelector('#toast .toast-body');
            toastBody.textContent = mensaje;
            const toastEl = new bootstrap.Toast(toast);
            toastEl.show();
        }

        function mostrarIngredientes(receta) {
            let ingredientes = [];
            for(let i = 1; i <= 20; i++) {
                if(receta[`strIngredient${i}`]) {
                    ingredientes.push(receta[`strIngredient${i}`]);
                }
            }
    
            return ingredientes.map(ingrediente => `<li class="list-group-item">${ingrediente}</li>`).join(''); 
        }

        function guardarReceta(receta) {
            const recetasGuardadas = JSON.parse(localStorage.getItem('recetas')) ?? [];
            localStorage.setItem('recetas', JSON.stringify([...recetasGuardadas, receta]));
        }

        function eliminarReceta(id) {
            const recetasGuardadas = JSON.parse(localStorage.getItem('recetas')) ?? [];
            localStorage.setItem('recetas', JSON.stringify(recetasGuardadas.filter(receta => receta.id !== id)));            
        }

        function existeStorage(id) {
            const recetasGuardadas = JSON.parse(localStorage.getItem('recetas')) ?? [];
            return recetasGuardadas.some(receta => receta.id === id);
        }

        modal.show();
    }
}

document.addEventListener('DOMContentLoaded', initApp, false);