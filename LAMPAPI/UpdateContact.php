<?php
    $inData = getRequestInfo();

    $id = $inData["ID"];
    $firstName = $inData["FirstName"];
    $lastName = $inData["lastName"];
    $phoneNumber = $inData["phoneNumber"];
    $emailAddress = $inData["emailAddress"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    } else {
        $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE ID=?");
        $stmt->bind_param("sssss", $firstName, $lastName, $phoneNumber, $emailAddress, $id);
        if ($stmt->execute()) {
            returnWithInfo("Contact updated successfully");
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