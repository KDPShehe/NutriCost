const accountButton = document.getElementById('accountButton')
const startButton = document.getElementById('startButton')

function checkAuthStatus() {
    const userId = localStorage.getItem('nutriUserId')

    if (!accountButton || !startButton) return

    if (userId) {
        accountButton.classList.add('userSignUp')
        startButton.classList.remove('userSignUp')

        accountButton.addEventListener('click', () => {

        })
    } else {
        accountButton.classList.remove('userSignUp')
        startButton.classList.add('userSignUp')

        startButton.addEventListener('click', () => {
            window.location.href = '/pages/account.html'
        })
    }
}

checkAuthStatus()