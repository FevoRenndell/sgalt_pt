import {
    getUsers,
    updateUser,
    deleteUser,
    createUser,
    getUserById,
    softDeleteUser
} from '../services/userService.js';

export const fetchUsers = async (req, res) => {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const addUser = async (req, res, next) => {
    try {
        const newUser = await createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

export const fetchUserById = async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const modifyUser = async (req, res) => {
    try {
        const updatedUser = await updateUser(req.params.id, req.body);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

export const removeUser = async (req, res) => {
    try {
        const deletedUser = await softDeleteUser(req.params.id);
        res.status(200).json(deletedUser);
    } catch (error) {
        next(error);
    }
};

 