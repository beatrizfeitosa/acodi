function selectPeriod() {
	selected = document.getElementById("select-data");
	selected.addEventListener("click", function(event) {
		window.location.href = "agenda.html?period=" + event.target.text
	})	
}

function removeSelect() {
	window.location.href = "agenda.html";
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

	var today = new Date(); //data final
	today.setDate(today.getDate());

    if (period == "Hoje") {
		inicialDate.setDate(inicialDate.getDate());
		if (dateCheck.getTime() == today.getTime()) {
			createCard(register);
		}
    } else
    if (period == "Pendentes") {
		inicialDate.setDate(inicialDate.getDate() + 1);
		if (dateCheck.getTime() > today.getTime()) {
			createCard(register);
		}
    } else {
		inicialDate.setDate(inicialDate.getDate() - 1);
		if (dateCheck.getTime() < today.getTime()) {
			createCard(register);
		}
    }	
}

function logout() {
	firebase.auth().signOut().then(() => {
		window.location.href = "../index.html";
	}).catch(() => {
		alert("Erro ao fazer logout");
	})
}

function findRegisters(user) {
	const doc = new jsPDF()

	meetingService.findByUser(user)
		.then(meetings => {
			addMeetingsToScreen(meetings);
		})
		.catch(error => {
			console.log(error);
			alert("Erro ao recuperar reuniões");
		})
	form.savePdf().addEventListener('click', () => {
		doc.fromHTML(form.pdfContent(), 25, 20)
		doc.save("acodi-agenda.pdf")
	})
}

var uid
var qtdRegister = 0
var html = ""

function addMeetingsToScreen(meetings) { 
	var today = new Date();
	
	meetings.forEach(register => {
		const currentUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
		const urlParams = new URLSearchParams(window.location.search);

		qtdRegister += 1;

		if (currentUrl == window.location.href) { //filtra os contatos
			createCard(register);
		} else {
			const removeFilter = document.getElementById('filter').innerHTML = "Remover filtro";
			if (urlParams.get('period')) {
				filterPeriod(register, urlParams.get('period'));
			} 
		}
	});

	$(form.pdfContent()).append("<div class='d-flex'><h1 style='color: darkviolet;'>AcoDi</h1>" +
			"<text>Data de emissão: " + today.toLocaleDateString("pt-BR") + "</text>" +
			"<text>Total de registros: " + qtdRegister + "</text></div>" +
			"<br><br><br><br><h5 style='color: gray; margin: 0;'>Reuniões</h5>" + html);
}

function createCard(register) {
	const li = createMeetingListItem(register);
		li.setAttribute('class', 'd-flex align-items-center');
		//criação dos cards
		const time = document.createElement('div');
			time.setAttribute('class', 'time');
			time.appendChild(createParagraph(register.date.split('-').reverse().join('/')));
			time.appendChild(createSpan(register.time));
				
		const ul = document.createElement('ul');
			const info = document.createElement('div');
			info.appendChild(createParagraph(register.guardianStudent)).setAttribute('class', 'name');
			info.appendChild(createSpan("Aluno: " + register.studentName));

		const div = action();

		li.appendChild(time);
		ul.appendChild(info);
		ul.appendChild(div);
		li.appendChild(ul);
		form.orderedList().appendChild(li);
}

function createMeetingListItem(register) {
	html += "<br><div class='contact-pdf'><b>" + register.guardianStudent + "</b>" +
		"<p>Data: " + register.date.split('-').reverse().join('/') + 
		"<p>Hora: " + register.time +
		"<p>Aluno: " + register.studentName +
		"<p>Curso: " + register.grade + " " + register.course +
		"<p>Celular do responsável: " + register.guardianPhone +
		"<p>Assunto: " + register.subject + "</div><br>";

	const li = document.createElement('li');
	li.id = register.uid;
	confirmRemoveRegister(register);
	//visualizar reunião
	li.addEventListener('click', () => {
		uid = register.uid; //enviar esse valor para editMeeting() e localizar a reunião para editar
	
		form.studentNameView().innerHTML = " " + register.studentName;
		form.timeView().innerHTML = " " + register.time;
		form.dateView().innerHTML = " " + register.date.split('-').reverse().join('/');
		form.guardianStudentView().innerHTML = " " + register.guardianStudent;
		form.guardianPhoneView().innerHTML = " " + register.guardianPhone;
		form.gradeView().innerHTML = " " + register.grade + " " + register.course;
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
		form.titulo().innerHTML = "Editar reunião";
		form.studentName().value = register.studentName;
		form.time().value = register.time;
		form.date().value = register.date;
		form.guardianStudent().value = register.guardianStudent;
		form.guardianPhone().value = register.guardianPhone;
		form.grade().value = register.grade;
		form.course().value = register.course;
		form.subject().value = register.subject;
			
		//salvar alterações da reunião
		saveButton.addEventListener('click', () => {
			updateMeeting();
		})
}

function removeRegister(register) {
	meetingService.remove(register)
	.then(() => {
		document.getElementById(register.uid).remove();
		window.location.href = "agenda.html";
	})
}

function updateMeeting() {
	if (form.studentName().value == "" || form.date().value == "" || form.time().value == "" || form.guardianStudent().value == "") {
        alert("Preencha os campos obrigatórios");
    } else {
		const register = createMeeting();
		meetingService.update(register)
		.then(() => {
			window.location.href = "agenda.html";
		})
		.catch(() => {
			alert('Erro ao atualizar reunião');
		});
	}
}

function saveMeeting() {
	if (form.studentName().value == "" || form.date().value == "" || form.time().value == "" || form.guardianStudent().value == "") {
        alert("Preencha os campos obrigatórios");
    } else {
    	const register = createMeeting();

    	meetingService.save(register)
   		.then(() => {
   			window.location.href = "agenda.html";
   		})
   		.catch(() => {
   			alert("Erro ao cadastrar reunião");
   		})
    }
}

function registerModal() {
	form.titulo().innerHTML = "Nova reunião";
	form.studentName().value = "";
	form.time().value = "";
	form.date().value = "";
	form.guardianStudent().value = "";
	form.guardianPhone().value = "";
	form.grade().value = "";
	form.course().value = "";
	form.subject().value = "";

	saveButton.addEventListener('click', () => {
		saveMeeting();
	})
}

function createMeeting() {
	return {
    	studentName: form.studentName().value,
    	time: form.time().value,
    	date: form.date().value,
    	guardianStudent: form.guardianStudent().value,
    	guardianPhone: form.guardianPhone().value,
    	grade: form.grade().value,
    	course: form.course().value,
   		subject: form.subject().value,
   		user: {
   			uid: firebase.auth().currentUser.uid
   		}
	};
}