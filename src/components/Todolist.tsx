import React, { useState, useEffect } from 'react';
import { Button, TextField, Checkbox, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import './TodoList.css';

interface ITodo {
    id: number;
    name: string;
    completed: boolean;
}

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<ITodo[]>([]);
    const [todoName, setTodoName] = useState('');
    const [editTodoId, setEditTodoId] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [deleteTodoId, setDeleteTodoId] = useState<number | null>(null);

    useEffect(() => {
        // Dữ liệu mẫu
        const sampleTodos: ITodo[] = [
            { id: 1, name: 'Ngủ', completed: false },
            { id: 2, name: 'Học React', completed: true },
            { id: 3, name: 'Chơi game', completed: false },
        ];

        // Lấy dữ liệu từ localStorage hoặc sử dụng dữ liệu mẫu nếu không có dữ liệu
        const storedTodos = JSON.parse(localStorage.getItem('todos') || '[]');

        if (storedTodos.length === 0) {
            // Nếu không có dữ liệu trong localStorage, sử dụng dữ liệu mẫu và lưu vào localStorage
            localStorage.setItem('todos', JSON.stringify(sampleTodos));
            setTodos(sampleTodos);
        } else {
            setTodos(storedTodos);
        }
    }, []);

    const validate = (): boolean => {
        if (!todoName) {
            setError('Tên công việc không được để trống');
            return false;
        }
        if (todos.find(todo => todo.name === todoName && todo.id !== editTodoId)) {
            setError('Tên công việc không được phép trùng');
            return false;
        }
        setError('');
        return true;
    };

    const handleAddTodo = () => {
        if (validate()) {
            const newTodo: ITodo = {
                id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
                name: todoName,
                completed: false
            };
            const newTodos = [...todos, newTodo];
            setTodos(newTodos);
            localStorage.setItem('todos', JSON.stringify(newTodos));
            setTodoName('');
        }
    };

    const handleDeleteTodo = () => {
        if (deleteTodoId !== null) {
            const newTodos = todos.filter(todo => todo.id !== deleteTodoId);
            setTodos(newTodos);
            localStorage.setItem('todos', JSON.stringify(newTodos));
            setOpen(false);
        }
    };

    const handleEditTodo = (id: number, name: string) => {
        setTodoName(name);
        setEditTodoId(id);
    };

    const handleUpdateTodo = () => {
        if (validate() && editTodoId !== null) {
            const newTodos = todos.map(todo =>
                todo.id === editTodoId ? { ...todo, name: todoName } : todo
            );
            setTodos(newTodos);
            localStorage.setItem('todos', JSON.stringify(newTodos));
            setTodoName('');
            setEditTodoId(null);
        }
    };

    const handleToggleComplete = (id: number) => {
        const newTodos = todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        setTodos(newTodos);
        localStorage.setItem('todos', JSON.stringify(newTodos));
    };

    return (
        <div className="todo-container">
            <h1>Danh sách công việc</h1>
            <div className="input-group">
                <TextField
                    value={todoName}
                    onChange={e => setTodoName(e.target.value)}
                    label="Nhập tên công việc"
                    error={!!error}
                    helperText={error}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={editTodoId !== null ? handleUpdateTodo : handleAddTodo}
                >
                    {editTodoId !== null ? 'Cập nhật' : 'Thêm'}
                </Button>
            </div>
            <List>
                {todos.map(todo => (
                    <ListItem key={todo.id} button>
                        <Checkbox
                            checked={todo.completed}
                            onChange={() => handleToggleComplete(todo.id)}
                        />
                        <ListItemText
                            primary={todo.name}
                            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleEditTodo(todo.id, todo.name)}>
                                <EditIcon className="edit-icon" />
                            </IconButton>
                            <IconButton edge="end" onClick={() => { setOpen(true); setDeleteTodoId(todo.id); }}>
                                <DeleteIcon className="delete-icon" />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <DialogContentText>Bạn có chắc chắn muốn xóa công việc này không?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleDeleteTodo} color="primary" autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
            <div className="todo-footer">
                {todos.every(todo => todo.completed) ? (
                    <p>Hoàn thành công việc</p>
                ) : (
                    <p>Công việc đã hoàn thành: {todos.filter(todo => todo.completed).length} / {todos.length}</p>
                )}
            </div>
        </div>
    );
};

export default TodoList;
