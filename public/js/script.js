// document.addEventListener('DOMContentLoaded', function () {
//     const header = document.querySelector('header')

//     window.addEventListener('scroll', function () {
//         if (window.scrollY > 50) {
//             header.classList.add('header-shadow')
//         } else {
//             header.classList.remove('header-shadow')
//         }
//     })
// })

try {
    const aboutBtn = document.getElementById('about-btn')
    const contactBtn = document.getElementById('contact-btn')
    const aboutSection = document.getElementById('about-section')
    const contactSection = document.getElementById('contact-section')

    aboutBtn.onclick = (e) => {
        e.preventDefault()

        aboutBtn.classList.add('active')
        aboutSection.classList.remove('d-none')
        contactBtn.classList.remove('active')
        contactSection.classList.add('d-none')
    }
    contactBtn.onclick = (e) => {
        e.preventDefault()

        contactBtn.classList.add('active')
        contactSection.classList.remove('d-none')
        aboutBtn.classList.remove('active')
        aboutSection.classList.add('d-none')
    }
} catch (error) {
    console.log(error)
}

// inline editor
try {
    tinymce.init({
        selector: 'textarea#post-body',
        height: 500,
        plugins:
            'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
        toolbar:
            'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat'
    })

    const postBody = document.querySelector('textarea#post-body')
    const postForm = document.querySelector('form#post-form')
    postForm.onsubmit = function (e) {
        e.preventDefault()

        if (!postBody.value.length) {
            console.log('Post body is required')
        } else {
            postForm.submit()
        }
    }
} catch (error) {
    console.log(error)
}

// image preview
try {
    document.querySelector('#image').onchange = function () {
        let file = this.files[0]
        if (file) {
            let reader = new FileReader()
            reader.onload = function (event) {
                document
                    .querySelector('#imgPreview')
                    .setAttribute('src', event.target.result)
                document
                    .querySelector('.imgPreviewContainer')
                    .classList.remove('d-none')
            }
            reader.readAsDataURL(file)
        }
    }
} catch (error) {
    console.log(error)
}

// cancel button
try {
    document.getElementById('cancel-button').onclick = () => {
        const isConfirmed = confirm('Are you sure ?')

        if (isConfirmed) {
            return history.go(-1)
        }
    }
} catch (error) {
    console.log(error)
}

// Contact form
try {
    const scriptURL =
        'https://script.google.com/macros/s/AKfycbzt54iJ4fwGDJEbR2ds7jIIXrlaaenojLz2-S-4sy1SGe5bv0LNviy_CYrV6Whw57k/exec'
    const form = document.forms['contact-form']
    const input = {
        name: document.querySelector('#name'),
        email: document.querySelector('#email'),
        message: document.querySelector('#message')
    }
    let nameValidation = null
    let emailValidation = null
    let messageValidation = null
    const button = document.querySelector('#button')
    const alert = document.querySelector('#alert')
    const alertFailed = document.querySelector('#alert-danger')

    form.addEventListener('submit', (e) => {
        e.preventDefault()

        button.innerHTML = 'Loading...'
        button.setAttribute('disabled', '')

        if (!input.name.value.length) {
            nameValidation = 'Fullname is required'
        } else if (input.name.value.length < 5) {
            nameValidation = 'Fullname should not less then 5 chars'
        } else if (input.name.value.length > 50) {
            nameValidation = 'Fullname should not more then 50 chars'
        } else {
            nameValidation = null
        }
        if (nameValidation) {
            input.name.classList.add('is-invalid')
            document.querySelector('#name-validation').innerHTML =
                nameValidation
        } else {
            input.name.classList.remove('is-invalid')
        }

        if (!input.email.value.length) {
            emailValidation = 'Email is required'
        } else {
            emailValidation = null
        }
        if (emailValidation) {
            input.email.classList.add('is-invalid')
            document.querySelector('#email-validation').innerHTML =
                emailValidation
        } else {
            input.email.classList.remove('is-invalid')
        }

        if (!input.message.value.length) {
            messageValidation = 'Message is required'
        } else if (input.message.value.length < 10) {
            messageValidation = 'Message should not less then 10 chars'
        } else if (input.message.value.length > 750) {
            messageValidation = 'Message should not more then 750 chars'
        } else {
            messageValidation = null
        }
        if (messageValidation) {
            input.message.classList.add('is-invalid')
            document.querySelector('#message-validation').innerHTML =
                messageValidation
        } else {
            input.message.classList.remove('is-invalid')
        }

        if (nameValidation || emailValidation || messageValidation) {
            button.innerHTML = 'Submit'
            button.removeAttribute('disabled')
            return
        } else {
            fetch(scriptURL, { method: 'POST', body: new FormData(form) })
                .then((response) => {
                    console.log(response)

                    alert.classList.add('show')
                    alert.classList.remove('d-none')
                    button.innerHTML = 'Submit'
                    button.removeAttribute('disabled')
                    form.reset()
                })
                .catch((error) => {
                    console.error('Error!', error.message)

                    alertFailed.classList.add('show')
                    alertFailed.classList.remove('d-none')
                    button.innerHTML = 'Submit'
                    button.removeAttribute('disabled')
                })
        }
    })
} catch (error) {
    console.log(error)
}
