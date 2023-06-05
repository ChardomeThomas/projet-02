
<?php 
//Thomas   

 include 'includes/dbo.inc.php';
// Retrieve JSON from POST body 
$jsonStr = file_get_contents('php://input'); 
$jsonObj = json_decode($jsonStr); 
 
if($jsonObj->request_type == 'addEvent'){ 
    $start = $jsonObj->start; 
    $end = $jsonObj->end; 
 
    $event_data = $jsonObj->event_data; 
    $eventTitle = !empty($event_data[0])?$event_data[0]:''; 
    $eventNom = !empty($event_data[1])?$event_data[1]:''; 
    $eventPrenom = !empty($event_data[2])?$event_data[2]:''; 
    $eventMail = !empty($event_data[3])?$event_data[3]:'';
    $eventTelephone = !empty($event_data[4])?$event_data[4]:'';
    $eventPersonnes = !empty($event_data[5])?$event_data[5]:'';
    $eventChalet = !empty($event_data[6])?$event_data[6]:'';
    $eventbreakfast = !empty($event_data[7])?$event_data[7]:'';
    $eventDinner = !empty($event_data[8])?$event_data[8]:'';
    $eventspa = !empty($event_data[9])?$event_data[9]:'';
    $eventstatusId = 1;
    
    if(!empty($eventTitle)){ 
        // Insert event data into the database 
        $sqlQ = "INSERT INTO reservation (title,nom,prenom,email,telephone,personnes,chalet_id,start,end, breakfast, dinner, spa, status_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)"; 
        $stmt = $link->prepare($sqlQ); 
        $stmt->bind_param("sssssiissiiii", $eventTitle, $eventNom, $eventPrenom,  $eventMail, $eventTelephone, $eventPersonnes, $eventChalet, $start, $end,  $eventbreakfast, $eventDinner,$eventspa, $eventstatusId ); 
        $insert = $stmt->execute(); 
 
        if($insert){ 
            $output = [ 
                'status' => 1 
            ]; 
            echo json_encode($output); 
        }else{ 
            echo json_encode(['error' => 'Event Add request failed!']); 
        } 
    } 
}elseif($jsonObj->request_type == 'editEvent'){ 

    $event_id = $jsonObj->event_id; 
 
    $event_data = $jsonObj->event_data; 
    $eventTitle = !empty($event_data[0])?$event_data[0]:''; 

    $eventNom = !empty($event_data[1])?$event_data[1]:''; 
    $eventPrenom = !empty($event_data[2])?$event_data[2]:''; 
    $eventMail = !empty($event_data[3])?$event_data[3]:'';
    $eventTelephone = !empty($event_data[4])?$event_data[4]:'';
    $eventPersonnes = !empty($event_data[5])?$event_data[5]:'';
    $eventStart = !empty($event_data[6])?$event_data[6]:'';
    $eventEnd = !empty($event_data[7])?$event_data[7]:'';
    $eventStatus = !empty($event_data[8])?$event_data[8]:'';
    $your_date = strtotime("1 day", strtotime($eventEnd));
    $eventEnd = date("Y-m-d", $your_date);
    if(!empty($eventTitle)){ 
        // Update event data into the database 
        $sqlQ = "UPDATE reservation SET title=?,nom=?,prenom=?,email=?,telephone=?,personnes=?,start=?,end=?,status_id=? WHERE id=?"; 
        $stmt = $link->prepare($sqlQ); 
        $stmt->bind_param("sssssissii", $eventTitle, $eventNom, $eventPrenom, $eventMail, $eventTelephone, $eventPersonnes, $eventStart, $eventEnd, $eventStatus, $event_id); 
        $update = $stmt->execute(); 
 
        if($update){ 
            $output = [ 
                'status' => 1 
            ]; 
            echo json_encode($output); 
        }else{ 
            echo json_encode(['error' => 'Event Update request failed!']); 
        } 
    } 
}elseif($jsonObj->request_type == 'deleteEvent'){ 
    $id = $jsonObj->event_id; 
 
    // $sql = "DELETE FROM reservation WHERE id=$id"; 
    $sql = "UPDATE reservation SET delete_date =  CURRENT_TIMESTAMP() WHERE id=$id"; 
    $delete = $link->query($sql); 
    if($delete){ 
        $output = [ 
            'status' => 1 
        ]; 
        echo json_encode($output); 
    }else{ 
        echo json_encode(['error' => 'Event Delete request failed!']); 
    } 
}

 
?>