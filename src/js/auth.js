import clearForm from './common'

export default $(function () {
    let isRegister = false

    $('.switch-btn').on('click', function (e) {
        e.preventDefault()

        if (!isRegister) {
            isRegister = true
            clearForm('.auth', true)
            clearForm('.register', true)
            $('.register').show('slow')
            $('.auth').hide()
        } else {
            isRegister = false
            clearForm('.auth', true)
            clearForm('.register', true)
            $('.auth').show('slow')
            $('.register').hide()
        }
    })

    $('input, textarea, div').on('focus', (e) => {
        if (e.target.closest('form')) {
            clearForm('.' + e.target.closest('form').classList[0])
        }
    })

    $('.register-btn').on('click', function (e) {
        e.preventDefault()

        const data = {
            login: $('#register-login').val(),
            password: $('#register-password').val(),
            passwordConfirm: $('#register-passwordConfirm').val(),
        }

        clearForm('.register')

        $.ajax('api/auth/register', {
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data)
        }).done(data => {
            if (!data.ok) {
                $('.register h2').after('<p class="error">' + data.error + '</p>')
                if (data.fields) {
                    data.fields.forEach(field => {
                        $(`input[name="${field}"]`).addClass('error')
                    })
                }
            } else {
                $('.register h2').after('<p class="success">Пользователь успешно зарегистрирован</p>')
                $(location).attr('href', '/')
            }
        })
    })

    $('.login-btn').on('click', function (e) {
        e.preventDefault()

        const data = {
            login: $('#auth-login').val(),
            password: $('#auth-password').val(),
        }

        clearForm('.auth')

        $.ajax('api/auth/login', {
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data)
        }).done(data => {
            if (!data.ok) {
                $('.auth h2').after('<p class="error">' + data.error + '</p>')
                if (data.fields) {
                    data.fields.forEach(field => {
                        $(`input[name="${field}"]`).addClass('error')
                    })
                }
            } else {
                // $('.auth h2').after('<p class="success">Вы успешно авторизованы</p>')
                $(location).attr('href', '/')
            }
        })
    })
})