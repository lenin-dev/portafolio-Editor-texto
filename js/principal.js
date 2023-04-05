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

    http.open("DELETE", url, true);
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

    nomDoc.innerHTML = archivo;
    textarea.innerHTML = info;
}

// LIMPIAR TEXTO
document.getElementById('btnLimpiar').addEventListener("click", function() { limpiar() });
function limpiar() {
    var textarea = document.getElementById('txtEditor');
    var nomDoc  = document.getElementById('nomDoc');

    nomDoc.innerHTML = "";
    textarea.innerHTML = "";
}

// CREAR ARCHIVO
let envio = document.getElementById("btnCrear")
let nombre = document.getElementById("txtNomArchivo")
envio.addEventListener("click", (event) => {
    event.preventDefault()
    if (nombre.value.trim() === "") {
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