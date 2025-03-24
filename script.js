const categories = {
    "The Skywalker Saga": {
        100: ["The podracing event Anakin Skywalker won on Tatooine.", "What is the Boonta Eve Classic?"],
        200: ["The Jedi Master who trained Qui-Gon Jinn.", "Who is Count Dooku?"],
        300: ["The Sith Lord who trained Emperor Palpatine.", "Who is Darth Plagueis?"],
        400: ["The name of Padmé Amidala's home planet.", "What is Naboo?"],
        500: ["The planet where Obi-Wan Kenobi defeats Anakin Skywalker in *Revenge of the Sith*.", "What is Mustafar?"]
    },
    "The Force": {
        100: ["The mysterious species of Jedi Master Yoda.", "What is unknown?"],
        200: ["The Sith homeworld introduced in *The Rise of Skywalker*.", "What is Exegol?"],
        300: ["The ability that allows Jedi and Sith to influence minds.", "What is a Jedi Mind Trick?"],
        400: ["This Force-sensitive warrior was neither Jedi nor Sith and wielded white lightsabers.", "Who is Ahsoka Tano?"],
        500: ["The powerful entity that represented the Light Side of the Force in *The Clone Wars*.", "Who is the Daughter?"]
    },
    "Ships & Vehicles": {
        100: ["The model of the Millennium Falcon.", "What is a YT-1300 Light Freighter?"],
        200: ["The heavily modified ship used by Boba Fett.", "What is Slave I?"],
        300: ["Darth Vader’s personal TIE Fighter.", "What is the TIE Advanced x1?"],
        400: ["The name of General Grievous’ flagship in *Revenge of the Sith*.", "What is the Invisible Hand?"],
        500: ["The stolen Imperial shuttle the Rebels used to sneak onto Endor.", "What is Tydirium?"]
    },
    "Famous Quotes": {
        100: ["'There’s always a bigger fish.'", "Who is Qui-Gon Jinn?"],
        200: ["'So this is how liberty dies... with thunderous applause.'", "Who is Padmé Amidala?"],
        300: ["'Let the past die. Kill it if you have to.'", "Who is Kylo Ren?"],
        400: ["'You were the Chosen One! It was said that you would destroy the Sith, not join them!'", "Who is Obi-Wan Kenobi?"],
        500: ["'In my experience, there’s no such thing as luck.'", "Who is Obi-Wan Kenobi?"]
    },
    "The Clone Wars": {
        100: ["The planet where the Clone Army was created.", "What is Kamino?"],
        200: ["The Clone Trooper who removed his inhibitor chip and helped Ahsoka escape Order 66.", "Who is Captain Rex?"],
        300: ["The Sith Lord who oversaw the creation of the Clone Army.", "Who is Count Dooku?"],
        400: ["The Mandalorian warrior who wielded the Darksaber and ruled Mandalore before the Clone Wars.", "Who is Pre Vizsla?"],
        500: ["The Kaminoan scientist who secretly programmed the inhibitor chips in Clone Troopers.", "Who is Nala Se?"]
    }
};

let teams = {};
let currentQuestion = null;
let currentPoints = 0;
let currentButton = null; // Stores the clicked button

document.getElementById("add-team").addEventListener("click", addTeam);
document.getElementById("start-game").addEventListener("click", startGame);

function addTeam() {
    const teamInputs = document.getElementById("team-inputs");
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Team Name";
    teamInputs.appendChild(input);
}

function startGame() {
    const teamInputs = document.querySelectorAll("#team-inputs input");
    if (teamInputs.length === 0) return;

    teams = {};
    const teamSelect = document.getElementById("team-select");
    teamSelect.innerHTML = "";
    document.getElementById("scores").innerHTML = "";

    teamInputs.forEach(input => {
        if (input.value.trim() !== "") {
            const name = input.value.trim();
            teams[name] = 0;

            const scoreDiv = document.createElement("div");
            scoreDiv.className = "team";
            scoreDiv.id = `team-${name}`;
            scoreDiv.innerText = `${name}: $0`;
            document.getElementById("scores").appendChild(scoreDiv);

            const option = document.createElement("option");
            option.value = name;
            option.innerText = name;
            teamSelect.appendChild(option);
        }
    });

    document.getElementById("setup").style.display = "none";
    document.getElementById("game").style.display = "block";
    generateBoard();
}

function generateBoard() {
    const board = document.getElementById("jeopardy-board");
    board.innerHTML = '';

    Object.keys(categories).forEach(category => {
        let header = document.createElement("div");
        header.className = "category";
        header.innerText = category;
        board.appendChild(header);
    });

    for (let points of [100, 200, 300, 400, 500]) {
        Object.keys(categories).forEach(category => {
            let button = document.createElement("button");
            button.className = "question";
            button.innerText = `$${points}`;
            button.setAttribute("data-category", category);
            button.setAttribute("data-points", points);
            button.onclick = showQuestion;
            board.appendChild(button);
        });
    }
}

function showQuestion(event) {
    currentButton = event.target; // Store the clicked button
    const category = currentButton.getAttribute("data-category");
    const points = parseInt(currentButton.getAttribute("data-points"));

    currentQuestion = category;
    currentPoints = points;

    // Play the Jeopardy theme song
    const jeopardyTheme = document.getElementById("jeopardy-theme");
    jeopardyTheme.play();

    document.getElementById("question-text").innerText = categories[category][points][0];
    document.getElementById("popup").style.display = "block";
}

function showAnswer() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("answer-text").innerText = categories[currentQuestion][currentPoints][1];
    document.getElementById("answer-popup").style.display = "block";

    // Stop the Jeopardy theme song
    const jeopardyTheme = document.getElementById("jeopardy-theme");
    jeopardyTheme.pause();
    jeopardyTheme.currentTime = 0; // Reset audio to start
}

function updateScore(correct) {
    const team = document.getElementById("team-select").value;
    teams[team] += correct ? currentPoints : -currentPoints;
    document.getElementById(`team-${team}`).innerText = `${team}: $${teams[team]}`;

    // Close the answer pop-up after scoring
    document.getElementById("answer-popup").style.display = "none";

    // Disable the button permanently after the question has been answered
    if (currentButton) {
        currentButton.disabled = true;
        currentButton.style.backgroundColor = "#222"; // Change to a "used" style
        currentButton.style.cursor = "not-allowed";
    }
}
