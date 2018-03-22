document.addEventListener("DOMContentLoaded", function () {

    var taskListLocalStorageKey = 'to_do_list';

    //*funkcje*****************************************************************************

    //chowanie i pokazywanie formularza
    function toggleFormSection() {
        form.hidden = !form.hidden;
    }


    //dodawanie rzędów do wyświetlanej na stronie tabeli z zadaniami
    var listOfTasks = document.querySelector("tbody");

    function addTaskToList(task) {
        var tr = document.createElement("tr");
        var taskTitle = document.createElement("td");
        var taskDate = document.createElement("td");
        var taskPriority = document.createElement("td");
        var taskDescription = document.createElement("td");
        var checkboxTd = document.createElement("td");
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = "undone";
        var deleteTd = document.createElement("td");
        var deleteTask = document.createElement('input');
        deleteTask.type = "submit";
        deleteTask.name = "delete";
        deleteTask.value = "Usuń";

        taskDate.className = "text-centered";
        taskPriority.className = "text-centered";

        checkboxTd.appendChild(checkbox);
        deleteTd.appendChild(deleteTask);
        taskTitle.innerText = task.title;
        taskDate.innerText = task.date;
        taskPriority.innerText = task.priority;
        taskDescription.innerText = task.description;

        tr.appendChild(taskTitle);
        tr.appendChild(taskDate);
        tr.appendChild(taskPriority);
        tr.appendChild(taskDescription);
        tr.appendChild(checkboxTd);
        tr.appendChild(deleteTd);

        listOfTasks.appendChild(tr);
    }


    // funkcja dodająca error
    function addErrorMsg(place, content) {
        var element = document.createElement('div');
        element.innerText = content;
        place.appendChild(element);
    }


    // funkcja zapisu do local storage
    function addToLocalStorage(data) {
        localStorage.setItem(taskListLocalStorageKey, JSON.stringify(data));
    }

    //************************************************************************************

    var form = document.querySelector("form"); // główny formularz
    var add_button = document.querySelector(".add"); // przycisk "Dodaj zadanie"
    var reset_task = document.getElementById("reset-task"); // przycisk "Wyczyść formularz"


    form.hidden = true; // Domyślnie ukrywa formularz po załadowaniu strony


    add_button.addEventListener("click", toggleFormSection); // Formularz pokazuje się po wciśnięciu przycisku "Dodaj zadanie"


    //wczytanie danych z local storage
    var storage = JSON.parse(localStorage.getItem(taskListLocalStorageKey));
    var table = document.querySelector(".list");


    //jeżeli brak danych w local storage tworzymy nową pustą tablicę, counter ustawiamy na 0, ukrywamy tabelę
    if (storage === null) {
        var tasks = [];
        var idCounter = 0;
        table.hidden = true;
    } else {
        //do zmiennej task przypisujemy dane z local storage i na ich podstawie ustawiamy licznik id
        tasks = storage;
        idCounter = tasks[tasks.length - 1].id + 1;
    }


    // Zapisywanie danych z formularza do tablicy

    // potrzebne pola
    var title = document.getElementById('task-name');
    var date = document.getElementById('task-date');
    var select = document.getElementById("select");
    var description = document.getElementById('task-description');
    var errorMessage = document.querySelectorAll('.error-message');

    var taskError = document.querySelector('.error-0');
    var termError = document.querySelector('.error-1');
    var priorityError = document.querySelector('.error-2');
    var descriptionError = document.querySelector('.error-3');


    // obecna data, potrzebne do walidacji

    var getDate = new Date();
    var year = getDate.getUTCFullYear();
    var month = getDate.getUTCMonth() + 1;
    var day = getDate.getUTCDate();
    var currentDate;

    if (month.toString().length === 1 && day.toString().length === 1) {
        currentDate = `${year}-0${month}-0${day}`;
    } else if (month.toString().length === 1) {
        currentDate = `${year}-0${month}-${day}`;
    } else if (day.toString().length === 1) {
        currentDate = `${year}-${month}-0${day}`;
    }

    console.log(currentDate.substr(8, 2));

    //wyświetlanie tabeli z zadaniami z local storage

    for (var taskIndex in tasks) {
        addTaskToList(tasks[taskIndex]);
    }



    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var error = false;
        errorMessage.forEach(function (element, key) {
            errorMessage[key].innerText = '';
        });

        // nowy obiekt

        var newTask = {};

        // walidacja dodawanie wartości do obiektu

        newTask.id = idCounter;

        // tytuł

        if (title.value.length < 5) {
            addErrorMsg(taskError, 'Tytuł musi zawierać minimum 5 znaków.');
            error = true;
        } else if (title.value.trim().length === 0) {
            addErrorMsg(taskError, 'Tytuł nie może zawierać wyłącznie białych znaków.');
            error = true;
        } else {
            newTask.title = title.value;
        }

        // data

        if (date.value === '') {
            addErrorMsg(termError, 'Musisz podać datę.');
            error = true;
        } else if (currentDate.substr(0, 4) > date.value.substr(0, 4) || currentDate.substr(5, 2) > date.value.substr(5, 2) || currentDate.substr(8, 2) > date.value.substr(8, 2)) {
            addErrorMsg(termError, 'nie możesz podać wstecznej daty.');
            error = true;
        } else {
            newTask.date = date.value;
        }
        console.log(date.value);

        // priorytet

        if (select.value === '0') {
            addErrorMsg(priorityError, 'Musisz wybrać priorytet zadania.');
            error = true;
        } else {
            newTask.priority = select.options[select.selectedIndex].value;
        }

        // opis

        if (description.value.length < 10) {
            addErrorMsg(descriptionError, 'Opis musi zawierać minimum 10 znaków.');
            error = true;
        } else if (description.value.trim().length === 0) {
            addErrorMsg(descriptionError, 'Tytuł nie może zawierać wyłącznie białych znaków.');
            error = true;
        } else {
            newTask.description = description.value;
        }

        newTask.done = false;

        // dodawanie obiektu do tablicy
        // czyszczenie formularza po potwierdzeniu dodania zadania tylko gdy brak błędów
        // zwiększenie licznika id też tylko w przypadku braku błędów
        // po dodaniu poprawnego zadania zapis do local storage i wyświetlenie w tabeli
        if (!error) {
            tasks.push(newTask);
            idCounter++;
            title.value = '';
            date.value = '';
            select.value = '0';
            description.value = '';
            addToLocalStorage(tasks);
            addTaskToList(newTask);
            table.hidden = false;
            toggleFormSection();
        }
    });

    // czyszczenie zadania

    reset_task.addEventListener('click', function (e) {
        e.preventDefault();

        title.value = '';
        date.value = '';
        select.value = '0';
        description.value = '';
        errorMessage.forEach(function (element, key) {
            errorMessage[key].innerText = '';
        });

    });

    //czyszczenie listy zadań i local storage

    var clearButton = document.querySelector(".remove-all");

    clearButton.addEventListener("click", function () {
        localStorage.setItem(taskListLocalStorageKey, null);
        tasks = [];
        listOfTasks.innerHTML = "";
        table.hidden = true;
    });

    // checkbox w zadaniu

    var checkboxes = document.querySelectorAll('input[type=checkbox]');

    checkboxes.forEach(function (element, key) {
        element.addEventListener('click', function (e) {
            if (element.checked) {
                element.parentElement.parentElement.style.backgroundColor = 'lightgrey';
                element.parentElement.style.backgroundColor = 'lightgreen';
                element.parentElement.parentElement.style.color = 'gray';
                tasks[key].done = true;
            } else {
                element.parentElement.parentElement.style.backgroundColor = 'transparent';
                element.parentElement.style.backgroundColor = 'transparent';
                element.parentElement.parentElement.style.color = 'black';
                tasks[key].done = false;
            }
        });
    });

    //usuwanie wybranego zadania z tabeli i local storage

    var deleteTask = document.querySelectorAll('input[name=delete]');

    deleteTask.forEach(function (button, key) {
        button.addEventListener("click", function() {
            if (tasks[key].done === true) {
                listOfTasks.removeChild(this.parentElement.parentElement);
                //localStorage.removeItem(taskListLocalStorageKey); //Aktualnie usuwa całą zawartość local storage
            }
        });
    });
});
