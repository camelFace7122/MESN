export default function clearForm(selector, cleanValues = false) {
    $(`${selector ? selector + ' ' : ''}p.error`).remove()
    $(`${selector ? selector + ' ' : ''}input`).removeClass('error')
    $(`${selector ? selector + ' ' : ''}p.success`).remove()
    $(`${selector ? selector + ' ' : ''}input`).removeClass('success')
    $(`${selector ? selector + ' ' : ''}div[name=""].error`).remove()
    $(`${selector ? selector + ' ' : ''}div[name=""].success`).remove()
    $(`${selector ? selector + ' ' : ''}div[name]`).removeClass('error')
    $(`${selector ? selector + ' ' : ''}div[name]`).removeClass('success')
    $(`${selector ? selector + ' ' : ''}textarea`).removeClass('error')
    $(`${selector ? selector + ' ' : ''}textarea`).removeClass('success')

    if (cleanValues) {
        $(`${selector ? selector + ' ' : ''}input`).val('')
        $(`${selector ? selector + ' ' : ''}div[name]`).html('')
    }
}