
<?php      
// Include database configuration file  
require_once 'dbConfig.php'; 
// var_dump($chaletId);
$where_sql = ''; 
if(!empty($_GET['start']) && !empty($_GET['end'])){ 
    $where_sql .= " WHERE start BETWEEN '".$_GET['start']."' AND '".$_GET['end']."' "; 
} 
 
// Fetch events from database 
$sql = "SELECT * FROM reservation $where_sql"; 
$result = $db->query($sql);  
 
$eventsArr = array(); 
if($result->num_rows > 0){ 
    while($row = $result->fetch_assoc()){ 
        array_push($eventsArr, $row); 
    } 
} 
echo json_encode($eventsArr);

// Render event data in JSON format 
