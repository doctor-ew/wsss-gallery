<?php
$post_data = $_POST['data'];
var_dump($post_data);
if (!empty($post_data)) {
    $filename = 'gallery.txt';
//    $file = uniqid().getmypid();
    $handle = fopen($filename, "w");
    fwrite($handle, $post_data);
    fclose($handle);
    echo $post_data;
}
?>