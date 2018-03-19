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

});