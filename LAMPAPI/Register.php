
<?php
	//Added check for users
	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$lastName =$inData["lastName"];
	$login = $inData["login"];
	$password = $inData["password"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		
		$stmt = $conn->prepare("SELECT * FROM Users WHERE Login=?");
		$stmt->bind_param("ssssss", $login);
		$stmt->execute();
		$result = $stmt->get_result();
		$rows = mysqli_num_rows($result);
		
		if($rows == 0)
		{
			$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?,?,?,?)");
			$stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
			$stmt->execute();

			//get most recent id 
			$id = $conn->insert_id;

			$stmt->close();
			$conn->close();

			returnWithInfo($id);
		} 
		else
		{
			returnWithError("username has alreadly been taken");
		}
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

	function returnWithInfo($id)
	{
		$retValue = '{"id":' . $id . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
