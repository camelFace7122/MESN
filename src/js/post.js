import clearForm from './common'

export default $(function () {

    $('.publish-btn, .save-btn').on('click', function (e) {
        e.preventDefault()

        const isDraft = e.target.classList.contains('save-btn')

        const data = {
            title: $('#post-title').val(),
            body: $('#post-body').val(),
            isDraft,
            postId: $('#post-id').val()
        }

        clearForm('.post-form')

        $.ajax('/post/add', {
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data)
        }).done(data => {
            console.log(data)
            if (!data.ok) {
                $('.post-form h2').after('<p class="error">' + data.error + '</p>')
                if (data.fields) {
                    data.fields.forEach(field => {
                        $(`input[name="${field}"]`).addClass('error')
                        $(`textarea[name="${field}"]`).addClass('error')
                    })
                }
            } else {
                if (isDraft) {
                    $(location).attr('href', '/post/edit/' + data.post.id)
                } else {
                    $(location).attr('href', '/posts/' + data.post.url)
                }
               
            }
        })
    })
})