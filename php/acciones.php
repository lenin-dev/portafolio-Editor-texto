<?php

    function cargarArchivos() {
        $datos = array();
        $i = 0;
        if($gestor = opendir('../archivos')) {
            while(false !== ($archivo = readdir($gestor))) {
                if($archivo != '.' && $archivo != '..') {
                    $datos[$i++] = $archivo;
                }
            }
        }
        return json_encode($datos);
    }

    function getArchivo($datos) {
        $estado = array();
        $final = "";
        $abrirFichero = fopen('../archivos/'.$datos, 'a+');
        while(!feof($abrirFichero)) {
            $contenido = fgets($abrirFichero);
            $final.=$contenido;
        }
        $estado['nombre'] = $datos;
        $estado['respuesta'] = $final;
        fclose($abrirFichero);
        return json_encode($estado);
    }

    function crearArchivo($nomArchivo) {
        if($crearArchivo = fopen('../archivos/'.$nomArchivo.'.txt', 'a')) {
            fclose($crearArchivo);
            return true;
        } else {
            fwrite($crearArchivo, "");
            fclose($crearArchivo);
            return false;
        }
    }

    function eliminarArchivo($archivo) {
        if(file_exists('../archivos/'.$archivo)) {
            unlink('../archivos/'.$archivo);
            return true;
        } else {
            return false;
        }
    }

    function actualizarArchivo($nomArchivo, $nomActualizado) {

        if(file_exists("../archivos/".$nomArchivo)) {
            rename("../archivos/".$nomArchivo, "../archivos/".$nomActualizado.'.txt');
            return true;
        } else {
            return false;
        }
    }

    function guardarContenido($contenido, $archivo) {
        
        if(file_exists("../archivos/".$archivo)) {
            $abrirFichero = fopen("../archivos/".$archivo, 'w+');

            fwrite($abrirFichero, $contenido);

            fclose($abrirFichero);
            return true;
        } else {
            return false;
        }
    }