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

        if (registerLink && loginForm && registerForm) {
            registerLink.addEventListener('click', (event) => {
                event.preventDefault();
                loginForm.style.display = 'none';
                registerForm.style.display = 'block';
            });
        }

        if (loginLink && loginForm && registerForm) {
            loginLink.addEventListener('click', (event) => {
                event.preventDefault();
                registerForm.style.display = 'none';
                loginForm.style.display = 'block';
            });
        }
    }
    
    function validatePassword()
    {
			const passwordInput = document.getElementById('registerPassword'); // Assuming the password input has an ID of 'registerPassword'
			const passwordRequirements = document.getElementsByClassName('password-requirements')[0];
			
			passwordInput.addEventListener('focus', () => {
				passwordRequirements.style.display = 'block';
			});
	
			passwordInput.addEventListener('blur', () => {
				passwordRequirements.style.display = 'none';
			});
			
			const requirements = {
				length: {
					element: document.getElementById('password_length'),
					xIcon: document.getElementById('length_icon_x'),
					checkIcon: document.getElementById('length_icon_check'),
					isValid: value => value.length >= 8
				},
				uppercase: {
					element: document.getElementById('password_uppercase'),
					xIcon: document.getElementById('uppercase_icon_x'),
					checkIcon: document.getElementById('uppercase_icon_check'),
					isValid: value => /[A-Z]/.test(value)
				},
				lowercase: {
					element: document.getElementById('password_lowercase'),
					xIcon: document.getElementById('lowercase_icon_x'),
					checkIcon: document.getElementById('lowercase_icon_check'),
					isValid: value => /[a-z]/.test(value)
				},
				number: {
					element: document.getElementById('password_number'),
					xIcon: document.getElementById('number_icon_x'),
					checkIcon: document.getElementById('number_icon_check'),
					isValid: value => /\d/.test(value)
				},
				special: {
					element: document.getElementById('password_special'),
					xIcon: document.getElementById('special_icon_x'),
					checkIcon: document.getElementById('special_icon_check'),
					isValid: value => /[@#$%^&+=!_\-]/.test(value)
				}
			};
		
			passwordInput.addEventListener('input', function() {
				const value = passwordInput.value;
		
				for (const key in requirements) {
					const requirement = requirements[key];
					const isValid = requirement.isValid(value);
					if (requirement.element.classList.toggle('valid', isValid)) {
						requirement.xIcon.style.display = 'none';
						requirement.checkIcon.style.display = 'inline-block';
					} else {
						requirement.xIcon.style.display = 'inline-block';
						requirement.checkIcon.style.display = 'none';
					}
				}
			});
        }
    
    function showAddContactForm() {
        const addContactButton = document.getElementsByClassName('add-contact-icon')[0];
        const addContactContainer = document.getElementById('addContactContainer');
        
        if(addContactButton && addContactContainer) {
            addContactButton.addEventListener('click', (event) => {
                event.preventDefault();
                if(addContactContainer.style.display === 'none') {
					addContactContainer.style.display = 'block';
				} else {
					addContactContainer.style.display = 'none';
				}
            });
        }
	}

    const currentPage = window.location.pathname;
    console.log(currentPage);
    if(currentPage === '/login.html' || currentPage === '/login.html#register') {
		toggleForm();
		validatePassword();
	}
    showAddContactForm();
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
    console.log("Hashed Password:", hash);*/

    if (!validLoginForm(login, password)) {
        //document.getElementById("loginResult").innerHTML = "Invalid username or password";
        return;
    }
	
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
			}else if(this.status == 401)
			{
				document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function validLoginForm(login, password) 
{
	if(login == "" || password == "") {
		document.getElementById("loginResult").innerHTML = "Please fill out all fields";
		return false;
	}
	
	const passwordRequirements = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!_\-]).{8,}/;
	if(!passwordRequirements.test(password)) {
		document.getElementById("loginResult").innerHTML = "Password does not meet requirements";
		return false;
	}
	
	return true;
}

function doRegister()
{
	let docFirstName = document.getElementById("registerFirstName").value;
	let docLastName = document.getElementById("registerLastName").value;
	let docUsername = document.getElementById("registerUser").value;
	let docPassword = document.getElementById("registerPassword").value;
	
	if(!validRegisterForm(docFirstName, docLastName, docUsername, docPassword)) {
		return;
	}
	
	document.getElementById("registerResult").innerHTML = "";
	
	let tmp = {
		firstName:docFirstName,
		lastName:docLastName,
		login:docUsername,
		password:docPassword
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
			if( jsonObject.userId < 1 )
			{
				document.getElementById("registerResult").innerHTML = "User/Password combination incorrect";
				return;
			}
			document.getElementById("registerResult").innerHTML = "User has been registered";
			console.log("setting global variables...");
			firstName = docFirstName;
			lastName = docLastName;
			userId = jsonObject.id;
			console.log("saving cookie...");
			saveCookie();
	
			console.log("redirecting to contact page...");
			window.location.href = "contact.html";
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

function validRegisterForm(firstName, lastName, username, password) {
	if(firstName == "" || lastName == "" || username == "" || password == "") {
		document.getElementById("registerResult").innerHTML = "Please fill out all fields";
		return false;
	}
	
	const passwordRequirements = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!_\-]).{8,}/;
	if(!passwordRequirements.test(password))
	{
		document.getElementById("registerResult").innerHTML = "Password does not meet requirements";
		return false;
	}
	
	return true;
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
		document.getElementById("welcome-message").innerHTML = "Welcome, " + firstName + " " + lastName + "!";
	}
}

function getCookie(name) {
	let cookieArr = document.cookie.split(";");
	for(let i = 0; i < cookieArr.length; i++) {
		let cookiePair = cookieArr[i].split("=");
		if(name == cookiePair[0].trim()) {
			return decodeURIComponent(cookiePair[1]);
		}
	}
	return null;
}

function displayWelcomeMessage() {
	let firstName = getCookie("firstName");
	let lastName = getCookie("lastName");
	
	
	if(firstName && lastName) {
		document.getElementById("welcome-message").innerHTML = "Welcome " + firstName + " " + lastName;
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
	let firstName = document.getElementById("AddContactFirstName").value;
	let lastName = document.getElementById("AddContactsLastName").value;
	let phoneNumber = document.getElementById("AddContactsPhoneNumber").value;
	let emailAddress = document.getElementById("AddContactsEmail").value; 
	
	if(!validAddContact(firstName, lastName, phoneNumber, emailAddress)) {
		return;
	}
	
	document.getElementById("contactAddResult").innerHTML = "";

	let tmp = {
		firstName: firstName, 
		lastName: lastName, 
		phoneNumber: phoneNumber,
		emailAddress: emailAddress,
		userId: userId
	};
	
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
				document.getElementById("addContactForm").reset();
				loadContacts();
				
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}

function validAddContact(firstName, lastName, phoneNumber, emailAddress) {
	
	if(firstName == "" || lastName == "" || phoneNumber == "" || emailAddress == "") {
		document.getElementById("contactAddResult").innerHTML = "Please fill out all fields";
		return false;
	}
	
	let maxLength = 50;
	
	if(firstName.length > maxLength || lastName.length > maxLength || phoneNumber.length > maxLength || emailAddress.length > maxLength) {
		document.getElementById("contactAddResult").innerHTML = "Fields cannot exceed 50 characters";
		return false;
	}
	
	const phoneRequirements = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
	
	if(!phoneRequirements.test(phoneNumber)) {
		document.getElementById("contactAddResult").innerHTML = "Phone number is invalid";
		return false;
	}
	
	phoneNumber = formatPhoneNumber(phoneNumber);
	
	const emailRequirements = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
	
	if(!emailRequirements.test(emailAddress)) {
		document.getElementById("contactAddResult").innerHTML = "Email address is invalid";
		return false;
	}
	
	return true;
}

function formatPhoneNumber(phoneNumber) {
    const remove = ('' + phoneNumber).replace(/\D/g, '');
    const match = remove.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
}

function loadContacts() {
    let tmp = {
        search: "",
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }

                let contactTBody = document.getElementById("contactTableBody");
                contactTBody.innerHTML = "";

                for (let i = 0; i < jsonObject.results.length; i++) {
                    let contact = jsonObject.results[i];
                    let newRow = document.createElement("tr");
                    newRow.id = `row${contact.ID}`;

                    newRow.innerHTML = `
                        <td id="first_Name${contact.ID}">${contact.FirstName || "N/A"}</td>
                        <td id="last_Name${contact.ID}">${contact.LastName || "N/A"}</td>
                        <td id="phone${contact.ID}">${contact.Phone || "N/A"}</td>
                        <td id="email${contact.ID}">${contact.Email || "N/A"}</td>
                        <td>
                            <button id="edit-btn-${contact.ID}"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAWpJREFUSEvNlo1NxDAMRn2bwCTAJByTAJPAJsAkxybQJ9XVl1z+U6kX6aRr2uT5sx3HJztonA7i2k2CHzu88Wtm/Bh3y/+zmT2Y2c/y/Cnvti1Tiln00QFl4xeBslaNxqCnGJ4CX1arW9glKEDUM67gMRhLv9aP3xfLvyt0fw9AlbpBb2b2uu6hRl4ll4JxTw3sMVUo6u7FYISwbzBfUtwCjpU6D2+hVvNlN8Up96LM4woIsMeYBNw8OKo4F1Pmca3Dk1AmR8A5qLtZE4q4Bkr9o15wDaoxzUJ7Fc9AvaB0xxgohcVHkKFR9sZK/YgGp6TV1X+DUDW4G6xFpUcptmYLUovi3OKW7N0NzNEghs+l4iBh2Q0c3xnFI7OnqxVcg07HmMzUEuhw7Tpyt+eUqytXcvH1ENgTaRbsjUDxHKdulxmwrg2Obq7Zw8pUXEeMIBdoDCg+28j11bmEGgEn26ebbOhH1DWvOUzxP6dTlR/hIXkuAAAAAElFTkSuQmCC"/></button>
                            <button id="save-btn-${contact.ID}" style="display: none;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAATNJREFUSEvtlu0RgjAMhl8mUTfRTXQSdRJ1Et1EnUR5vYaLvbQEigfe0Tt+QBOefDatMNKqRuJicuAlAD591s2jZHm8BXDyKCdkHgAu9d4h9w8L/CqAimorPAavAVyD9hEAw8aQxxHgj3dBbl/LUU9gfOfKwnPgTQBrY8QjGsR9LhpKGfmmU5WEl4AZES5Gg1HRxrTC+4KtMtBg7sfwlVb6JTiGS+o+fA/Y29PMJx+9dH10Bpd01wxujlNPjhlqq5etFDDHbLNz2CwOdZdjlHBpnSKwVqYnz0S1LULvcts69TpXddJqR+sM5vGX1TNYjdT/zDEHPVuDBSLDXb5ZhW3J6W/ZquZAuJcczhld9nYzRKw7Fy9p4uFQNjBScpqZY1FA3lHoMcy87k7uQu/xpEhmNI/fvVaKH2K3qtIAAAAASUVORK5CYII="/></button>
                            <button id="delete-btn-${contact.ID}"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAPFJREFUSEvtVtEVwiAQSyfRUXQT3cxNdBN1Exuf9VEEEmyf+AGfNHch4bjegEZraMSLGuIDgK046G3EnBwxLvEZwM5JOOIuAPYK6xBT5VUlir6TmAfILoeYSqmYq5TQxT0T/Q0xbWURhWsT7LFw7hn/FI6xLL6k4tCuymuV8Nk1xVY3Iw6PPT0h63lEemVsqbhkcMFcGVtLPHWvsEOl9lYnTiV092YG1Sp2SbrijzrsVqsG0ouLDrkuLHrHzTqX/Pe9AKs3kJ8Su2QpHKeOY+pDqYF8M13GHNnhUA17JOdUogb5nNr3jBUDFPESm4uxzYgf6SOGH0AL/E4AAAAASUVORK5CYII="/></button>
                        </td>
                    `;

                    newRow.querySelector(`#edit-btn-${contact.ID}`).onclick = function() {
                        editContact(contact.ID);
                    };
                    newRow.querySelector(`#save-btn-${contact.ID}`).onclick = function() {
                        saveContact(contact.ID);
                    };
                    newRow.querySelector(`#delete-btn-${contact.ID}`).onclick = function() {
                        deleteContact(contact.ID);
                    };

                    contactTBody.appendChild(newRow);
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function editContact(contactId) {
    document.getElementById("edit-btn-" + contactId).style.display = "none";
    document.getElementById("save-btn-" + contactId).style.display = "inline-block";

    var firstNameCell = document.getElementById("first_Name" + contactId);
    var lastNameCell = document.getElementById("last_Name" + contactId);
    var emailCell = document.getElementById("email" + contactId);
    var phoneCell = document.getElementById("phone" + contactId);

    var firstNameData = firstNameCell.innerText;
    var lastNameData = lastNameCell.innerText;
    var emailData = emailCell.innerText;
    var phoneData = phoneCell.innerText;
    phoneData = formatPhoneNumber(phoneData);

    firstNameCell.innerHTML = "<input type='text' id='firstName_text" + contactId + "' value='" + firstNameData + "'>";
    lastNameCell.innerHTML = "<input type='text' id='lastName_text" + contactId + "' value='" + lastNameData + "'>";
    emailCell.innerHTML = "<input type='text' id='email_text" + contactId + "' value='" + emailData + "'>";
    phoneCell.innerHTML = "<input type='text' id='phone_text" + contactId + "' value='" + phoneData + "'>";
}

function saveContact(contactId) {
    var firstNameVal = document.getElementById("firstName_text" + contactId).value;
    var lastNameVal = document.getElementById("lastName_text" + contactId).value;
    var emailVal = document.getElementById("email_text" + contactId).value;
    var phoneVal = document.getElementById("phone_text" + contactId).value;

    document.getElementById("first_Name" + contactId).innerHTML = firstNameVal;
    document.getElementById("last_Name" + contactId).innerHTML = lastNameVal;
    document.getElementById("email" + contactId).innerHTML = emailVal;
    document.getElementById("phone" + contactId).innerHTML = phoneVal;

    document.getElementById("edit-btn-" + contactId).style.display = "inline-block";
    document.getElementById("save-btn-" + contactId).style.display = "none";

    let tmp = {
        ID: contactId,
        newFirstName: firstNameVal,
        newLastName: lastNameVal,
        phoneNumber: phoneVal,
        emailAddress: emailVal
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/UpdateContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.error("Server error:", jsonObject.error);
                    return;
                }
                console.log("Contact has been updated");
                loadContacts();
            } else if (this.readyState == 4) {
                console.error("Failed to update contact. Status:", this.status);
                console.error("Response:", this.responseText);
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function deleteContact(contactId, row)
{
	if(!confirm("Are you sure you want to delete this contact?")) {
		return;
	}
	
	const contact = {
		contactId: contactId,
		userId: userId
	}
	
	let jsonPayload = JSON.stringify(contact);
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", urlBase + '/DeleteContact.' + extension, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				console.log("Contact deleted!");
				loadContacts();
			}
		};
	xhr.send(jsonPayload);
	}catch(error) {
	console.error(error.message);
	}
}

function searchContact()
{
	const search = document.getElementById("search-input").value.toLowerCase();
	const contactTBody = document.getElementById("contactTableBody");
	const tableRows = contactTBody.getElementsByTagName("tr");
	
	for(let i = 0; i < tableRows.length; i++) {
		let row = tableRows[i];
		let firstName = row.children[0].innerText.toLowerCase();
		let lastName = row.children[1].innerText.toLowerCase();
		
		if(firstName && lastName)
		{
			if(firstName.includes(search) || lastName.includes(search)) {
				row.style.display = "table-row";
			} else {
				row.style.display = "none";
			}
		}
	}
}

function navigateToAbout() {
    window.location.href = "./about.html";
}