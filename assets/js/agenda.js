function logout() {
	firebase.auth().signOut().then(() => {
		window.location.href = "../index.html";
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
	meetingService.findByUser(user)
		.then(meetings => {
			//hideLoading();
			addMeetingsToScreen(meetings);
		})
		.catch(error => {
			//hideLoading();
			console.log(error);
			alert("Erro ao recuperar reuniões");
		})
	form.savePdf().addEventListener('click', () => {
		doc.fromHTML(form.pdfContent(), 25, 20)
		doc.output("dataurlnewwindow")
	})
}

var uid

function addMeetingsToScreen(meetings) { 
	$(form.pdfContent()).append("<h5 style='color: gray; margin: 0;'>Reuniões</h5>");

	const orderedList = document.getElementById('cards');
	meetings.forEach(register => {
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
		orderedList.appendChild(li);
	});
}

function createMeetingListItem(register) {
	$(form.pdfContent()).append("<text><b>" + register.guardianStudent + "</b>" +
		"<br>Aluno: " + register.studentName +
		"<br>Data: " + register.date +
		"<br>Hora: " + register.time +
		"<p>");
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
	//showLoading();
	meetingService.remove(register)
	.then(() => {
		//hideLoading();
		document.getElementById(register.uid).remove();
		window.location.href = "agenda.html";
	})
}

function updateMeeting() {
	const register = createMeeting();
	//showLoading();
    meetingService.update(register)
    .then(() => {
        //hideLoading();
        window.location.href = "agenda.html";
    })
   .catch(() => {
        //hideLoading();
        alert('Erro ao atualizar reunião');
    });
}

function saveMeeting() {
	//showLoading();
	if (form.studentName().value == "" || form.date().value == "") {
        alert("Preencha os campos obrigatórios");
    } else {
    	const register = createMeeting();

    	meetingService.save(register)
   		.then(() => {
   			//hideLoading();
   			window.location.href = "agenda.html";
   		})
   		.catch(() => {
   			//hideLoading();
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