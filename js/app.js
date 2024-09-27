/*-------------------------------- Constants --------------------------------*/
const icons = [
  "images/blue-lightsaber.png",
  "images/purple-lightsaber.png",
  "images/green-lightsaber.png",
  "images/yellow-lightsaber.png",
  "images/pink-lightsabers.png",
  "images/jackpot-ghost.png"
]

const multiplier = [1.35, 1.60, 2, 3, 5, 10]


/*---------------------------- Variables (state) ----------------------------*/
let reel1 = null
let reel2 = null
let reel3 = null

let balance = 100

/*------------------------ Cached Element References ------------------------*/
const spinButton = document.getElementById("spin-button")
const reel1eElement = document.getElementById("reel1")
const reel2eElement = document.getElementById("reel2")  
const reel3eElement = document.getElementById("reel3")
const messageElement = document.getElementById("message")
const balanceElement = document.getElementById("balance")
const betInputElement = document.getElementById("bet-amount")  
const betErrorElement = document.getElementById("bet-error")
const gameOverMessageElement = document.getElementById("game-over-message")
const restartButtonElement = document.getElementById("restart-button")
const maxBetButtonElement = document.getElementById("max-bet-button")
const minBetButtonElement = document.getElementById("min-bet-button")


/*-------------------------------- Functions --------------------------------*/

const updateBalance = () => {
  balanceElement.textContent = balance.toFixed(2)
}

const restartGame = () => {
  gameOverMessageElement.style.display = "none"
  spinButton.style.display = "block"
  minBetButtonElement.style.display = "block"
  maxBetButtonElement.style.display = "block"
  restartButtonElement.style.display = "none"
  balance = 100
  betInputElement.value = "1"
  messageElement.textContent = "Game restarted! place your bet"
  updateBalance()
  document.getElementById("slot-machine").style.display = "flex"
  document.querySelector(".bet-controls").style.margin = "0 auto" 
  messageElement.textContent = ""
  betErrorElement.style.display = "none"
}

const spinReels = () => {
  let betAmount = parseFloat(betInputElement.value)
  if (betAmount <= 0) {
    betErrorElement.textContent = "Bet amount must be greater than $0.00!"
    betErrorElement.style.display = "block"
    return
  } else {
    betErrorElement.style.display = "none"
  }
  if (betAmount > balance + 0.01) {
    betErrorElement.textContent = "This bet exceeds your current balance!"
    betErrorElement.style.display = "block"
    return
  } else {
    betErrorElement.style.display = "none"
  }
  balance -= betAmount
  updateBalance()
  reel1 = getRandomIcon()
  reel2 = getRandomIcon()
  reel3 = getRandomIcon()
  updateReels()
  checkForWinner(betAmount)
  if (balance <= 0) {
    balance = 0
    updateBalance()
    gameOverMessageElement.style.display = "block"
    spinButton.style.display = "none"
    restartButtonElement.style.display = "block"
    restartButtonElement.style.margin = "0 auto"
    document.getElementById("slot-machine").style.display = "none"
  }
}

const getRandomIcon = () => {
  return icons[Math.floor(Math.random() * icons.length)]
}

const updateReels = () => {
  reel1eElement.innerHTML = `<img src= "${reel1}" alt="Ghost icon">`
  reel2eElement.innerHTML = `<img src= "${reel2}" alt="Ghost icon">`
  reel3eElement.innerHTML = `<img src= "${reel3}" alt="Ghost icon">`
}

const checkForWinner = (betAmount) => { 
  if (reel1 === reel2 && reel2 === reel3) {
    const winIndex = icons.indexOf(reel1)
    const winMultiplier = multiplier[winIndex]
    const winAmount = betAmount * winMultiplier
    
    if (reel1 === "images/jackpot-ghost.png") {
      messageElement.textContent = `JACKPOT!! You won $${winAmount.toFixed(2)}`
      messageElement.style.color = "#ffcc00"
    } else { 
      messageElement.textContent = `You won $${winAmount.toFixed(2)}!`
      messageElement.style.color = "#00ff00"
    }

    balance += winAmount
    updateBalance()
  } else {  
    messageElement.textContent = "You lost, try again!"  
    messageElement.style.color = "#ffffff"
  }
}



/*----------------------------- Event Listeners -----------------------------*/
spinButton.addEventListener('click', spinReels)   
restartButtonElement.addEventListener('click', restartGame)
minBetButtonElement.addEventListener('click', () => {
  betInputElement.value = "0.01"
})
maxBetButtonElement.addEventListener('click', () => {
  betInputElement.value = balance.toFixed(2)
}) 

