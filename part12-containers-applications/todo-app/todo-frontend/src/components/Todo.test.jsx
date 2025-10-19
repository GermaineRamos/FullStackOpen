import { render, screen } from '@testing-library/react';
import Todo from './Todo';

describe('Todo component', () => {
  it('renders todo text', () => {
    const todo = {
      text: 'Write tests',
      done: false
    };

    render(<Todo todo={todo} completeTodo={() => {}} deleteTodo={() => {}} />);
    
    expect(screen.getByText('Write tests')).toBeInTheDocument();
  });

  it('shows not done status for incomplete todo', () => {
    const todo = {
      text: 'Test todo',
      done: false
    };

    render(<Todo todo={todo} completeTodo={() => {}} deleteTodo={() => {}} />);
    
    expect(screen.getByText('This todo is not done')).toBeInTheDocument();
  });

  it('shows done status for completed todo', () => {
    const todo = {
      text: 'Completed task',
      done: true
    };

    render(<Todo todo={todo} completeTodo={() => {}} deleteTodo={() => {}} />);
    
    expect(screen.getByText('This todo is done')).toBeInTheDocument();
  });

  it('does not show complete button for done todos', () => {
    const todo = {
      text: 'Done task',
      done: true
    };

    render(<Todo todo={todo} completeTodo={() => {}} deleteTodo={() => {}} />);
    
    expect(screen.queryByText('Set as done')).not.toBeInTheDocument();
  });
});
