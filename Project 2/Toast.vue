<!-- @author Matthew Chang
     CSDS 221: handles displaying the toastr notifications for user actions. -->

<template></template>

<script>
    // importing toastr
    import toastr from 'toastr';
    import 'toastr/build/toastr.css';

    // toastr configuration: bottom right hand corner for 3 sec
    toastr.options = {
        positionClass: 'toast-bottom-right',
        timeOut: 3000,
    };

    export default {
        name: 'Toast',
        methods: {
            success(message) {
                toastr.success(message);
            },
            
            error(message) {
                toastr.error(message);
            },
        },
    };
</script>


<style scoped>
.toast { /* toastr notification styling */
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    border-radius: 4px;
    padding: 10px 20px 10px 20px;
    background-color: #252525;
    color: rgb(235, 233, 233);
  }

</style>
