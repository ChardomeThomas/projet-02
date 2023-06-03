<?php  
// Database configuration  
define('DB_HOST', 'srv966.hstgr.io'); 
define('DB_USERNAME', 'u626203503_admin'); 
define('DB_PASSWORD', 'Admin12345'); 
define('DB_NAME', 'u626203503_chalets'); 
  
// Create database connection  
$db = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME);  
  
// Check connection  
if ($db->connect_error) { 
    die("Connection failed: " . $db->connect_error);  
}