const loadInitialTemplate = () => {
    const template = `
        <h1>Vehiculos</h1>

        <form id="car-form">
            <div class="mb-3">
                <label for="brand" class="form-label">Brand</label>
                <input type="text" class=" form-control" id="brand" name="brand">
            </div>
            <div class="mb-3">
                <label for="model" class="form-label">Model</label>
                <input type="text" class="form-control" id="model" name="model">
            </div>
            <button type="submit" class="btn btn-primary">Agregar</button>
        </form>

        <ul class="list-group" id="car-list"></ul>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    `
    const body = document.getElementsByTagName('body')[0]
    body.innerHTML = template
}

const getCars = async () => {
    const response = await fetch('/cars', {
        headers: {
            Authorization: localStorage.getItem('jwt'),
        }
    })
    const cars = await response.json()
    console.log(cars)
    const template = car => `
        <li class="list-group-item">
            ${car.brand} ${car.model} <button data-id="${car._id}" type="button" class="btn btn-primary">Eliminar</button>
        </li>
    `
    const carList = document.getElementById('car-list')
    carList.innerHTML = cars.map(car => template(car)).join('')
    cars.forEach(car => {
        const carNode = document.querySelector(`[data-id="${car._id}"]`)
        carNode.onclick = async e => {
            await fetch(`/cars/${car._id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: localStorage.getItem('jwt')
                }
            })
            carNode.parentNode.remove()
            alert('Eliminado con exito')
        }
    })
}

const addFormListener = () => {
    const carForm = document.getElementById('car-form')
    carForm.onsubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(carForm)
        const data = Object.fromEntries(formData.entries())
        await fetch('/cars', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'content-type':'application/json',
                Authorization: localStorage.getItem('jwt'),
            }
        })
        carForm.reset()
        getCars()
    }
}

const checkLogin = () => {
    localStorage.getItem('jwt')
}
const carsPage = () => {
    loadInitialTemplate()
    addFormListener()
    getCars()
}

const loadReisterTemplate = () => {
    const template = `
    <h1>Register</h1>

    <form id="register-form">
        <div class="mb-3">
            <label for="email" class="form-label">email</label>
            <input type="text" class=" form-control" id="email" name="email">
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input class="form-control" id="password" name="password">
        </div>
        <button type="submit" class="btn btn-primary">Inresar</button>
    </form>
    
    <a href="#" id="login">Iniciar sesion</a>

    <div id="error"></div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
`


const body = document.getElementsByTagName('body')[0]
body.innerHTML= template
}
const goToLoginListener = () => {
    const goToLogin = document.getElementById('login')
    goToLogin.onclick = (e) => {
        e.preventDefault()
        loginPage()
    }
}

const registerPage = () => {
    console.log('Pagina de registro')
    loadReisterTemplate()
    addRegisterListener()
    goToLoginListener()
}

const loginPage = () => {
    loadLoginTemplate()
    addLoginListener()
    goToRegisterListener()
}
const loadLoginTemplate = () => {
    const template = `
    <h1>Login</h1>

    <form id="login-form">
        <div class="mb-3">
            <label for="email" class="form-label">email</label>
            <input type="text" class=" form-control" id="email" name="email">
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input class="form-control" id="password" name="password">
        </div>
        <button type="submit" class="btn btn-primary">Inresar</button>
    </form>
    
    <a href="#" id="register">registrarse</a>

    <div id="error"></div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
`


const body = document.getElementsByTagName('body')[0]
body.innerHTML= template
}

const goToRegisterListener = () => {
    const goToRegister = document.getElementById('register')
    goToRegister.onclick = (e) => {
        e.preventDefault()
        registerPage()
    }
}

const authListener = action => () => {
    const form = document.getElementById(`${action}-form`)
    form.onsubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(form)
        const data = Object.fromEntries(formData.entries())

        const response = await fetch(`/${action}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json',
            }
        })
        const responseData = await response.text()
        if(response.status >= 300) {
            const errorNode = document.getElementById('error')
            errorNode.innerHTML = responseData
        } else {
            localStorage.setItem('jwt', `Bearer ${responseData}`)
            carsPage()
        }
    }
}
const addLoginListener = authListener('login')
const addRegisterListener = authListener('register')

window.onload = () => {
    const isLogedIn = checkLogin()
    if(isLogedIn) {
        carsPage()
    } else {
        loginPage()
    }
}