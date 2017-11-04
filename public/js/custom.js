'use strict';

//Valores globales

//Filtro total
let filtro = {};

//Valores del slider de precios
var values = ['Desde 10€', 'De 10€ a 50€', 'Hasta 50€', 'Más de 50€'];


//Filtros del buscador de la página

//Filtro para el nombre
$('#name').on('keyup', function(){
    
    let valor = this.value;
    //Filtramos si el nombre es más largo de 3 caracteres
    if(valor.length > 3){
        filtro.nombre = valor;
    }else if(valor.length === 0){
        filtro.nombre = null;
    }
    llamadaAjax();
});


//Filtro por categoría de venta / búsqueda
$('#modalidad').change(function() {
    let valor;

    if($('#modalidad').val() == 'V'){
        valor = true;
    }else if($('#modalidad').val() == 'B'){
        valor= false;
    }else{
        valor = null;
    }
    filtro.venta = valor;
    llamadaAjax();
});

//Filtro por tags
$('.checko').click(function(){
    var val = [];
    $(':checkbox:checked').each(function(i){
      val[i] = $(this).val();
    });
    filtro.tags = val;
    llamadaAjax();
});


//Filtro por precio
$('#slider1').change(function() {
    $('#mensajeSlider').text(values[this.value]);
    let valor = '50';
    switch(this.value) {
        case '0':
            valor = '10-';
            break;
        case '1':
            valor = '10-50';
            break;
        case '2':
            valor = '-50';
            break;
        case '3':
            valor = '+50';
            break;            
        default:
            valor = '10-';
    }

    filtro.precio = valor;
    llamadaAjax();
});

//FILTROS DE ORDENACIÓN y PAGINACIÓN
//Filtro de ordenación
$('#orden').change(function() {

    let valor;

    if($('#orden').val() !== ''){
        valor = $('#orden').val();
    }
    filtro.sorter = valor;
    llamadaAjax();
});

//Límite de resultados
$('#limite').change(function() {

    let valor;

    if($('#limite').val() !== ''){
        valor = $('#limite').val();
    }
    filtro.limite = valor;
    llamadaAjax();
});

//MÉTODOS AUXILIARES
//Llamada genérica a Ajax con el filtro global
function llamadaAjax(){
    $.ajax({
        url : '/api/busqueda',
        data : filtro,
        type : 'GET',
        // el tipo de información que se espera de respuesta
        dataType : 'json', 
        // código a ejecutar si la petición es satisfactoria;
        success : function(data) {
            let resultadoHTML ='';
            $.each(data, function(index, elemento) {
                resultadoHTML += pintarElemento(elemento);
            });
            //Comprobamos que se arroja al menos un resultado
            if(resultadoHTML === ''){
                resultadoHTML = pintarCapaVacía();
            }
            $('#listadoAnuncios').html(resultadoHTML);
        },     
        // código a ejecutar si la petición falla;
        error : function() {
            console.log('Disculpe, existió un problema');
        }
    });
}


//Método que se llama para pintar una capa vacía cuando no hay resultados al aplicar el filtro
function pintarCapaVacía(){
        return `<div class="col-md-1">&nbsp;</div><div class="col-md-11">No se han encontrado resultados para su búsqueda</div>`;
}


//Método para pintar el html de un elemento Anuncio
function pintarElemento(anuncio){

    let html = `<div class="col-lg-4 col-md-6 mb-4">
    <div class="card h-100">`;
        if(anuncio.venta){
            html+=`<div class="card card-header venta">VENDO</div>`;
        }else{
            html+=`<div class="card card-header busqueda">BUSCO</div>`;
        }
        html+=`<a href="#"><img class="card-img-top" src='${anuncio.foto}' ></a>
        <div class="card-body">
         <h4 class="card-title">
                <a href="#">${anuncio.nombre}</a>
            </h4>
            <h5>${anuncio.precio}€</h5>
            <p class="card-text">${anuncio.descripcion}</p>
        </div>
        <div class="card-footer">`;
        
        for (var i = 0; i < anuncio.tags.length; i++) {
            html+=`&nbsp;<span class="label label-primary">${anuncio.tags[i]}</span>`;
        }
            
    html+=`</div>
       </div>
    </div>`;
    return html;
}