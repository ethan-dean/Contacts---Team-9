<?php
	$inData = getRequestInfo();
	
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	} 
	else
	{
		// Check if username exists and get the password
		$stmt = $conn->prepare("SELECT ID, firstName, lastName, password FROM Users WHERE Login=?");
		$stmt->bind_param("s", $inData["login"]);
		$stmt->execute();
		$result = $stmt->get_result();

		if ($row = $result->fetch_assoc()) 
		{
			// Check if the provided password matches
			if ($inData["password"] === $row["password"]) 
			{
				// Successful login, return info
				$statusMessage = "Status: Successful Login";
				
				$firstName = !empty($row["firstName"]) ? $row["firstName"] : "Doesn't exist";
				$lastName = $row["lastName"];  
				
				returnWithInfo($firstName, $lastName, $row['ID'], $statusMessage);

				$updateQuery = "UPDATE Users SET DateLastLoggedIn = NOW() WHERE ID = ?";
				$updateStmt = $conn->prepare($updateQuery);
				$updateStmt->bind_param("s", $row['ID']);
				$updateStmt->execute();
				$updateStmt->close();
			} 
			else 
			{
				header("HTTP/1.1 401 Unauthorized");
				returnWithError("Invalid username/password. Please check username/password and try again.");
			}
		} 
		else 
		{
			header("HTTP/1.1 401 Unauthorized");
			returnWithError("Invalid username/password. Please check username/password and try again.");
		}

		$stmt->close();
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
	
	function returnWithInfo($firstName, $lastName, $id, $status)
	{
		$retValue = '{"id":' . $id . ',';

		if ($firstName !== "Doesn't exist") 
		{
			$retValue .= '"firstName":"' . $firstName . '", ';
		}

		$retValue .= '"lastName":"' . $lastName . '", "status":"' . $status . '"}';
		sendResultInfoAsJson($retValue);
	}
?>