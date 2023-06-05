
<?php      
// Include database configuration file  
require_once 'dbConfig.php'; 
include 'includes/dbo.inc.php';
$where_sql = ''; 
if(!empty($_GET['start']) && !empty($_GET['end'])){ 
    $where_sql .= " WHERE start BETWEEN '".$_GET['start']."' AND '".$_GET['end']."' "; 
} 
 
// Fetch events from database 
$sql = "SELECT *, chalet_Id FROM reservation WHERE delete_date IS NULL";
$result = $link->query($sql);  
 
$eventsArr = array(); 
if($result->num_rows > 0){ 
    while ($row = $result->fetch_assoc()) {
        $row['chalet_Id'] = $row['chalet_Id']; 
        array_push($eventsArr, $row);
    }
    
} 
echo json_encode($eventsArr);

