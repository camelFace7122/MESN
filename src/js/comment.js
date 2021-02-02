export default $(function () {
    let commentForm;
    let parentId;

    function showCommentForm(isNew, childComment) {
        $('.reply').show()

        if (commentForm) commentForm.remove()

        parentId = null

        commentForm = $('form.comment').clone(true, true)

        if (isNew) {
            commentForm.appendTo('.comments-list')
            $(commentForm).find('.cancel').hide()
        } else {
            let parentComment = $(childComment).parent()
            parentId = parentComment.data('id')
            $(childComment).after(commentForm)            
        }

        commentForm.css({ display: 'flex' })
    }

    showCommentForm(true)

    $('.reply').on('click', function () {
        showCommentForm(false, this)
        $(this).hide()
    })

    $('form.comment .cancel').on('click', function (e) {
        e.preventDefault()
        if (commentForm) commentForm.remove()
        showCommentForm(true)
    })

    $('form.comment .send').on('click', function(e) {
        e.preventDefault()

        $(this).prop("disabled",true)

        const data = {
            body: commentForm.find('textarea').val(),
            post: $('.comments').data('id'),
            parent: parentId
        }

        $.ajax('/comment/add', {
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data)
        }).done(data => {
            $(this).prop("disabled",false)
            if (!data.ok) {
                if (!data.error) {
                    data.error = 'Неизвестная ошибка'
                    $(commentForm).prepend('<p class="error">' + data.error + '</p>')
                }
            } else {
                const newComment = `
                    <ul>
                        <li style="background-color: #ffffe0;">
                            <div class="head">
                                <a href="/users/${data.login}" class="link">${data.login}</a>
                                <span class="date">Только что</span>
                            </div>
                            ${data.body}
                        </li>
                    </ul>
                `
                $(commentForm).closest('li').append(newComment)

                showCommentForm(true)
            }
        })
    })
})