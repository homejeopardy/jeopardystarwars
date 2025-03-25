const categories = {
    "The Skywalker Saga": {
        100: ["Luke and Anakin Skywalker both called this arid planet home.", "What is Tatooine?"],
        200: ["Before becoming Darth Vader, this Jedi was a skilled pilot and warrior.", "Who is Anakin Skywalker?"],
        300: ["Anakin Skywalker’s final word before taking his last breath.", "What is 'Luke'?"],
        400: ["This actor portrayed Luke Skywalker in the original *Star Wars* trilogy.", "Who is Mark Hamill?"],
        500: ["The surname Leia had before discovering she was a Skywalker.", "What is Organa?"]
    },
    "The Force": {
        100: ["These microscopic organisms determine one's connection to the Force.", "What are midi-chlorians?"],
        200: ["This wise Jedi Master offered the advice, 'Do or do not. There is no try.'", "Who is Yoda?"],
        300: ["A guiding principle of the Sith states there should only be a master and an apprentice.", "What is the Rule of Two?"],
        400: ["Jedi who have passed on can return in spectral form using this ability.", "What is a Force Ghost?"],
        500: ["This ancient Mandalorian Jedi was the first to wield the Darksaber.", "Who is Tarre Vizsla?"]
    },
    "Ships & Vehicles": {
        100: ["This ship, piloted by Han Solo, made the Kessel Run in less than 12 parsecs.", "What is the Millennium Falcon?"],
        200: ["The standard fighter used by Imperial pilots during battles.", "What are TIE Fighters?"],
        300: ["These towering war machines were used by the Empire to attack the Rebel base on Hoth.", "What is an AT-AT?"],
        400: ["Boba Fett’s starship, later renamed in official *Star Wars* media.", "What is Slave I (now Firespray-31 Patrol Craft)?"],
        500: ["The model of the Rebel blockade runner seen at the beginning of *A New Hope*.", "What is a CR90 Corvette?"]
    },
    "Famous Quotes": {
        100: ["This villain shocked the galaxy when he revealed, 'I am your father!'", "Who is Darth Vader?"],
        200: ["Han Solo greeted an old friend with this memorable line: 'Chewie, we’re home.'", "Who is Han Solo?"],
        300: ["Ahsoka Tano made this declaration to distance herself from the Jedi Order.", "What is 'I am no Jedi.'"],
        400: ["This catchphrase is spoken by members of the Mandalorian creed.", "What is 'This is the way.'"],
        500: ["A Mon Calamari leader warned of an incoming attack with this famous phrase.", "What is 'It’s a trap!'"]
    },
    "The Clone Wars": {
        100: ["These soldiers, grown from Jango Fett’s DNA, served the Galactic Republic.", "Who are Clone Troopers?"],
        200: ["This young Togruta Jedi was assigned as Anakin Skywalker’s Padawan.", "Who is Ahsoka Tano?"],
        300: ["The Sith mastermind who manipulated both sides of the Clone Wars.", "Who is Darth Sidious?"],
        400: ["This decorated clone officer fought alongside Anakin Skywalker in the 501st Legion.", "Who is Captain Rex?"],
        500: ["This emergency directive forced Clone Troopers to execute Jedi commanders.", "What is Order 66?"]
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
