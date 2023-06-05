
<?php
//Thomas

include 'includes/dbo.inc.php';
$req = $link->prepare("SELECT name, image, description FROM chalets");
$req->execute();
$results = $req->get_result();

$data = array();
while ($row = $results->fetch_assoc()) {
    $data[] = $row;
}

$jsonData = json_encode($data);

header('Content-Type: application/json');
echo $jsonData;
