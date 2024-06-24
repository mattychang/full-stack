<!-- @author Matthew Chang
     CSDS 221: handles displaying tasks and emitting events for task actions -->

<!-- HTML portion -->
<template>
  <table class = "table"> <!-- displays table -->
    <thead> <!-- header (non-interactive) -->
      <tr>
        <th scope = "col">
          Title
        </th>
        <th scope = "col">
          Description
        </th>
        <th scope = "col">
          Deadline
        </th>
        <th scope = "col">
          Priority
        </th>
        <th scope = "col">
          Is Complete
        </th>
        <th scope = "col">
          Actions
        </th>
      </tr>
    </thead>
    <tbody> <!-- body (only buttons are interactive) -->
      <tr v-for = "task in tasks" :key = "task.id"> <!-- looping for each task per row -->
        <td>{{ task.task }}</td>
        <td>{{ task.description }}</td>
        <td>{{ formatDate(task.deadline) }}</td>
        <td>{{ task.priority }}</td>

        <td> <!-- is complete? checkbox -->
          <input type = "checkbox" v-model = "task.isComplete" />
        </td>

        <td> <!-- edit and delete buttons -->
          <button
            class = "btn btn-primary btn-sm"
            @click = "editTask(task)"
            v-if = "!task.isComplete"
          >
            <i class = "fas fa-edit"></i>
            Update
          </button>

          <button
            type = "button"
            class = "btn btn-danger btn-sm"
            @click = "$emit('delete-task', task)"
          >
            <i class = "fas fa-times-circle icon"></i> 
             Delete
          </button>
        </td> <!-- end of edit and delete buttons-->

      </tr>
    </tbody>
  </table>
</template>




<!-- JS portion -->
<script>
export default {
  name: 'TaskTable',
  props: {
    tasks: Array,
  },
  methods: {
    editTask(task) {
      this.$emit('edit-task', task);
    },

    deleteTask(task) {
      this.$emit('delete-task', task);
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
      const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
      return date.toLocaleDateString('en-US', options);
    }
  },
};
</script>



<!-- CSS portion -->
<style scoped>
.table {
  width: 100%;
  table-layout: fixed; /* equal spacing of columns */
}

th, td {
  text-align: center; /* centers rows entries in the column */
}
</style>
