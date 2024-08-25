<?php
	$inData = getRequestInfo();
	
	$contact = $inData["contact"];
	$userId = $inData["userId"];
	//Uncomment this later once contacts.html is updated to allow users to add a contact with first name, last name, phone number, and email address
	//$firstName = $inData["firstName"];
	//$lastName = $inData["lastName"];
	//$phoneNumber = $inData["phoneNum"];
	//$emailAddress = $inData["emailAddress"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (UserId,Name) VALUES(?,?)");
		$stmt->bind_param("ss", $userId, $contact);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
