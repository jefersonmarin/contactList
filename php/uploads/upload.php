<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
$target_path = "uploads/";

if (!is_dir($target_path)) {
    mkdir($target_path, 0777, true);
}

$target_path = $target_path . basename( $_FILES['file']['name']);

if ($_FILES['file']['error'] == 0) {
    if (move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {
        $data = ['success' => true, 'message' => 'Upload and move success'];
        echo json_encode($data);
    } else {
        // Se não conseguiu mover o arquivo, retorna erro
        $data = ['success' => false, 'message' => 'Failed to move the uploaded file'];
        echo json_encode($data);
    }
} else {
    // Caso haja um erro no upload
    $data = ['success' => false, 'message' => 'There was an error uploading the file, please try again!'];
    echo json_encode($data);
}

?>