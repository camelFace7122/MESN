export default $(function () {

    $('#fileinfo').on('submit', function (e) {
        e.preventDefault()

        const formData = new FormData(this)

        $.ajax({
            type: 'POST',
            url: '/upload/image',
            contentType: false,
            processData: false,
            data: formData,
            success: function(res) {
                console.log(res)
            },
            error: function (err) {
                console.log(err)
            }
        })
    })
})