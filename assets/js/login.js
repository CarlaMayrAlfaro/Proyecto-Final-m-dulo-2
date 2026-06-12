// CAPTURAMOS EL ELEMENTO FORMULARIO DEL DOM CON JQUERY
$(document).ready(function() {
  const emailBD = "usuario1@gmail.com";
  const passwordBD = "123456";

  // Manejar el envío del formulario utilizando jQuery .submit()
  $('#loginForm').submit(function(event) {
    event.preventDefault();

    // selectores de jQuery para obtener los valores
    const emailUsuario = $('#email').val();
    const passwordUsuario = $('#password').val();

    if (emailBD === emailUsuario && passwordBD === passwordUsuario) {
      // Mostrar alerta de éxito
      $('#alertSuccess').removeClass('d-none').fadeIn();
      $('#alertError').addClass('d-none');
      
      // Redirigir después de 2 segundos
      setTimeout(function() {
        window.location.href = './menu.html';
      }, 2000);
    } else {
      // Mostrar alerta de error
      $('#alertError').removeClass('d-none').fadeIn();
      $('#alertSuccess').addClass('d-none');
      
      // Limpiar campos
      $('#email').val('');
      $('#password').val('');
      
      // Ocultar alerta después de 5 segundos
      setTimeout(function() {
        $('#alertError').fadeOut();
      }, 5000);
    }
  });
});