<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no, width=device-width">
    <title>Devdactic Image Upload</title>
</head>
<body>
    <h1>Ionic Image Upload</h1>
    <?php
    $scan = scandir('uploads');
    foreach ($scan as $file) {
        if (!is_dir($file)) {
            echo '<h3>' . $file . '</h3>';
            echo '<img src="uploads/' . $file . '" style="width: 400px;"/><br />';
        }
    }
    ?>
</body>
</html>