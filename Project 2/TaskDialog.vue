<!-- @author Matthew Chang
     CSDS 221: handles the task form and emits events for saving/editing tasks -->

<!-- HTML portion-->
<template>
  <div
    id = "TaskDialog"
    ref = "modal"
    class = "modal fade"
    tabindex = "-1"
    role = "dialog"
    aria-labelledby = "exampleModalLabel"
    aria-hidden = "true"
  >
    <div class = "modal-dialog" role = "document">
      <div class = "modal-content">
        <div class = "modal-header">
          <h5 class = "modal-title">
            {{ isEditMode ? 'Edit Task' : 'Add Task' }}
          </h5>

          <button
            type = "button"
            class = "btn-close"
            aria-label = "Close"
            @click = "closeDialog"
          ></button>

        </div>
        <div class = "modal-body">
          <form @submit.prevent = "saveTask">

            <!-- task input field (only shown when add button is clicked) -->
            <div v-if = "!isEditMode" class = "mb-3"> 
              <label for = "taskName" class = "form-label">
                Task
              </label>
              <input
                type = "text"
                class = "form-control"
                :class = "{ 'is-invalid': taskError || duplicateError }"
                id = "taskName"
                v-model = "localTask.task"
                placeholder = "Title"
              />
              <!-- requirements satisfied or throw error -->
              <div v-if = "taskError" class = "invalid-feedback">
                Task is required.
              </div>
              <div v-if = "duplicateError" class = "invalid-feedback">
                Task name must be unique.
              </div>
            </div>

            <!-- description input field (nearly identical to task field) -->
            <div class = "mb-3">
              <label for = "taskDescription" class = "form-label">
                Description
              </label>
              <textarea
                class = "form-control"
                :class = "{ 'is-invalid': descriptionError }"
                id = "taskDescription"
                v-model = "localTask.description"
                placeholder = "Description"
              ></textarea>
              <!-- requirements satisfied or throw error -->
              <div v-if = "descriptionError" class = "invalid-feedback">
                Description is required.
              </div>
            </div>

            <!-- deadline input field -->
            <div class = "mb-3">
              <label for = "taskDeadline" class = "form-label">
                Deadline
              </label>
              <input
                type = "date"
                class = "form-control"
                :class = "{ 'is-invalid': deadlineError }"
                id = "taskDeadline"
                v-model = "localTask.deadline"
              />
              <!-- requirements satisfied or throw error -->
              <div v-if = "deadlineError" class = "invalid-feedback">
                Deadline is required.
              </div>
            </div>

            <!-- priority input field (low, medium, high) -->
            <div class = "mb-3">
              <label class = "form-label">
                Priority
              </label>
              <div class = "form-check">
                <input
                  class = "form-check-input"
                  type = "radio"
                  name = "priorityOptions"
                  id = "lowPriority"
                  value = "Low"
                  v-model = "localTask.priority"
                />
                <label class = "form-check-label" for = "lowPriority">
                  Low
                </label>
              </div>
              <div class = "form-check">
                <input
                  class = "form-check-input"
                  type = "radio"
                  name = "priorityOptions"
                  id = "mediumPriority"
                  value = "Medium"
                  v-model = "localTask.priority"
                />
                <label 
                  class = "form-check-label" 
                  for = "mediumPriority"
                >
                  Medium
                </label>
              </div>
              <div class = "form-check">
                <input
                  class = "form-check-input"
                  type = "radio"
                  name = "priorityOptions"
                  id = "highPriority"
                  value = "High"
                  v-model = "localTask.priority"
                />
                <label 
                  class = "form-check-label" 
                  for = "highPriority"
                >
                  High
                </label>
              </div>
              <!-- requirements satisfied or throw error -->
              <div v-if = "priorityError" class = "invalid-feedback d-block">
                Priority is required.
              </div>
            </div>
          </form>
        </div>

        <!-- cancel and save task buttons -->
        <div class = "modal-footer">
          <button type = "button" class = "btn btn-secondary" @click = "closeDialog">
            Cancel
          </button>
          <button type = "button" class = "btn btn-primary" @click = "saveTask">
            Save Task
          </button>
        </div>

      </div>
    </div>
  </div>
</template>





<!-- JS portion -->
<script>
import { ref, watch, onMounted } from 'vue';
import bootstrap from 'bootstrap';

export default {
  name: 'TaskDialog',
  props: {
    task: Object,                                   // the task to be edited
    show: Boolean,                                  // whether the dialog is visible or not
    isEditMode: Boolean,                            // whether the dialog is in edit mode or not
    existingTasks: {
      type: Array,
      default: () => [],
    },
  },

  // local copy of the task being edited or added
  setup(props, { emit }) {
    const localTask = ref({ ...props.task });
    const taskError = ref(false);
    const descriptionError = ref(false);
    const deadlineError = ref(false);
    const priorityError = ref(false);
    const duplicateError = ref(false);
    const modalInstance = ref(null);

    // initialize the bootstrap model
    onMounted(() => {
      const modalElement = document.getElementById('TaskDialog');
      modalInstance.value = new bootstrap.Modal(modalElement);

      // show the modal if the show prop is true
      if (props.show) {
        modalInstance.value.show();
      }
    });

    // watch the show prop and show or hide the modal as intended
    watch(
      () => props.show,
      (newVal) => {
        if (newVal) {
          modalInstance.value.show();
        } else {
          modalInstance.value.hide();
        }
      }
    );

    // check if task name exists (duplicate)
    const isDuplicateTaskName = () => {
      return props.existingTasks.some(
        (task) =>
          task.task === localTask.value.task && task.id !== localTask.value.id
      );
    };

    // close the dialog 
    const closeDialog = () => {
      modalInstance.value.hide();
      emit('update:show', false);
    };

    // save task
    const saveTask = () => {
      taskError.value = !localTask.value.task;
      descriptionError.value = !localTask.value.description;
      deadlineError.value = !localTask.value.deadline;
      priorityError.value = !localTask.value.priority;
      duplicateError.value = isDuplicateTaskName();

      if (
        taskError.value ||
        descriptionError.value ||
        deadlineError.value ||
        priorityError.value ||
        duplicateError.value
      ) {
        return;
      }

      emit('save-task', localTask.value);
      closeDialog();
    };

    watch(
      () => props.task,
      (newTask) => {
        localTask.value = { ...newTask };
      }
    );

    return {
      localTask,
      taskError,
      descriptionError,
      deadlineError,
      priorityError,
      duplicateError,
      closeDialog,
      saveTask,
    };
  },
};
</script>



<!-- CSS portion -->
<style scoped>
.invalid-feedback {
  display: block;
}
</style>
