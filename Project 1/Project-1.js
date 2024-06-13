toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: "toast-top-center",
    preventDuplicates: false,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "5000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
    tapToDismiss: false
};

$(document).ready(function () {
    function calculateDaysAndCost() {
        var checkIn = $("#checkIn").val(),
            checkOut = $("#checkOut").val(),
            adults = $("#adults").val();
        var days = moment(checkOut).diff(moment(checkIn), "days");
        var cost = days * 150 * adults;
        $("#days").val(days);
        $("#cost").val(cost);
    }

    $("#adults, #checkIn, #checkOut").change(calculateDaysAndCost);

    function resetForm() {
        $('#booking_form input[type="text"], #booking_form input[type="email"], #booking_form input[type="date"], #booking_form textarea').val('');
        $('#booking_form #adults').val('1');
        $('#booking_form #days, #booking_form #cost').val('');
        $('#booking_form input[type="range"]').val(0).change();
        $('#booking_form input[type="radio"]').prop('checked', false);
        toastr.remove();
        toastr.clear();
        toastr.info('All fields have been cleared.');
        $('#booking_form .form-group').removeClass('has-error has-success');
        $('#booking_form .form-control').removeClass('is-invalid is-valid');
    }

    $("#reset").click(function () {
        resetForm();
    });

    $("#submit").click(function () {
        var hasError = false;
        $("#username, #firstName, #lastName, #phone, #fax, #email").each(function () {
            if (!$(this).val()) {
                $(this).closest(".form-group").addClass("has-error");
                toastr.error("No " + $(this).attr("placeholder") + " entered.");
                hasError = true;
            } else {
                $(this).closest(".form-group").removeClass("has-error");
            }
        });

        var cost = $("#cost").val();
        if (cost === "") {
            toastr.error("No cost was calculated.");
            hasError = true;
        } else if (cost <= 0) {
            toastr.error("Cost is negative or zero.");
            hasError = true;
        }

        if (!hasError) {
            toastr.success("The form was successfully submitted.");
        }
    });
});
