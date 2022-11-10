function selectPeriod() {
	selected = document.getElementById("select-period");
	selected.addEventListener("click", function(event) {
		window.location.href = "home.html?period=" + event.target.text.replace(/([^\d])+/gim, '')
	})	
}

function filterPeriod(register, period) {
	var arrayData = register.date.split('-');
    var campoDia = parseInt(arrayData[2]); 
    var campoMes = parseInt(arrayData[1]); 
    var campAno = parseInt(arrayData[0]);

    var dateCheck = new Date(); //verificar se está dentro ou fora do período
    dateCheck.setDate(campoDia);
    dateCheck.setMonth(campoMes -1);
    dateCheck.setFullYear(campAno);

    var inicialDate = new Date(); //data inicial

    if (period == 7 || period == 15) {
		inicialDate.setDate(inicialDate.getDate() - period);
    } else
    if (period == 30 || period == 6) {
    	if (period == 30) {
    		period = 1;
    	}
		inicialDate.setMonth(inicialDate.getMonth() - period);
    } else {
		inicialDate.setFullYear(inicialDate.getFullYear() - 1);
    }	

	var today = new Date(); //data final
	today.setDate(today.getDate());

	if (dateCheck.getTime() >= inicialDate.getTime() && dateCheck.getTime() <= today.getTime()) {
	    createCard(register);
	}
}

function selectCourses() {
	selected = document.getElementById("select-courses");
	selected.addEventListener("click", function(event) {
		window.location.href = "home.html?course=" + event.target.text 
	})	
}

function removeSelect() {
	window.location.href = "home.html";
}

function logout() {
	firebase.auth().signOut().then(() => {
		window.location.href = "index.html";
	}).catch(() => {
		alert("Erro ao fazer logout");
	})
}

function findRegisters(user) {
	//showLoading();
	const doc = new jsPDF()
	$(form.pdfContent()).append("<div class='d-flex justify-content-md-between'><h1 style='color: darkviolet;'>AcoDi</h1>" +
			"<text>Data de emissão: 10/11/2022</text></div><br>" +
			"<br>");
	contactService.findByUser(user)
		.then(contacts => {
			//hideLoading();
			addContactsToScreen(contacts);
		})
		.catch(error => {
			//hideLoading();
			console.log(error);
			alert("Erro ao recuperar contatos");
		})
	form.savePdf().addEventListener('click', () => {
		doc.fromHTML(form.pdfContent(), 25, 20)
		doc.output("dataurlnewwindow")
	})
}

var uid

function addContactsToScreen(contacts) { 
	$(form.pdfContent()).append("<h5 style='color: gray; margin: 0;'>Contatos</h5>");
	contacts.forEach(register => {
		const currentUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
		const urlParams = new URLSearchParams(window.location.search);

		if (currentUrl == window.location.href) { //filtra os contatos
			createCard(register);
		} else {
			if (urlParams.get('course') == register.course) { //filtra os contatos do curso selecionado
				const removeFilter = document.getElementById('filter').innerHTML = "Remover filtro";
				createCard(register);
			}
			if (urlParams.get('period')) {
				filterPeriod(register, urlParams.get('period'));
				const removeFilter = document.getElementById('filter').innerHTML = "Remover filtro";
			} 
		}
	});

}

function createCard(register) {
	const orderedList = document.getElementById('cards');
	const li = createContactListItem(register);
	li.setAttribute('class', 'd-flex align-items-center');
	li.appendChild(createParagraph(register.date.split('-').reverse().join('/')));
	const ul = document.createElement('ul');
		const info = document.createElement('div');
			//info.setAttribute('class', 'name');
			info.appendChild(createParagraph(register.studentName)).setAttribute('class', 'name');
			info.appendChild(createSpan(register.grade + " " + register.course));

	const div = action();

	ul.appendChild(info);
	ul.appendChild(div);
	li.appendChild(ul);
	orderedList.appendChild(li);
}

function createContactListItem(register) {
	$(form.pdfContent()).append("<text><b>" + register.studentName + "</b>" +
		"<br>Curso: " + register.grade + " " + register.course +
		"<br>Data de registro: " + register.date + 
		"<p>");

	const li = document.createElement('li');
	li.id = register.uid;

	confirmRemoveRegister(register);
	//visualizar contato
	li.addEventListener('click', () => {
		uid = register.uid; //enviar esse valor para editContact() e localizar o contato para editar
	
		form.studentNameView().innerHTML = " " + register.studentName;
		form.rmView().innerHTML = " " + register.rm;
		form.dateView().innerHTML = " " + register.date.split('-').reverse().join('/');
		form.guardianStudentView().innerHTML = " " + register.guardianStudent;
		form.guardianPhoneView().innerHTML = " " + register.guardianPhone;
		form.gradeView().innerHTML = " " + register.grade + " " + register.course;
		form.pCoordinatorView().innerHTML = " " + register.pCoordinator;
		form.aCoordinatorView().innerHTML = " " + register.aCoordinator;
		form.educationalAdviserView().innerHTML = " " + register.educationalAdviser;
		form.subjectView().innerHTML = " " + register.subject;
		form.whatsapp().style.display = register.guardianPhone ? "block" : "none";
		createUpdateModal(register);
		
		form.whatsapp().addEventListener('click', () => {
			form.whatsapp().href = "https://wa.me/+55" + register.guardianPhone.replace(/\D+/g, '');
		})
	})
	return li;
}

function createUpdateModal(register) {
	
	form.titulo().innerHTML = "Editar contato";
	form.studentName().value = register.studentName;
	form.rm().value = register.rm;
	form.date().value = register.date; //não está funcionando
	form.guardianStudent().value = register.guardianStudent;
	form.guardianPhone().value = register.guardianPhone;
	form.grade().value = register.grade;
	form.course().value = register.course;
	form.pCoordinator().value = register.pCoordinator;
	form.aCoordinator().value = register.aCoordinator;
	form.educationalAdviser().value = register.educationalAdviser;
	form.subject().value = register.subject;
		
	//salvar alterações do contato
	saveButton.addEventListener('click', () => {
		updateContact();
	})
}

function removeRegister(register) {
	//showLoading();
	contactService.remove(register)
	.then(() => {
		//hideLoading();
		document.getElementById(register.uid).remove();
		window.location.href = "home.html";
	})
}

function updateContact() {
	const register = createContact();
	//showLoading();
    contactService.update(register)
    .then(() => {
        //hideLoading();
        window.location.href = "home.html";
    })
   .catch(() => {
        //hideLoading();
        alert('Erro ao atualizar contato');
    });
}

function saveContact() {
	//showLoading();
	if (form.studentName().value == "" || form.date().value == "") {
        alert("Preencha os campos obrigatórios");
    } else {
    	const register = createContact();

    	contactService.save(register)
   		.then(() => {
   			//hideLoading();
   			window.location.href = "home.html";
   		})
   		.catch(() => {
   			//hideLoading();
   			alert("Erro ao cadastrar contato");
   		})
    }
}

function registerModal() {
	form.titulo().innerHTML = "Novo contato";
	form.studentName().value = "";
	form.rm().value = "";
	form.date().value = "";
	form.guardianStudent().value = "";
	form.guardianPhone().value = "";
	form.grade().value = "";
	form.course().value = "";
	form.pCoordinator().value = "";
	form.aCoordinator().value = "";
	form.educationalAdviser().value = "";
	form.subject().value = "";

	saveButton.addEventListener('click', () => {
		saveContact();
	})
}

function createContact() {
	return {
    	studentName: form.studentName().value,
    	rm: form.rm().value,
    	date: form.date().value,
    	guardianStudent: form.guardianStudent().value,
    	guardianPhone: form.guardianPhone().value,
    	grade: form.grade().value,
    	course: form.course().value,
    	pCoordinator: form.pCoordinator().value,
    	aCoordinator: form.aCoordinator().value,
    	educationalAdviser: form.educationalAdviser().value,
   		subject: form.subject().value,
   		user: {
   			uid: firebase.auth().currentUser.uid
   		}
	};
}