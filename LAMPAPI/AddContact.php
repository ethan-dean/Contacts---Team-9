
<?php
$inData = getRequestInfo();

$userId = $inData["userId"];
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$phoneNumber = $inData["phoneNumber"];
$emailAddress = $inData["emailAddress"];
$dateCreated = date("Y-m-d H:i:s"); // Current date and time
$dateLastLoggedIn = date("Y-m-d H:i:s"); // Current date and time

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("INSERT INTO Contacts (UserId, FirstName, LastName, Phone, Email, DateCreated, DateLastLoggedIn) VALUES (?,?,?,?,?,?,?)");
    $stmt->bind_param("issssss", $userId, $dateCreated, $dateLastLoggedIn, $firstName, $lastName, $phoneNumber, $emailAddress);

    if ($stmt->execute() === TRUE) {
        returnWithInfo("Contact added successfully");
    } else {
        returnWithError($stmt->error);
    }

    $stmt->close();
    $conn->close();
}

function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err) {
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($info) {
    $retValue = '{"info":"' . $info . '"}';
    sendResultInfoAsJson($retValue);
}
?>