<?php
include 'db.php';

// filter events by calender date
$where_sql ='';
if(!empty($_GET['debut']) && !empty($_GET['fin'])){
    $where_sql .= "WHERE start BETWEEN '".$_GET['début']."' AND '".$_GET['fin']."'";
}

//fetch event de la db
$sql = "SELECT * FROM reservation $where_sql";
$result = $db->query($sql);

$eventArr = Array();
if($result->num_rows > 0){
    while($row = $result->fetch_assoc()){
        array_push($eventArr,$row);
    }
}

echo json_encode($eventArr);
?>