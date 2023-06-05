<?php
// $dbconfig = parse_ini_file(".env");
// $db_host = $dbconfig["DB_HOST"];
// $db_user = $dbconfig["DB_USER"];
// $db_pass = $dbconfig["DB_PW"];
// $db_name = $dbconfig["DB_NAME"];

// define('DB_HOST', 'srv966.hstgr.io'); 
// define('DB_USERNAME', 'u626203503_admin'); 
// define('DB_PASSWORD', 'Admin12345'); 
// define('DB_NAME', 'u626203503_chalets'); 
  
// $link = new mysqli($db_host, $db_user, $db_pass, $db_name);
$link = new mysqli('srv966.hstgr.io', 'u626203503_admin', 'Admin12345',  'u626203503_chalets');
$charset = "utf8";
$link->set_charset($charset);