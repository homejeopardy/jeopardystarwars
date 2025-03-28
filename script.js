const categories = {
   
    "Jedi & Sith": {
        100: ["The color of a Jedi Guardian’s lightsaber.", "What is blue?"],
        200: ["Darth Maul wielded this unique type of lightsaber.", "What is a double-bladed lightsaber?"],
        300: ["This Jedi Master defeated Emperor Palpatine in *Revenge of the Sith*—at least temporarily.", "Who is Mace Windu?"],
        400: ["The Sith homeworld, known for its dark side energy and ancient temples.", "What is Korriban (or Moraband)?"],
        500: ["This Jedi, often referred to as ‘The Negotiator,’ fought in the Clone Wars.", "Who is Obi-Wan Kenobi?"]
    },
    "Galactic Battles": {
        100: ["The climactic space battle in *A New Hope* was fought over this planet.", "What is Yavin IV?"],
        200: ["The Rebel Alliance destroyed the second Death Star in this battle.", "What is the Battle of Endor?"],
        300: ["This planet saw the first clash between the Separatists and the Republic in *Attack of the Clones*.", "What is Geonosis?"],
        400: ["The planet where the Resistance launched a desperate last stand in *The Last Jedi*.", "What is Crait?"],
        500: ["The legendary Sith fleet was hidden on this planet in *The Rise of Skywalker*.", "What is Exegol?"]
    },
    "Droids": {
        100: ["The golden protocol droid fluent in over six million forms of communication.", "Who is C-3PO?"],
        200: ["The astromech droid that accompanied Luke Skywalker on many adventures.", "Who is R2-D2?"],
        300: ["The black BB-series droid used by the First Order.", "Who is BB-9E?"],
        400: ["The assassin droid that later became a protector of Grogu in *The Mandalorian*.", "Who is IG-11?"],
        500: ["The Separatist leader who commanded an army of battle droids.", "Who is General Grievous?"]
    },
    "Planets & Locations": {
        100: ["The Wookiee homeworld, seen in *Revenge of the Sith*.", "What is Kashyyyk?"],
        200: ["The swampy world where Luke trained with Yoda.", "What is Dagobah?"],
        300: ["The desert planet where Rey scavenged before joining the Resistance.", "What is Jakku?"],
        400: ["The capital of the Galactic Republic and later the Empire.", "What is Coruscant?"],
        500: ["The volcanic planet where Anakin Skywalker was defeated by Obi-Wan Kenobi.", "What is Mustafar?"]
    },
    "Creatures & Aliens": {
        100: ["Jabba the Hutt belongs to this slug-like species.", "What is a Hutt?"],
        200: ["These fierce, fur-covered warriors helped defeat the Empire on Endor.", "What are Ewoks?"],
        300: ["The amphibious species native to Naboo, represented by Jar Jar Binks.", "What are Gungans?"],
        400: ["The beast that nearly devoured Luke in Jabba’s palace.", "What is a Rancor?"],
        500: ["The massive sand-dwelling creature that swallowed Boba Fett.", "What is a Sarlacc?"]
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
