const categories = {
    "Berkeley": {
        100: ["This public university, founded in 1868, is the flagship of the University of California system.", "What is UC Berkeley?"],
        200: ["Berkeley sits on the eastern shore of this famous Bay.", "What is the San Francisco Bay?"],
        300: ["This 1960s movement, centered on free speech and student protest, began at UC Berkeley.", "What is the Free Speech Movement?"],
        400: ["This renowned physics laboratory, once directed by J. Robert Oppenheimer, is located in the Berkeley Hills.", "What is Lawrence Berkeley National Laboratory?"],
        500: ["Berkeley’s city council was among the first in the U.S. to declare this international city as a sister city in solidarity.", "What is Havana?"]
    },
    "Birds": {
        100: ["This large, flightless bird from Africa is known for its long legs and fast running speed.", "What is an ostrich?"],
        200: ["This U.S. bird of prey became the national emblem in 1782.", "What is the bald eagle?"],
        300: ["These brightly colored birds are famous for their mimicry and are often kept as pets.", "What are parrots?"],
        400: ["The males of this bird species perform elaborate dances and display colorful plumage to attract mates.", "What is the bird of paradise?"],
        500: ["Known for its haunting call, this aquatic bird appears on Canada’s $1 coin.", "What is the loon?"]
    },
    "Musicals": {
        100: ["“Do-Re-Mi” is a famous song from this Rodgers and Hammerstein musical.", "What is The Sound of Music?"],
        200: ["This musical tells the story of founding father Alexander Hamilton.", "What is Hamilton?"],
        300: ["In Les Misérables, this character steals a loaf of bread and is pursued for life.", "Who is Jean Valjean?"],
        400: ["“Defying Gravity” is a standout number in this musical based on The Wizard of Oz.", "What is Wicked?"],
        500: ["This musical features Jellicle cats and a song called “Memory.”", "What is Cats?"]
    },
    "Utah": {
        100: ["This U.S. state is home to the Great Salt Lake.", "What is Utah?"],
        200: ["Utah’s capital and largest city.", "What is Salt Lake City?"],
        300: ["This national park, known for its natural sandstone arches, is located near Moab, Utah.", "What is Arches National Park?"],
        400: ["This religious group helped settle Utah in the 19th century.", "Who are the Mormons?"],
        500: ["Utah touches how many other U.S. states?", "What is six?"]
    },
    "DC": {
        100: ["DC is short for this.", "What is District of Columbia?"],
        200: ["This obelisk honors the first President of the United States.", "What is the Washington Monument?"],
        300: ["This iconic museum complex includes the Air and Space Museum.", "What is the Smithsonian Institution?"],
        400: ["DC is home to this U.S. Supreme Court building.", "What is the Supreme Court?"],
        500: ["This Neoclassical memorial honors the third president and author of the Declaration of Independence.", "What is the Jefferson Memorial?"]
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
