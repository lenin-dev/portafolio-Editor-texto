'use stric'

window.addEventListener("load", function() {
    httpPost("./php/metodos.php", "n="+1);

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// METODO POST
function httpPost(url, params) {
    var http = new XMLHttpRequest();

    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send(params);

    http.onreadystatechange = function() {
        if(this.status == 200 && this.readyState == 4) {
            var respuesta = JSON.parse(this.responseText);

            if(respuesta.estado == 'archivos') {
                cargarArchivos(respuesta.datos);

            } else if(respuesta.estado == 'crear_doc') {
                mostrarArchActualizados(entrada = "mostrar");

            } else if(respuesta.estado == 'contenidoGuardado') {
                alert("Contenido guardado");
                limpiar();
                // mostrarArchActualizados(entrada = "mostrar");
            } else {
                alert(respuesta.datos.error);
            }
        }
    }
}

// METODO GET
function httpGet(url) {
    var http = new XMLHttpRequest();

    http.open("GET", url, true);
    http.send();

    http.onreadystatechange = function() {
        if(this.status == 200 && this.readyState == 4) {
            var respuesta = JSON.parse(this.responseText);

            if(respuesta.estado == 'info') {
                cargarTexto(respuesta.datos.respuesta, respuesta.datos.nombre);
            }
        }
    }
}

// METODO DELETE
function httpDelete(url) {
    var http = new XMLHttpRequest();

    http.open("GET", url, true);
    http.send();

    http.onreadystatechange = function() {
        if(this.status == 200 && this.readyState == 4) {
            var respuesta = JSON.parse(this.responseText);

            if(respuesta.estado == 'eliminarArch') {
                mostrarArchActualizados(entrada = "mostrar");
                limpiar();
            }
            
        }
    }
}

// METODO PUT
function httpPut(url) {
    var http = new XMLHttpRequest();

    http.open("GET", url, true);
    // http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.send();

    http.onreadystatechange = function() {
        if(this.status == 200 && this.readyState == 4) {
            var respuesta = JSON.parse(this.responseText);

            if(respuesta.estado == 'actualizado') {
                mostrarArchActualizados(entrada = "mostrar");
                limpiar();
            }
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

// CARGAR NOMBRES DE LOS ARCHIVOS
function cargarArchivos(respuesta) {
    // console.log(respuesta);

    var ul = document.getElementById('cont-ul');
    ul.replaceChildren();

    for(var i = 0; i < respuesta.length; i++) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        var texto = document.createTextNode(respuesta[i]);
        a.setAttribute("href", "#");
        a.setAttribute("onclick", "httpGet('./php/metodos.php?archivo="+respuesta[i]+"')");

        a.appendChild(texto)
        li.appendChild(a)
        ul.appendChild(li);
    }
}

// CARGAR TEXTO DEL ARCHIVO
function cargarTexto(info, archivo) {
    var textarea = document.getElementById('txtEditor');
    var nomDoc  = document.getElementById('nomDoc');

    textarea.value = info;
    nomDoc.value = archivo;
    textarea.innerHTML = info;
    nomDoc.innerHTML = archivo;
}

// LIMPIAR TEXTO
document.getElementById('btnLimpiar').addEventListener("click", function() { limpiar() });
function limpiar() {
    var textarea = document.getElementById('txtEditor');
    var nomDoc  = document.getElementById('nomDoc');
    var txtNomArchivo  = document.getElementById('txtNomArchivo');
    var txtCambiarNom  = document.getElementById('txtCambiarNom');

    txtCambiarNom.value = "";
    txtNomArchivo.value = "";

    nomDoc.value = "";
    nomDoc.innerHTML = "";
    textarea.value = "";
    textarea.innerHTML = "";
}

// CREAR ARCHIVO
let envio = document.getElementById("btnCrear")
let nombre = document.getElementById("txtNomArchivo")

function check(e) {
    tecla = (document.all) ? e.keyCode : e.which;

    //Tecla de retroceso para borrar, siempre la permite
    if (tecla == 8) {
        return true;
    }

    // Patrón de entrada, en este caso solo acepta numeros y letras
    patron = /[A-Za-z0-9 ]/;
    tecla_final = String.fromCharCode(tecla);
    return patron.test(tecla_final);
}

envio.addEventListener("click", (event) => {
    event.preventDefault();

    if (nombre.value.trim() == "") {
        alert("Debe ingresar un nombre para crear el archivo.")

    } else {
        var nom = nombre.value.replace(/ /g, "_");
        httpPost("./php/metodos.php", "nombrearchivo="+nom);
        nombre.value = "";
    }
});

function mostrarArchActualizados(entrada) {

    if(entrada == "mostrar") {
        httpPost("./php/metodos.php", "n="+1);
    }
}

// ELIMINAR ARCHIVO
document.getElementById('btnEliminar').addEventListener("click", function() {
    eliminarArchivo();
})
function eliminarArchivo() {

    if(document.getElementById('nomDoc').innerHTML != "") {
        httpDelete("./php/metodos.php?eliminar="+document.getElementById('nomDoc').innerHTML);
        // alert(document.getElementById('nomDoc').innerHTML);
    } else {
        alert("Seleccione un archivo para eliminar");
    }
}

// ACTUALIZAR NOMBRE DEL ARCHIVO
document.getElementById('btnCambiar').addEventListener("click", function() {
    actualizarArchivo();
});
function actualizarArchivo() {
    var campo = document.getElementById('txtCambiarNom');

    if(campo.value.trim() == "") {
        alert("Llene el campo para actualizar el nombre");
    } else {
        var nom = campo.value.replace(/ /g, "_");
        httpPut("./php/metodos.php?archivoAct="+document.getElementById('nomDoc').innerHTML+"&actualizar="+nom);
    }
}

// GUARDAR CONTENIDO DEL ARCHIVO
document.getElementById('btnGuardar').addEventListener("click", function() {
    guardarContenido();
});
function guardarContenido() {
    var cont = document.getElementById('txtEditor');
    var nomDoc = document.getElementById('nomDoc');

    if(nomDoc.innerHTML == "") {
        alert("Seleccione un archivo.");
    } else if(cont.value.trim() == "") {
        alert("Agregue un contenido.");
    } else {
        httpPost("./php/metodos.php", "id="+2+"&contenido="+cont.value+"&nomArchivo="+nomDoc.innerHTML);
    }
}