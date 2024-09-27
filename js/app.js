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
const maxBetButtonElement = document.getElementById("max-bet-button")
const minBetButtonElement = document.getElementById("min-bet-button")
const instructionsPageElement = document.getElementById("instructions")
const gameSectionElement = document.getElementById("game-section")
const nextButtonElement = document.getElementById("next-button")
const loginPageElement = document.getElementById("login-page")
const loginButtonElement = document.getElementById("login-button")
const guestButtonElement = document.getElementById("guest-button")
const createAccountButtonElement = document.getElementById("create-account-button")
const loginFeedbackElement = document.getElementById("login-feedback")
const usernameInputElement = document.getElementById("username-input")
const logoutButtonElement = document.getElementById("logout-button")
const reloadBalanceButtonElement = document.getElementById("reload-balance-button")

/*-------------------------------- Functions --------------------------------*/

const showLoginFeedback = (message) => {
  loginFeedbackElement.textContent = message
}

const startGame = () => {
  loginPageElement.style.display = "none"
  gameSectionElement.style.display = "block"
}

const handleLogin = () => {
  const enteredUsername = usernameInputElement.value.trim()
  const users = JSON.parse(localStorage.getItem("users")) || {}
  if (users[enteredUsername]) {
    balance = users[enteredUsername].balance
    localStorage.setItem("currentUser", enteredUsername)
    updateBalance()
    showLoginFeedback(`Welcome back, ${enteredUsername}!`)
    startGame()
  } else {
    showLoginFeedback("No saved account was found.")
  }
}

const handleGuest = () => {
  showLoginFeedback("Playing as Guest!")
  localStorage.removeItem("currentUser")
  startGame()
  logoutButtonElement.style.display = "block"
  logoutButtonElement.style.margin = "16px auto"
}

const handleCreateAccount = () => {
  const newUsername = usernameInputElement.value.trim()
  const users = JSON.parse(localStorage.getItem("users")) || {}
  if (newUsername) {
    if (users[newUsername]) {
      showLoginFeedback("This username already exists. Please log in.")
    } else {
      users[newUsername] = { balance: 100}
      localStorage.setItem("users", JSON.stringify(users))
      showLoginFeedback(`Account created successfully. Welcome, ${newUsername}!`)
      startGame()
    }
  } else {
    showLoginFeedback("Please enter a valid username.")
  }
}

const updateBalance = () => {
  balanceElement.textContent = balance.toFixed(2)
}

const restartGame = () => {
  gameOverMessageElement.style.display = "none"
  spinButton.style.display = "block"
  minBetButtonElement.style.display = "block"
  maxBetButtonElement.style.display = "block"
  restartButtonElement.style.display = "none"
  const currentUser = localStorage.getItem("currentUser")
  const users = JSON.parse(localStorage.getItem("users")) || {}
  if (currentUser && users[currentUser]) {
    balance = users[currentUser].balance
  }
  betInputElement.value = "1"
  messageElement.textContent = "Game restarted! place your bet"
  updateBalance()
  document.getElementById("slot-machine").style.display = "flex"
  document.querySelector(".bet-controls").style.margin = "0 auto" 
  messageElement.textContent = ""
  betErrorElement.style.display = "none"
}

const handleLogout = () => {
  const currentUser = localStorage.getItem("currentUser")
  const users = JSON.parse(localStorage.getItem("users")) || {}
  if (currentUser && users[currentUser]) {
    users[currentUser].balance = balance
    localStorage.setItem("users", JSON.stringify(users))
  }
  window.location.href = "thankyou.html"
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
  if (betAmount > balance + 0.001) {
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

  if (balance <= 0) {
    balance = 0
    updateBalance()
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      document.getElementById("reload-balance-button").style.display = "block"
  } else { 
    return
  }
 }
}



/*----------------------------- Event Listeners -----------------------------*/
spinButton.addEventListener('click', spinReels)
minBetButtonElement.addEventListener('click', () => {
  betInputElement.value = "0.01"
})
maxBetButtonElement.addEventListener('click', () => {
  betInputElement.value = balance.toFixed(2)
}) 
nextButtonElement.addEventListener('click', () => {
  instructionsPageElement.style.display = "none"
  loginPageElement.style.display = "block"
})
loginButtonElement.addEventListener('click', handleLogin)
guestButtonElement.addEventListener('click', handleGuest) 
createAccountButtonElement.addEventListener('click', handleCreateAccount)
logoutButtonElement.addEventListener('click', handleLogout)
reloadBalanceButtonElement.addEventListener('click', () => {
  balance = 100
  updateBalance()
  reloadBalanceButtonElement.style.display = "none"
  const currentUser = localStorage.getItem("currentUser")
  const users = JSON.parse(localStorage.getItem("users")) || {} 
  if (currentUser && users[currentUser]) {
    users[currentUser].balance = balance
    localStorage.setItem("users", JSON.stringify(users))
  }
})
