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

    var tasks = [];

    new_task.addEventListener('click', function (e) {

        e.preventDefault();
        
        // potrzebne pola

        var title = document.getElementById('task-name');
        var date = document.getElementById('task-date');
        var select = document.getElementById("select");
        var description = document.getElementById('task-description');
        
        // nowy obiekt
        
        var newObject = {};
        
        // dodawanie wartości do obiektu

        newObject.id = tasks.length +1;
        newObject.title = title.value;
        newObject.date = date.value;
        newObject.priority = select.options[select.selectedIndex].value;
        newObject.description = description.value;
        newObject.done = false;

        // dodawanie obiektu do tablicy
        
        tasks.push(newObject);
        
        // czyszczenie wartości pól, done ma domyślnie false, id rośnie o 1.
        
        title.value = '';
        date.value = '';
        select.value = '1';
        description.value = '';
        
    });

});
