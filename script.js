const categories = {
   
    "Clone Wars": {
        100: ["This former Jedi led the Separatist army during the Clone Wars.", "Who is Count Dooku?"],
        200: ["This clone trooper captain served under Anakin Skywalker.", "Who is Captain Rex?"],
        300: ["The Clone Wars officially ended after this infamous event.", "What is Order 66?"],
        400: ["This Jedi Padawan, once Anakin’s apprentice, left the Jedi Order before the Clone Wars ended.", "Who is Ahsoka Tano?"],
        500: ["The planet where the first battle of the Clone Wars took place.", "What is Geonosis?"]
    },
    "Ray": {
        100: ["Rey’s home planet, where she scavenged for a living.", "What is Jakku?"],
        200: ["The weapon Rey wields as a Jedi.", "What is a lightsaber?"],
        300: ["The identity of Rey’s grandfather.", "Who is Emperor Palpatine?"],
        400: ["The ancient Jedi texts Rey recovered were found on this planet.", "What is Ahch-To?"],
        500: ["Rey adopts this last name at the end of *The Rise of Skywalker*.", "What is Skywalker?"]
    },
    "Death Star": {
        100: ["The Death Star was first introduced in this original trilogy film.", "What is *A New Hope*?"],
        200: ["The Death Star’s superlaser was powered by this rare crystal.", "What is a kyber crystal?"],
        300: ["The small thermal exhaust port that led to the Death Star’s destruction was designed as sabotage by this scientist.", "Who is Galen Erso?"],
        400: ["The second Death Star was destroyed during this battle.", "What is the Battle of Endor?"],
        500: ["The moon-sized Death Star was first constructed under the orders of this leader.", "Who is Emperor Palpatine?"]
    },
    "The First Order": {
        100: ["The First Order rose from the remnants of this defeated faction.", "What is the Galactic Empire?"],
        200: ["The supreme leader of the First Order at the start of *The Force Awakens*.", "Who is Snoke?"],
        300: ["This massive base served as the First Order’s primary weapon.", "What is Starkiller Base?"],
        400: ["This stormtrooper abandoned his post and later became a Resistance hero.", "Who is Finn?"],
        500: ["Kylo Ren led this elite group of warriors within the First Order.", "Who are the Knights of Ren?"]
    },
    "Palpatine": {
        100: ["Palpatine’s Sith name.", "Who is Darth Sidious?"],
        200: ["The planet where Palpatine was supposedly killed in *Return of the Jedi*.", "What is the Death Star II (over Endor)?"],
        300: ["The Jedi Knight Palpatine manipulated into becoming Darth Vader.", "Who is Anakin Skywalker?"],
        400: ["Palpatine disguised himself as this high-ranking politician before revealing himself as a Sith Lord.", "Who is the Chancellor of the Republic?"],
        500: ["In *The Rise of Skywalker*, Palpatine’s hidden stronghold is located on this planet.", "What is Exegol?"]
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
