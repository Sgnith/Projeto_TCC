function irparavaga(){
    window.location.href='vaga.html'
}

// MENU SUSPENSO
function menususpenso(){
    var menu = document.getElementById('menu_suspenso_aberto');
    menu.classList.toggle('hidden');
}

// Mensagens flutuantes temporarias
function showAlert(message, type) {
    var alertHtml = '<div class="alert-overlay ' + type + '">' + message + '</div>';
    $('body').append(alertHtml);
    setTimeout(function() {
      $('.alert-overlay').remove();
    }, 3000);   // Exibe a emensagem flutuante por 3 segundos
}
$(document).ready(function() {
    // Verifica se há mensagens de sucesso ou erro
    if ($('#_msg').find('.alert-success').length > 0) {
        var successMessage = $('#_msg').find('.alert-success').text();
        showAlert(successMessage, 'success');
    } else if ($('#_msg').find('.alert-danger').length > 0) {
        var errorMessage = $('#_msg').find('.alert-danger').text();
        showAlert(errorMessage, 'error');
    }
});