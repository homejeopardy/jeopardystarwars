const categories = {
   
    {
    "Islands": {
        100: ["This island is home to the Statue of Liberty.", "What is Liberty Island?"],
        200: ["Hawaii’s largest island is often called this.", "What is the Big Island?"],
        300: ["This island nation is known as the Land of the Rising Sun.", "What is Japan?"],
        400: ["This island was Napoleon Bonaparte’s place of exile after his defeat in 1815.", "What is Saint Helena?"],
        500: ["The world’s second-largest island, shared by Indonesia and Papua New Guinea.", "What is New Guinea?"]
    },
    "Star Wars": {
        100: ["This droid is fluent in over six million forms of communication.", "Who is C-3PO?"],
        200: ["The Sith homeworld, where Emperor Palpatine’s final stronghold was located.", "What is Exegol?"],
        300: ["This Mandalorian bounty hunter was the original donor for the Republic’s clone army.", "Who is Jango Fett?"],
        400: ["The color of Mace Windu’s unique lightsaber.", "What is purple?"],
        500: ["The Jedi High Council met in a temple located on this planet.", "What is Coruscant?"]
    },
    "Fruit": {
        100: ["This fruit is known for keeping doctors away.", "What is an apple?"],
        200: ["Strawberries are unique because their seeds are found here.", "What is on the outside?"],
        300: ["This tropical fruit has a spiky exterior but sweet, juicy flesh inside.", "What is a pineapple?"],
        400: ["This green fruit is commonly mistaken for a vegetable and is used to make guacamole.", "What is an avocado?"],
        500: ["This small, dark purple fruit is used to make prunes.", "What are plums?"]
    },
    "Animal Facts": {
        100: ["This large land mammal is known for its long trunk.", "What is an elephant?"],
        200: ["A group of lions is called this.", "What is a pride?"],
        300: ["This flightless bird is the fastest runner of all birds.", "What is an ostrich?"],
        400: ["This marine animal can change colors and blend into its surroundings.", "What is an octopus?"],
        500: ["This is the only mammal capable of true flight.", "What is a bat?"]
    },
    "Math": {
        100: ["The sum of angles in a triangle always adds up to this many degrees.", "What is 180?"],
        200: ["This mathematical constant, approximately 3.14159, represents the ratio of a circle’s circumference to its diameter.", "What is pi?"],
        300: ["The square root of 144.", "What is 12?"],
        400: ["In algebra, the term for a number that multiplies a variable.", "What is a coefficient?"],
        500: ["The mathematical name for a polygon with 12 sides.", "What is a dodecagon?"]
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
