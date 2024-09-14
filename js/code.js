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
        const passwordInput = document.getElementById("registerPassword");
        const requirements = document.getElementsByClassName('password-requirements')[0];
        const length = document.getElementById('password_length');
        const uppercase = document.getElementById('password_uppercase');
        const lowercase = document.getElementById('password_lowercase');
        const number = document.getElementById('password_number');
        const special = document.getElementById('password_special');
        
        if (!passwordInput || !requirements || !length || !uppercase || !lowercase || !number || !special) {
            //console.error("One or more elements for password validation are missing.");
            return;
        }

        passwordInput.addEventListener('focus', () => {
            requirements.style.display = 'block';
        });

        passwordInput.addEventListener('blur', () => {
            requirements.style.display = 'none';
        });

        passwordInput.addEventListener('input', () => {
            const value = passwordInput.value;
            length.classList.toggle('valid', value.length >= 8);
            length.classList.toggle('invalid', value.length < 8);

            uppercase.classList.toggle('valid', /[A-Z]/.test(value));
            uppercase.classList.toggle('invalid', !/[A-Z]/.test(value));
			lowercase.classList.toggle('valid', /[a-z]/.test(value));
            lowercase.classList.toggle('invalid', !/[a-z]/.test(value));

            number.classList.toggle('valid', /\d/.test(value));
            number.classList.toggle('invalid', !/\d/.test(value));

            special.classList.toggle('valid', /[@#$%^&+=!_\-]/.test(value));
            special.classList.toggle('invalid', !/[@#$%^&+=!_\-]/.test(value));
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

    toggleForm();
    validatePassword();
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
	let firstName = document.getElementById("registerFirstName").value;
	let lastName = document.getElementById("registerLastName").value;
	let username = document.getElementById("registerUser").value;
	let password = document.getElementById("registerPassword").value;
	
	if(!validRegisterForm(firstName, lastName, username, password)) {
		return;
	}
	
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
				//addContactToTable(tmp);
				loadContacts();
				//displayContacts();
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
	
	const phoneRequirements = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
	
	if(!phoneRequirements.test(phoneNumber)) {
		document.getElementById("contactAddResult").innerHTML = "Phone number is invalid";
		return false;
	}
	
	const emailRequirements = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
	
	if(!emailRequirements.test(emailAddress)) {
		document.getElementById("contactAddResult").innerHTML = "Email address is invalid";
		return false;
	}
	
	return true;
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

                    newRow.innerHTML = `
                        <td>${contact.FirstName || "N/A"}</td>
                        <td>${contact.LastName || "N/A"}</td>
                        <td>${contact.PhoneNumber || "N/A"}</td>
                        <td>${contact.EmailAddress || "N/A"}</td>
                        <td>
                            <button id="edit-btn-${i}"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAWpJREFUSEvNlo1NxDAMRn2bwCTAJByTAJPAJsAkxybQJ9XVl1z+U6kX6aRr2uT5sx3HJztonA7i2k2CHzu88Wtm/Bh3y/+zmT2Y2c/y/Cnvti1Tiln00QFl4xeBslaNxqCnGJ4CX1arW9glKEDUM67gMRhLv9aP3xfLvyt0fw9AlbpBb2b2uu6hRl4ll4JxTw3sMVUo6u7FYISwbzBfUtwCjpU6D2+hVvNlN8Up96LM4woIsMeYBNw8OKo4F1Pmca3Dk1AmR8A5qLtZE4q4Bkr9o15wDaoxzUJ7Fc9AvaB0xxgohcVHkKFR9sZK/YgGp6TV1X+DUDW4G6xFpUcptmYLUovi3OKW7N0NzNEghs+l4iBh2Q0c3xnFI7OnqxVcg07HmMzUEuhw7Tpyt+eUqytXcvH1ENgTaRbsjUDxHKdulxmwrg2Obq7Zw8pUXEeMIBdoDCg+28j11bmEGgEn26ebbOhH1DWvOUzxP6dTlR/hIXkuAAAAAElFTkSuQmCC"/></button>
                            <button id="save-btn-${i}" style="display: none;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAATNJREFUSEvtlu0RgjAMhl8mUTfRTXQSdRJ1Et1EnUR5vYaLvbQEigfe0Tt+QBOefDatMNKqRuJicuAlAD591s2jZHm8BXDyKCdkHgAu9d4h9w8L/CqAimorPAavAVyD9hEAw8aQxxHgj3dBbl/LUU9gfOfKwnPgTQBrY8QjGsR9LhpKGfmmU5WEl4AZES5Gg1HRxrTC+4KtMtBg7sfwlVb6JTiGS+o+fA/Y29PMJx+9dH10Bpd01wxujlNPjhlqq5etFDDHbLNz2CwOdZdjlHBpnSKwVqYnz0S1LULvcts69TpXddJqR+sM5vGX1TNYjdT/zDEHPVuDBSLDXb5ZhW3J6W/ZquZAuJcczhld9nYzRKw7Fy9p4uFQNjBScpqZY1FA3lHoMcy87k7uQu/xpEhmNI/fvVaKH2K3qtIAAAAASUVORK5CYII="/></button>
                            <button id="delete-btn-${i}"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAPFJREFUSEvtVtEVwiAQSyfRUXQT3cxNdBN1Exuf9VEEEmyf+AGfNHch4bjegEZraMSLGuIDgK046G3EnBwxLvEZwM5JOOIuAPYK6xBT5VUlir6TmAfILoeYSqmYq5TQxT0T/Q0xbWURhWsT7LFw7hn/FI6xLL6k4tCuymuV8Nk1xVY3Iw6PPT0h63lEemVsqbhkcMFcGVtLPHWvsEOl9lYnTiV092YG1Sp2SbrijzrsVqsG0ouLDrkuLHrHzTqX/Pe9AKs3kJ8Su2QpHKeOY+pDqYF8M13GHNnhUA17JOdUogb5nNr3jBUDFPESm4uxzYgf6SOGH0AL/E4AAAAASUVORK5CYII="/></button>
                        </td>
                    `;

                    // Add event listeners for the buttons
                    newRow.querySelector(`#edit-btn-${i}`).onclick = function() {
                        editContact(newRow, contact);
                    };
                    newRow.querySelector(`#save-btn-${i}`).onclick = function() {
                        saveContact(newRow, contact);
                    };
                    newRow.querySelector(`#delete-btn-${i}`).onclick = function() {
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

function editContact(row, contactId)
{
	const cells = row.querySelectorAll("td");
	
	cells.forEach((cell, index) => {
		if(index < 4) {
			const input = document.createElement("input");
			input.type = "text";
			input.value = cell.textContent;
			cell.textContent = "";
			cell.appendChild(input);
			
			console.log(`Created input for cell ${index}:`, input);
		}
	});
	
	
	row.querySelector("#edit-btn").style.display = "none";
	row.querySelector("#save-btn").style.display = "inline-block";
	row.querySelector("#save-btn").addEventListener("click", () => saveContact(row, contactId));
}

function saveContact(row, contactId) {
    const cells = row.querySelectorAll("td");

    // Debugging: Log the cells and their contents
    cells.forEach((cell, index) => {
        console.log(`Cell ${index}:`, cell.innerHTML);
    });

    // Check if inputs exist before accessing their values
    const firstNameInput = cells[0].querySelector("input");
    const lastNameInput = cells[1].querySelector("input");
    const phoneNumberInput = cells[2].querySelector("input");
    const emailAddressInput = cells[3].querySelector("input");

    if (!firstNameInput || !lastNameInput || !phoneNumberInput || !emailAddressInput) {
        console.error("One or more input elements are missing.");
        return;
    }

    const updatedContact = {
        contactId: contactId,
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        phoneNumber: phoneNumberInput.value,
        emailAddress: emailAddressInput.value,
        userId: userId
    };

    console.log("Updated Contact:", updatedContact);

    cells.forEach((cell, index) => {
        if (index < 4) {
            const input = cell.querySelector("input");
            if (input) {
                cell.textContent = input.value;
            }
        }
    });

    row.querySelector("#save-btn").style.display = "none";
    row.querySelector("#edit-btn").style.display = "inline-block";

    let xhr = new XMLHttpRequest();
    xhr.open("POST", urlBase + '/UpdateContact.' + extension, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact updated!");
                console.log("Response:", xhr.responseText);
                loadContacts();
            }
        };
        xhr.send(JSON.stringify(updatedContact));
    } catch (error) {
        console.log(error.message);
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
				row.remove();
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