/* @author Matthew Chang */
/* CSDS 221: project 1 js portion */




// toastr notifications config
toastr.options = {
    newestOnTop: false,
    positionClass: "toast-top-center",
    showDuration: "500",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
    tapToDismiss: false
};

// functiosn
$(document).ready(function () {

    // event handler for calculating the cost
    $("#adults, #checkIn, #checkOut").change(calculateDaysAndCost);

    // function that calculates the cost based on the number of days and adults
    // flat rate of 150 per person per day
    function calculateDaysAndCost() {
        const checkIn = $("#checkIn").val();
        const checkOut = $("#checkOut").val();
        const adults = $("#adults").val();
        const days = moment(checkOut).diff(moment(checkIn), "days");
        const cost = days * 150 * adults;
        $("#days").val(days);
        $("#cost").val(cost);
    }






    // event handler for resetting the form
    $("#reset").click(resetForm);

    // function to reset the form
    function resetForm() {
        $('#booking_form').find('input[type="text"], input[type="email"], input[type="date"], textarea').val('');
        $('#booking_form #adults').val('1');
        $('#booking_form #days, #booking_form #cost').val('');
        $('#booking_form input[type="range"]').val(0).change();
        $('#booking_form input[type="radio"]').prop('checked', false);
        toastr.remove();
        toastr.clear();
        toastr.info('all form fields have been cleared.');
        $('#booking_form .form-group').removeClass('has-error has-success');
        $('#booking_form .form-control').removeClass('is-invalid is-valid');
    }






    // event handler for submitting the form
    $("#submit").click(function () {
        
        // variable for the state of the form (has error or not)
        let hasError = false;

        // checking if required fields were filled out or not
        $("#username, #firstName, #lastName, #phone, #fax, #email").each(function () {
            if (!$(this).val()) {
                $(this).closest(".form-group").addClass("has-error");
                toastr.error($(this).attr("placeholder") + " was not entered.");
                hasError = true;
            } 
            else {
                $(this).closest(".form-group").removeClass("has-error");
            }
        });

        // checking cost
        const cost = $("#cost").val();
        if (!cost) {
            toastr.error("no cost was calculated. please specify.");
            hasError = true;
        } 
        else if (cost < 0) {
            toastr.error("cost is negative. please try again.");
            hasError = true;
        }
        else if (cost == 0) {
            toastr.error("cost is zero. please try again.");
            hasError = true;
        }

        // final check: shows success if all fields were filled out and cost is positive
        if (!hasError) {
            toastr.success("form was successfully submitted.");
        }
    });
});
