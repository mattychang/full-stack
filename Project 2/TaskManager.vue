<!-- @author Matthew Chang
     CSDS 221: manages the overall task management application -->

<!-- HTML portion -->
<template>
  <div class = "container">

    <!-- header containing frameworks title and add button-->
    <div class = "header">

      <h1 class = "title"><i class = "fa fa-list"></i> 
        FRAMEWORKS
      </h1>

      <button
        type = "button"
        class = "btn btn-primary add-button"
        @click = "openModal"
      >
        <i class = "fas fa-plus"></i> 
        Add
      </button>
    </div> <!-- end of header -->

    <!-- integrating task table components -->
    <TaskTable 
      :tasks = "tasks" 
      @edit-task = "editTask" 
      @delete-task = "deleteTask" 
    />

    <!-- integrating task dialog components -->
    <TaskDialog
      :task = "localTask"
      :show = "showDialog"
      :isEditMode = "isEditMode"
      :existingTasks = "tasks"
      @save-task = "saveTask"
      @update:show = "showDialog = $event"
    />

    <!-- including toast component -->
    <Toast 
      ref = "toast"
    />
  </div>
</template>






<!-- JS portion -->
<script>
  // importing components
  import { ref, getCurrentInstance } from 'vue';
  import TaskDialog from './components/TaskDialog.vue';
  import TaskTable from './components/TaskTable.vue';
  import Toast from './components/Toast.vue';

  export default {
    name: 'TaskManager',

    components: {
      TaskDialog,
      TaskTable,
      Toast,
    },
    setup() {
      const tasks = ref([]);                      // reactive reference for the list of tasks

      const localTask = ref({                     // reactive reference for the task object
        task: '',
        description: '',
        deadline: '',
        priority: '',

        isComplete: false,
      });

      const { proxy } = getCurrentInstance();     // gets the current component instance to access refs

      const isEditMode = ref(false);              // reactive reference to determine if the task dialog is in edit mode
      
      const showDialog = ref(false);              // reactive reference to control the visibility of the task dialog

      const openModal = () => {                   // function that opens the task dialog
        localTask.value = {
          task: '',
          description: '',
          deadline: '',
          priority: '',
          isComplete: false,
        };

        isEditMode.value = false;
        showDialog.value = true;
      };

      const triggerToast = (message, type) => {   // function that triggers toastr notification

        const toast = proxy.$refs.toast;

        if (type === 'success') {
          toast.success(message);
        } 

        else if (type === 'error') {
          toast.error(message);
        }
        
      };

      const editTask = (task) => {                // function that edits the task dialog for the selected task
        localTask.value = { ...task };

        isEditMode.value = true;
        showDialog.value = true;
      };

      const deleteTask = (taskToDelete) => {      // function that deletes task with toastr notification
        tasks.value = tasks.value.filter((task) => task.id !== taskToDelete.id);
        triggerToast('task was deleted successfully', 'success');
      };

      const saveTask = (task) => {                // function that saves task with toastr notification (add and update)
        if (isEditMode.value) {

          const index = tasks.value.findIndex((t) => t.id === task.id);

          if (index !== -1) {
            tasks.value.splice(index, 1, task);

            triggerToast('task was updated successfully', 'success');
          }
        } 

        else {
          tasks.value.push({ ...task, id: Date.now() });

          triggerToast('task was added successfully', 'success');
        }

        showDialog.value = false;
      };

      return {
        tasks,
        localTask,
        isEditMode,
        openModal,
        showDialog,
        saveTask,
        editTask,
        deleteTask,
        triggerToast,
      };
    },
  };
</script>








<!-- CSS portion -->
<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  margin: 20px;
  align-items: center;
  background-color: #1666BE;
  color: white;
}

.title {
  margin: 0 auto; /* centers */
}

.add-button {
  margin: 20px 40px 20px 40px;
}
</style>
