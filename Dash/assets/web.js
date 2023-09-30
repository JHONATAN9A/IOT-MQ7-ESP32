
$(document).ready(function(){
    // Mostrar el modal
    $("#mostrarModal").click(function(){
        $("#miModal").modal("show");
    });

    // Cerrar el modal
    $("#cerrarModal").click(function(){
        $("#miModal").modal("hide");
    });
});