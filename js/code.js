const urlBase = 'http://contactfold.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

document.addEventListener('DOMContentLoaded', (event) => {
    function toggleForm() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const registerLink = document.getElementById('register-link');
        const loginLink = document.getElementById('login-link');

        if (registerLink) {
            registerLink.addEventListener('click', (event) => {
                event.preventDefault();
                loginForm.style.display = 'none';
                registerForm.style.display = 'block';
            });
        }

        if (loginLink) {
            loginLink.addEventListener('click', (event) => {
                event.preventDefault();
                registerForm.style.display = 'none';
                loginForm.style.display = 'block';
            });
        }
    }

    toggleForm();
});

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginUser").value;
	let password = document.getElementById("loginPassword").value;
	
	console.log("Login: " + login + " Password: " + password);
	
	/*var hash = md5(password);
    console.log("Hashed Password:", hash);

    if (!validLoginForm(login, password)) {
        document.getElementById("loginResult").innerHTML = "Invalid username or password";
        return false;
    }
	*/
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {
		login:login,
		password:password
	};
	
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contact.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doRegister()
{
	let firstName = document.getElementById("registerFirstName").value;
	let lastName = document.getElementById("registerLastName").value;
	let username = document.getElementById("registerUser").value;
	let password = document.getElementById("registerPassword").value;
	
	document.getElementById("registerResult").innerHTML = "";
	
	let tmp = {
		firstName:firstName,
		lastName:lastName,
		login:username,
		password:password
	}
	
	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/Register.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try {
		//trying to check if the user is already registered
		xhr.onreadystatechange = function () {

		if(this.readyState != 4)
		{
			return;
		}
		
		if(this.status == 200)
		{
			let jsonObject = JSON.parse( xhr.responseText );
			userId = jsonObject.id;
			if( userId < 1 )
			{
				document.getElementById("registerResult").innerHTML = "User/Password combination incorrect";
				return;
			}
			document.getElementById("registerResult").innerHTML = "User has been registered";
			firstName = jsonObject.firstName;
			lastName = jsonObject.lastName;
			saveCookie();
		}else{
				document.getElementById("registerResult").innerHTML = "User already exists";
				return;
			}
		};
		xhr.send(jsonPayload);
	} catch (error) 
	{
		document.getElementById("registerResult").innerHTML = error.message;
	}
	
	
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
	let newContact = document.getElementById("contactText").value;
	document.getElementById("contactAddResult").innerHTML = "";

	let tmp = {contact:newContact,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}

function searchContact()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	
	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/SearchContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				let contactListDiv = document.getElementById("contactList");
				let jsonObject = JSON.parse( xhr.responseText );
				
				for (let i = 0; i < jsonObject.results.length; i++)
				{
					// Create elements to be added to each contact.
					const id = document.createElement("p");
					const firstName = document.createElement("p");
					const lastName = document.createElement("p");
					const phone = document.createElement("p");
					const email = document.createElement("p");
					const editButton = document.createElement("button");
					const deleteButton = document.createElement("button");

					// Add classes to each element so they can be styled with CSS.
					id.classList.add("contactId");
					firstName.classList.add("contactFirstName");
					lastName.classList.add("contactLastName");
					phone.classList.add("contactPhone");
					email.classList.add("contactEmail");
					editButton.classList.add("contactEditButton");
					deleteButton.classList.add("contactDeleteButton");

					// Set elements as the json from searchContacts.
					id.textContent = jsonObject.results[i].ID;
					firstName.textContent = jsonObject.results[i].FirstName;
					lastName.textContent = jsonObject.results[i].LastName;
					phone.textContent = jsonObject.results[i].Phone;
					email.textContent = jsonObject.results[i].Email;
					editButton.textContent = "Edit Contact";
					deleteButton.textContent = "Delete Contact";

					// Create the div and fill it with the inputs.
					const singleContact = document.createElement("div");
					singleContact.id = "contactItem"+i;
					singleContact.appendChild(id);
					singleContact.appendChild(firstName);
					singleContact.appendChild(lastName);
					singleContact.appendChild(phone);
					singleContact.appendChild(email);
					singleContact.appendChild(editButton);
					singleContact.appendChild(deleteButton);

					// Append each child created to the iterations contact.
					contactListDiv.appendChild(singleContact);
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}

function validLoginForm(login, password) {
    // Example validation: Check if login and password are not empty
    if (!login || !password) {
        return false;
    }

    // Add more validation rules as needed
    // For example, check if the password meets certain criteria

    return true;
}