
<?php
	//Finished 
	$inData = getRequestInfo();
	
	$ID = $inData["ID"];
	$newFirstName = $inData["newFirstName"];
	$newLastName = $inData["newLastName"];
	$phoneNumber = $inData["phoneNumber"];
	$emailAddress = $inData["emailAddress"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?,LastName=?,Phone=?,Email=? WHERE ID=?");
		$stmt->bind_param("sssss", $newFirstName, $newLastName, $phoneNumber, $emailAddress, $ID);
		
		if($stmt->execute())
		{
			returnWithError("");
		}else {
			returnWithError($stmt->error);
		}
		$stmt->close();
		$conn->close();
		//returnWithError("");
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
