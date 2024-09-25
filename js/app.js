/*-------------------------------- Constants --------------------------------*/
const icons = ["images/jackpot-ghost.png"]

console.log(icons)

/*---------------------------- Variables (state) ----------------------------*/
let reel1 = null
let reel2 = null
let reel3 = null

/*------------------------ Cached Element References ------------------------*/
const spinButton = document.getElementById('spin-button')
const reel1eElement = document.getElementById('reel1')
const reel2eElement = document.getElementById('reel2')  
const reel3eElement = document.getElementById('reel3')
const messageElement = document.getElementById('message')

/*-------------------------------- Functions --------------------------------*/
const spinReels = () => {
  reel1 = getRandomIcon()
  reel2 = getRandomIcon()
  reel3 = getRandomIcon()
  updateReels()
}

const getRandomIcon = () => {
  return icons[Math.floor(Math.random() * icons.length)]
}

const updateReels = () => {
  reel1eElement.innerHTML = `<img src= "${reel1}" alt="Ghost icon">`
  reel2eElement.innerHTML = `<img src= "${reel2}" alt="Ghost icon">`
  reel3eElement.innerHTML = `<img src= "${reel3}" alt="Ghost icon">`
}

const checkWinner = () => {
    // Function logic here
    }

const checkForJackpot = () => {
    // Function logic here
}



/*----------------------------- Event Listeners -----------------------------*/
spinButton.addEventListener('click', spinReels)