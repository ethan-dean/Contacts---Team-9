<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$inData = getRequestInfo();

$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$phoneNumber = $inData["phoneNumber"];
$emailAddress = $inData["emailAddress"];
$userId = $inData["userId"];
//$dateCreated = date("Y-m-d H:i:s"); // Current date and time

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) 
{
    returnWithError($conn->connect_error);
} 
else
{
    $stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserId) VALUES (?,?,?,?,?)");
    if (!$stmt) {
        returnWithError($conn->error);
    } else {
        $stmt->bind_param("sssss", $firstName, $lastName, $phoneNumber, $emailAddress, $userId);
        if (!$stmt->execute()) {
            returnWithError($stmt->error);
        } else {
            returnWithError("");
        }
        $stmt->close();
    }
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}
?>