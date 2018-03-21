document.addEventListener("DOMContentLoaded", function () {

    var form = document.querySelector("form"); // główny formularz
    var add_button = document.querySelector(".add"); // przycisk "Dodaj zadanie"
    var new_task = document.getElementById("new-task"); // przycisk "Potwierdź dodanie zadania"
    var reset_task = document.getElementById("reset-task"); // przycisk "Wyczyść formularz"

    form.hidden = true; // Domyślnie ukrywa formularz po załadowaniu strony

    function toggleFormSection() {
        form.hidden = !form.hidden;
    }

    add_button.addEventListener("click", toggleFormSection); // Formularz pokazuje się po wciśnięciu przycisku "Dodaj zadanie"

    // #0 Zapisywanie danych z formularza do tablicy

    // potrzebne pola

    var title = document.getElementById('task-name');
    var date = document.getElementById('task-date');
    var select = document.getElementById("select");
    var description = document.getElementById('task-description');
    var errorMessage = document.querySelectorAll('.error-message');
    console.log(errorMessage);

    var taskError = document.querySelector('.error-0');
    var termError = document.querySelector('.error-1');
    var priorityError = document.querySelector('.error-2');
    var descriptionError = document.querySelector('.error-3');

    // obecna data, potrzebne do walidacji

    var getDate = new Date();
    var year = getDate.getUTCFullYear();
    var month = getDate.getUTCMonth() + 1;
    var day = getDate.getUTCDate();
    var currentDate = `${year}-${month}-${day}`;

    // jeżeli są dane w local storage pobieramy je i to jest nasza tablica tasks
    // jeżeli nie, tworzymy nową pustą tablicę
    if (JSON.parse( localStorage.getItem('todo_list') ) === null) {
        var tasks = [];
    } else {
        tasks = JSON.parse( localStorage.getItem('todo_list'));
    }

    console.log(tasks);
    var idCounter = 0;

    // funkcja dodająca error

    function addErrorMsg(place, content) {
        var element = document.createElement('div');
        element.innerText = content;
        place.appendChild(element);
    }

    // funkcja zapisu do local storage
    function addToLocalStorage(data) {
        localStorage.setItem('todo_list', JSON.stringify(data));
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var error = false;
        errorMessage.forEach(function (element, key) {
            errorMessage[key].innerText = '';
        });

        // nowy obiekt

        var newObject = {};

        // walidacja dodawanie wartości do obiektu

        newObject.id = idCounter;

        // tytuł

        if (title.value.length < 5) {
            addErrorMsg(taskError, 'Tytuł musi zawierać minimum 5 znaków.');
            error = true;
        } else if (!title.value.replace(/^\s+|\s+$/g, "")) {
            addErrorMsg(taskError, 'Tytuł nie może zawierać wyłącznie białych znaków.');
            error = true;
        } else {
            newObject.title = title.value;
        }

        // data

        if (date.value === '') {
            addErrorMsg(termError, 'Musisz podać datę.');
            error = true;
        } else {
            newObject.date = date.value;
        }

        // priorytet

        if (select.value === '0') {
            addErrorMsg(priorityError, 'Musisz wybrać priorytet zadania.');
            error = true;
        } else {
            newObject.priority = select.options[select.selectedIndex].value;
        }

        // opis

        if (title.value.length < 10) {
            addErrorMsg(descriptionError, 'Opis musi zawierać minimum 10 znaków.');
            error = true;
        } else if (!title.value.replace(/^\s+|\s+$/g, "")) {
            addErrorMsg(descriptionError, 'Tytuł nie może zawierać wyłącznie białych znaków.');
            error = true;
        } else {
            newObject.description = description.value;
        }
        newObject.done = false;

        // dodawanie obiektu do tablicy
        // czyszczenie formularza po potwierdzeniu dodania zadania tylko gdy brak błędów
        // zwiększenie licznika id też tylko w przypadku braku błędów
        // po dodaniu poprawnego zadania zapis do local storage
        if (!error) {
            tasks.push(newObject);
            idCounter++;
            title.value = '';
            date.value = '';
            select.value = '0';
            description.value = '';
            addToLocalStorage(tasks);
        }
        console.log(tasks);
        // czyszczenie wartości pól, done ma domyślnie false, id rośnie o 1.

    });

    // czyszczenie zadania

    reset_task.addEventListener('click', function (e) {
        e.preventDefault();

        title.value = '';
        date.value = '';
        select.value = '0';
        description.value = '';
        form.hidden = false;
        errorMessage.forEach(function (element, key) {
            errorMessage[key].innerText = '';
        });

    });

    // ukrycie tabeli

    var table = document.querySelector(".list");

    table.hidden = true;

    // pokazanie tabeli gdy local storage nie jest pusty

    function toggleTableSection() {
        if (!(JSON.parse( localStorage.getItem('todo_list') ) === null)) {
            table.hidden = false;
        }
    }

    toggleTableSection();

    //funkcja odczytu local storage

    function getLocalStorage() {
            var tasks = JSON.parse(localStorage.getItem('todo_list'));
            for (var key in tasks) {
                var list = document.querySelector("tbody");
                var tr = document.createElement("tr");
                var id = document.createElement("td");
                var title = document.createElement("td");
                var date = document.createElement("td");
                var priority = document.createElement("td");
                var description = document.createElement("td");

                id.className="text-centered";
                date.className="text-centered";
                priority.className="text-centered";

                id.innerText = tasks[key].id;
                title.innerText = tasks[key].title;
                date.innerText = tasks[key].date;
                priority.innerText = tasks[key].priority;
                description.innerText = tasks[key].description;

                tr.appendChild(id);
                tr.appendChild(title);
                tr.appendChild(date);
                tr.appendChild(priority);
                tr.appendChild(description);

                list.appendChild(tr);
            }
    }

    getLocalStorage();
    
});