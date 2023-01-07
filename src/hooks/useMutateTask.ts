import useStore from '../store';
import { api } from '../utils/api';

export const useMutateTask = () => {
  const utils = api.useContext();
  const reset = useStore((state) => state.resetEditedTask)

  const createTaskMutation = api.todo.createTask.useMutation({
    onSuccess: (res) => {
      const previousTodo = utils.todo.getTasks.getData();
      if (previousTodo) {
        // TODO: setDataの第一引数に入るべき値の調査: https://github.com/trpc/trpc/pull/3124/files
        // undefined指定で済ませてる例があったのでそれに従う
        utils.todo.getTasks.setData(undefined, [res, ...previousTodo])
      }
      reset()
    }
  })
  const updateTaskMutation = api.todo.updateTask.useMutation({
    onSuccess: (res) => {
      const previousTodos = utils.todo.getTasks.getData()
      if (previousTodos) {
        utils.todo.getTasks.setData(
          undefined,
          previousTodos.map((task) => (task.id === res.id ? res : task))
        )
      }
      reset()
    },
  })
  const deleteTaskMutation = api.todo.deleteTask.useMutation({
    onSuccess: (_, variables) => {
      const previousTodos = utils.todo.getTasks.getData()
      if (previousTodos) {
        utils.todo.getTasks.setData(
          undefined,
          previousTodos.filter((task) => task.id !== variables.taskId)
        )
      }
      reset()
    },
  })
  return { createTaskMutation, updateTaskMutation, deleteTaskMutation }
}
