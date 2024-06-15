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

    // function for calculating the total cost
    // total cost is based on the number of days and adults with a flat rate of 150 per person per day
    $("#adults, #checkIn, #checkOut").change(function () {
        // calculates the number of days by subtracting the check-out date from the chek-in date
        const checkIn = $("#checkIn").val();
        const checkOut = $("#checkOut").val();
        const num_of_days = moment(checkOut).diff(moment(checkIn), "days");

        const adults = $("#adults").val();

        // cost calculation 
        const total_cost = 150 * adults * num_of_days;

        // updates input fields for days and cost (read-only)
        $("#days").val(num_of_days);
        $("#cost").val(total_cost);
    });

    






    // function for resetting the form
    $("#reset").click(function () {
        // resets all fields to empty/default
        $('.container').find('input[type="text"], input[type="email"], input[type="date"], textarea').val('');
        $('.container #adults').val('1');
        $('.container #days, .container #cost').val('');
        $('.container input[type="range"]').val(0).change();
        $('.container input[type="radio"]').prop('checked', false);

        // removes and clears toastr previous notifications
        toastr.remove();
        toastr.clear();
        // throw toastr notification saying all fields have been cleared
        toastr.info('all form fields have been cleared.');

        // resets states of fields for safety purposes
        $('.container .form-group').removeClass('has-error has-success');
        $('.container .form-control').removeClass('is-invalid is-valid');
    });



    




    // function for submitting the form
    $("#submit").click(function () {
        
        // variable for the state of the form (has error or not)
        let hasError = false;

        // checking if required fields were filled out or not
        // required fields: username, first name, last name, phone number, fax number, email address
        $("#username, #firstName, #lastName, #phone, #fax, #email").each(function () {
            
            // when a required field is empty, throw toastr notification saying such field is not enetred
            if (!$(this).val()) {
                $(this).closest(".form-group").addClass("has-error");
                toastr.error($(this).attr("placeholder") + " was not entered.");
                hasError = true;
            } 
            // otherwise remove the .has-error class from the field
            else {
                $(this).closest(".form-group").removeClass("has-error");
            }
        });

        // checking cost. safety measures to validate that the cost is reasonable (exists, strictly positive)
        const total_cost = $("#cost").val();
        if (!total_cost) {
            toastr.error("no cost was calculated. please specify.");
            hasError = true;
        } 
        else if (total_cost < 0) {
            toastr.error("cost is negative. please try again.");
            hasError = true;
        }
        else if (total_cost == 0) {
            toastr.error("cost is zero. please try again.");
            hasError = true;
        }

        // final check for the state of the form before form submission
        // throw successful toastr notification 
        if (!hasError) {
            toastr.success("form was successfully submitted.");
        }
    });
});
