<?php

    require_once("acciones.php");

    $respuesta = array();

    switch($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            if(isset($_GET['archivo'])) {
                $respuesta['estado'] = 'info';
                $respuesta['datos'] = json_decode(getArchivo($_GET['archivo']));
                http_response_code(200);
                
            } else {
                http_response_code(404);
            }
            
            break;

        case 'POST':
            if(isset($_POST['n']) == 1) {
                $respuesta['estado'] = 'archivos';
                $respuesta['datos'] = json_decode(cargarArchivos());
                http_response_code(200);

            } else if(isset($_POST['nombrearchivo']) != "") {

                if($datosCreacion = json_decode(crearArchivo($_POST['nombrearchivo']))) {
                    $respuesta['estado'] = 'crear_doc';
                    http_response_code(200);

                } else {
                    http_response_code(500);
                }

            } else if(isset($_POST['id']) == 2) {

                if(json_decode(guardarContenido($_POST['contenido'], $_POST['nomArchivo']))) {
                    $respuesta['estado'] = 'contenidoGuardado';
                    http_response_code(200);
                } else {
                    http_response_code(500);
                }

            } else {
                http_response_code(404);
            }
            
            break;
        
        case 'DELETE':
            if(isset($_GET['eliminar'])) {                
                if($respuestaDatos = json_decode(eliminarArchivo($_GET['eliminar']))) {
                    $respuesta['estado'] = 'eliminarArch';
                    http_response_code(200);
                } else {
                    http_response_code(500);

                }

            } else {
                http_response_code(404);
            }

            break;

        case 'PUT':
            if(isset($_GET['archivo']) && isset($_GET['actualizar'])) {       

                if(actualizarArchivo($_GET['archivo'], $_GET['actualizar'])) {
                    $respuesta['estado'] = 'actualizado';
                    http_response_code(200);

                } else {
                    http_response_code(500);
                }

            } else {
                http_response_code(404);
            }

            break;

        default:

            break;
    }

    header("Content-type: application/json");
    echo json_encode($respuesta);