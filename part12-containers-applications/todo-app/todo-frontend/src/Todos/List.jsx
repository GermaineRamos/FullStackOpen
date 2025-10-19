import React from 'react'
import Todo from '../components/Todo'

const TodoList = ({ todos, deleteTodo, completeTodo }) => {
  return (
    <>
      {todos.map(todo => (
        <React.Fragment key={todo._id}>
          <hr />
          <Todo 
            todo={todo}
            deleteTodo={deleteTodo}
            completeTodo={completeTodo}
          />
        </React.Fragment>
      ))}
      <hr />
    </>
  )
}

export default TodoList
