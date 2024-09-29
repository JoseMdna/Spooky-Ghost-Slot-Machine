/*-------------------------------- Constants --------------------------------*/
const icons = [
  "images/blue-lightsaber.png",
  "images/purple-lightsaber.png",
  "images/green-lightsaber.png",
  "images/yellow-lightsaber.png",
  "images/pink-lightsabers.png",
  "images/jackpot-ghost.png"
]

const multiplier = [1.35, 1.60, 2, 3, 5, 25]


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

const showLoginFeedback = (message, isSuccess = false) => {
  loginFeedbackElement.textContent = message
  if (isSuccess) {
    loginFeedbackElement.classList.add("success-feedback")
    loginFeedbackElement.classList.remove("error-feedback")
} else {
    loginFeedbackElement.classList.add("error-feedback")
    loginFeedbackElement.classList.remove("success-feedback")
  }
  loginFeedbackElement.style.display = "block" 
}

const startGame = () => {
  loginPageElement.style.display = "none"
  gameSectionElement.style.display = "block"
  setRandomReels()
}

const handleLogin = () => {
  const enteredUsername = usernameInputElement.value.trim()
  const users = JSON.parse(localStorage.getItem("users")) || {}
  if (users[enteredUsername]) {
    balance = users[enteredUsername].balance
    localStorage.setItem("currentUser", enteredUsername)
    updateBalance()
    balance = Math.round(balance * 100) / 100
    if (balance === 0) {
      reloadBalanceButtonElement.style.display = "block"
    } else {
      reloadBalanceButtonElement.style.display = "none"
    }
    showLoginFeedback(`Welcome back, ${enteredUsername}!`, true)
    setTimeout(() => {
      startGame()
    }, 1500)
  } else {
    showLoginFeedback("No saved account was found!", false)
  }
}

const handleGuest = () => {
  showLoginFeedback("Playing as Guest!", true)
  localStorage.removeItem("currentUser")
  balance = 100
  updateBalance()
  reloadBalanceButtonElement.style.display = "none"
  setTimeout(() => {
   startGame()
  },1500)
  logoutButtonElement.style.display = "block"
  logoutButtonElement.style.margin = "16px auto"
}

const handleCreateAccount = () => {
  const newUsername = usernameInputElement.value.trim()
  const users = JSON.parse(localStorage.getItem("users")) || {}
  if (newUsername) {
    if (users[newUsername]) {
      showLoginFeedback("This username already exists. Please log in.", false)
    } else {
      users[newUsername] = { balance: 100}
      localStorage.setItem("users", JSON.stringify(users))
      localStorage.setItem("currentUser", newUsername)
      balance = 100
      updateBalance()
      reloadBalanceButtonElement.style.display = "none"
      showLoginFeedback(`Account created successfully. Welcome, ${newUsername}!`, true)
      setTimeout(() => {
       startGame()
      },1800)
  }
} else {
  showLoginFeedback("Please enter a valid username.", false)
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
  balance = 100
  updateBalance()
  reloadBalanceButtonElement.style.display = "none"
  logoutButtonElement.style.display = "none"
  localStorage.removeItem("currentUser")
  window.location.href = "thankyou.html"
}

const spinReels = () => {
  let betAmount = parseFloat(betInputElement.value)
  betAmount = Math.round(betAmount * 100) / 100
  const roundedBalance = Math.round(balance * 100) / 100
  const epsilon = 0.001
  if (isNaN(betAmount) || betAmount < 0.01) {
    betErrorElement.textContent = "Bet amount must be at least $0.01!"
    betErrorElement.style.display = "block"
    return
  }
  if (betAmount > roundedBalance + epsilon) {
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
    let winAmount = betAmount * winMultiplier
    winAmount = Math.round(winAmount * 100) / 100
    if (reel1 === "images/jackpot-ghost.png") {
      messageElement.textContent = `JACKPOT!! You Won $${winAmount.toFixed(2)}`
      messageElement.style.color = "#ffb700"
    } else {
      messageElement.textContent = `You won $${winAmount.toFixed(2)}!`
      messageElement.style.color = "#00a67e"
    }
    balance += winAmount
    updateBalance()
  } else {  
    messageElement.textContent = "You lost, try again!"
    messageElement.style.color = "#FF0000"
  }
  balance = Math.round(balance * 100) / 100
  if (balance === 0) {
    updateBalance()
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser && currentUser !== "null" && currentUser !== "undefined") {
      reloadBalanceButtonElement.style.display = "block"
    } else {
      reloadBalanceButtonElement.style.display = "none"
  }
}
}

const setRandomReels = () => {
  reel1 = getRandomIcon()
  reel2 = getRandomIcon()
  reel3 = getRandomIcon()
  updateReels()
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
  instructionsPageElement.classList.add("hidden")
  setTimeout(() => { 
  instructionsPageElement.style.display = "none"
  loginPageElement.style.display = "block"
  setTimeout(() => {
   loginPageElement.classList.add("visible")
   loginPageElement.classList.remove("hidden")
  }, 50)
 }, 500)
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