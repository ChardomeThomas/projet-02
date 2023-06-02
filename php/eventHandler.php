<?php 
require_once 'db.php';
header("Content-Type: application/json"); // Ajout du header pour spécifier le type de contenu
$jsonStr = file_get_contents('php://input');
$jsonObj = json_decode($jsonStr);

if($jsonObj->request_type == 'addEvent'){
    $debut = $jsonObj->debut;
    $fin = $jsonObj->fin;
    $event_data = $jsonObj->event_data;

    // $eventTitre = !empty($event_data[0])?$event_data[0]:'';
    $eventNom = !empty($event_data[0])?$event_data[0]:'';
    $eventPrenom = !empty($event_data[1])?$event_data[1]:'';
    $eventMail = !empty($event_data[2])?$event_data[2]:'';
    $eventTelephone = !empty($event_data[3])?$event_data[3]:'';
    $eventNb_personnes = !empty($event_data[4])?$event_data[4]:'';
    
    if(!empty($eventTitre)){
        //insérer les données dans la DB
        $sqlQ = "INSERT INTO reservation (nom, prenom, email, telephone, nb_personnes, debut, fin) VALUES (?,?,?,?,?,?,?)";
        $stmt = $db->prepare($sqlQ);
        $stmt->bind_param("ssssiss", $eventNom, $eventPrenom, $eventMail, $eventTelephone, $eventNb_personnes, $debut, $fin);
        $insert = $stmt->execute();

        if($insert){
            $output = [
                'status' => 1
            ];
            echo json_encode($output);
        }else{
            echo json_encode(['error' => "echec dans l'ajout de l'événement"]);
        }
    }
}
?>
