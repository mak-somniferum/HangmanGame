const data = [
  {
    topic: "동물",
    word: ["rabbit", "bear", "giraffe", "spider", "wolf", "elephant"],
    hint: ["긴 귀가 특징입니다.", "100일 동안 쑥과 마늘만을 먹고 인간이 되었다고 합니다.", "목이 매우 길고 튼튼합니다. 싸울 때도 목으로 싸웁니다.", "눈도 많고, 다리도 많습니다.", "무리지어 생활합니다. 보름달을 보면 변신할지도 모릅니다.", "몸집이 아주 큽니다. 긴 코가 특징입니다."],
  },
  {
    topic: "영화",
    word: ["parasite", "her", "titanic", "ai", "interstellar", "joker"],
    hint: ["오~ 너는 계획이 다 있구나?", "당신이 누가 되건, 당신이 어디에 있건. 사랑을 보낸다!", "그래서 이게 당신들이 말하는 가라앉지 않는 배야?", "푸른 요정님, 제발 제가 인간이 되게 해주세요.", "우린 답을 찾을 것이다. 늘 그랬듯이.", "내 죽음이 내 삶보다 더 가치있기를."],
  },
];

const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

let topic, word, hint, lives, letterBtn, blanks, correctCounter, drawOrder;

// Get elements
const buttonsWrap = document.querySelector(".buttons");
const topicText = document.querySelector(".topic");
const wordText = document.querySelector(".word");
const liveText = document.querySelector(".lives");
const canvas = document.querySelector("#canvas");
const getHint = document.querySelector(".btn.hint");
const reset = document.querySelectorAll(".btn.reset");
const backdrop = document.querySelector(".modal-backdrop");
const modalWrap = document.querySelector(".modal-wrap");
const modalText = document.querySelector(".modal-text");
const modalClose = document.querySelector(".modal-close");

// Get random data
function getRandomData() {
  const value = data[Math.floor(Math.random() * data.length)];
  const wordIndex = Math.floor(Math.random() * value.word.length);
  return {
    topic: value.topic,
    word: value.word[wordIndex],
    hint: value.hint[wordIndex],
  };
}

// Create alphabet buttons
function createButtons() {
  alphabet.forEach((letter) => {
    const button = document.createElement("button");
    button.innerHTML = letter;
    buttonsWrap.appendChild(button);
  });
}

// Create blank
function createBlank() {
  [...word].forEach(() => {
    const blank = document.createElement("span");
    blank.innerHTML = "_";
    wordText.appendChild(blank);
  });
}

// Set canvas
function setCanvas() {
  const context = canvas.getContext("2d");
  context.beginPath();
}

// Draw path
function draw(pathFromx, pathFromy, pathTox, pathToy) {
  const context = canvas.getContext("2d");
  context.moveTo(pathFromx, pathFromy);
  context.lineTo(pathTox, pathToy);
  context.stroke();
}

const frame1 = () => draw(0, 130, 300, 130);

const frame2 = () => draw(80, 10, 80, 129);

const frame3 = () => draw(80, 10, 150, 10);

const frame4 = () => draw(150, 10, 150, 20);

const head = () => {
  const context = canvas.getContext("2d");
  context.beginPath();
  context.arc(150, 35, 15, 0, Math.PI * 2);
  context.stroke();
};

const torso = () => draw(150, 50, 150, 85);

const leftArm = () => draw(150, 57, 140, 87);

const rightArm = () => draw(150, 57, 160, 87);

const leftLeg = () => draw(150, 85, 145, 122);

const rightLeg = () => draw(150, 85, 155, 122);

drawOrder = [frame1, frame2, frame3, frame4, head, torso, leftArm, rightArm, leftLeg, rightLeg];

// Game over
function gameOver() {
  drawOrder[9 - lives]();
  modalText.innerHTML = "당신은 졌습니다!<br />괜찮습니다. 다시 시작할 수 있어요.<div class='btn-wrap'><button type='button' class='btn reset' onclick='resetGame()'>다시하기</button><button type='button' class='btn reset' onclick='resetGame()'>그만하기</button></div>";
  modalClose.style.display = "none";
  modal();
}

// Game clear
function gameClear() {
  modalText.innerHTML = `정답 : <span class='answer'>${word}</span><br />당신은 이겼습니다!<br />축하드려요! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧<div class='btn-wrap'><button type='button' class='btn reset' onclick='resetGame()'>다시하기</button><button type='button' class='btn reset' onclick='resetGame()'>그만하기</button></div>`;
  modalClose.style.display = "none";
  modal();
}

// Check
function check() {
  letterBtn = document.querySelectorAll(".buttons button");
  blanks = document.querySelectorAll(".word span");

  letterBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.disabled = true;
      const guessLetter = btn.innerHTML;

      if ([...word].indexOf(guessLetter) != -1) {
        // true
        [...word].forEach((correctLetter, i) => {
          if (correctLetter == guessLetter) {
            blanks[i].innerHTML = correctLetter;
            correctCounter += 1;
            correctCounter == word.length && gameClear();
          }
        });
      } else {
        // false
        liveText.innerHTML = `남은 목숨 : <strong>${(lives -= 1)}</strong>`;
        lives < 1 ? gameOver() : drawOrder[9 - lives]();
      }
    });
  });
}

// Play
function play() {
  const randomData = getRandomData();
  correctCounter = 0;
  lives = 10;
  ({ topic, word, hint } = randomData);

  topicText.innerHTML = `주제는 ${topic}입니다.`;
  liveText.innerHTML = `남은 목숨 : <strong>${lives}</strong>`;
  createButtons();
  createBlank();
  setCanvas();
  check();
}

// Modal
function modal() {
  backdrop.classList.add("active");
  modalWrap.classList.add("active");
  modalClose.addEventListener("click", () => {
    modalText.innerHTML = "";
    modalWrap.classList.remove("active");
    backdrop.classList.remove("active");
  });
}

// Hint
getHint.addEventListener("click", () => {
  modalText.innerHTML = hint;
  modal();
});

// Reset
function resetGame() {
  buttonsWrap.innerHTML = "";
  wordText.innerHTML = "";
  backdrop.classList.remove("active");
  modalWrap.classList.remove("active");
  modalClose.style.display = "block";
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, 400, 400);
  play();
}

reset.forEach((btn) => {
  btn.addEventListener("click", resetGame);
});

play();
