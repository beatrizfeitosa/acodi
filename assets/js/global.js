$("#guardian-phone").mask('(00) 00000-0000');
$("#rm").mask('00000');

const inputSearch = document.querySelector(".search-box input");
const todosContainer = document.getElementById("cards");

const filterTodos = (todos, inputValue, returnMatchedTodos) => todos
	.filter(todo => {
		const matchedTodos = todo.querySelector(".name").textContent.toLowerCase().includes(inputValue)
		return returnMatchedTodos ? matchedTodos : !matchedTodos
	})

const manipulateClasses = (todos, classToAdd, classToRemove) => {
	todos.forEach(todo => {
			todo.classList.remove(classToRemove)
			todo.classList.add(classToAdd)
	})
}

const hideTodos = (todos, inputValue) => {
	const todosToHide = filterTodos(todos, inputValue, false)
	manipulateClasses(todosToHide, 'hidden', 'd-flex')
}

const showTodos = (todos, inputValue) => {
	const todosToShow= filterTodos(todos, inputValue, true)
	manipulateClasses(todosToShow, 'd-flex', 'hidden')
}

inputSearch.addEventListener('input', event => {
	const inputValue = event.target.value.trim().toLowerCase()
	const todos = Array.from(todosContainer.children)
	
	hideTodos(todos, inputValue)
	showTodos(todos, inputValue)
})

function createParagraph(value) {
	const element = document.createElement('p');
	element.innerHTML = value;
	return element;
}

function createSpan(value) {
	const element = document.createElement('span');
	element.innerHTML = value;
	return element;
}

firebase.auth().onAuthStateChanged(user => {
	if (user) {
		findRegisters(user);
	}
})

//botões dos cards
function action() {
	const div = document.createElement('div');
			div.setAttribute('class', 'queries');

			const view = document.createElement('button');
				view.setAttribute('data-bs-toggle', 'modal');
				view.setAttribute('data-bs-target', '#modalView');
				view.setAttribute('class', 'action');
				const eye = document.createElement('img');
					eye.setAttribute('src', '../assets/images/eye.svg');
				view.appendChild(eye);

			const edit = document.createElement('button');
				edit.setAttribute('id', 'updateButton');
				edit.setAttribute('data-bs-toggle', 'modal');
				edit.setAttribute('data-bs-target', '#modalRegister');
				edit.setAttribute('class', 'action');
				const pencil = document.createElement('img');
					pencil.setAttribute('src', '../assets/images/pencil.svg');
				edit.appendChild(pencil);

			const del = document.createElement('button');
				del.setAttribute('class', 'action');
				del.setAttribute('id', 'removeButton');
				del.setAttribute('data-bs-toggle', 'modal');
				del.setAttribute('data-bs-target', '#askRemoveRegister');
				const trash = document.createElement('img');
					trash.setAttribute('src', '../assets/images/trash.svg');
				del.appendChild(trash);
			div.appendChild(view);
			div.appendChild(edit);
			div.appendChild(del);
		return div;
}

//modal
function confirmRemoveRegister(register) {
	yesRemoveCard.addEventListener('click', () => {
		removeRegister(register);
	})
}

function onChangeDate() {
	const date = form.date().value;
	form.dateRequiredError().style.display = !date ? "block" : "none";
}

function onChangeName() {
	const studentName = form.studentName().value;
	form.nameRequiredError().style.display = !studentName ? "block" : "none";
}

const form = {
	titulo: () => document.getElementById('modal-title'),
	saveButton: () => document.getElementById('saveButton'),
	studentName: () => document.getElementById('student-name'),
	nameRequiredError: () => document.getElementById('name-required-error'),
	rm: () => document.getElementById('rm'), //home
	time: () => document.getElementById('time'), //agenda
	date: () => document.getElementById('date'),
	dateRequiredError: () => document.getElementById('date-required-error'),
	guardianStudent: () => document.getElementById('guardian-student'),
	guardianPhone: () => document.getElementById('guardian-phone'),
	grade: () => document.getElementById('grade'),
	course: () => document.getElementById('course'),
	subject: () => document.getElementById('subject'),
	studentNameView: () => document.getElementById('student-name-view'),
	rmView: () => document.getElementById('rm-view'), //home
	timeView: () => document.getElementById('time-view'), //agenda
	dateView: () => document.getElementById('date-view'),
	guardianStudentView: () => document.getElementById('guardian-student-view'),
	guardianPhoneView: () => document.getElementById('guardian-phone-view'),
	gradeView: () => document.getElementById('grade-course-view'),
	subjectView: () => document.getElementById('subject-view'),
	updateButton: () => document.getElementById("updateButton"),
	yesRemoveCard: () => document.getElementById("yesRemoveCard"),
	whatsapp: () => document.getElementById("whatsapp"),
	pdfContent: () => document.getElementById('pdf-content'),
	savePdf: () => document.getElementById('save-pdf'),
	orderedList: () => document.getElementById('cards'),
	li: () => document.createElement('li')
}