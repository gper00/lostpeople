import bcrypt from 'bcrypt'
import User from '../models/user-model.js'
import { deleteUserImage } from '../utils/delete-file.js'

const layout = 'layouts/dashboard'
const pageActive = 'user'

const usersPage = async (req, res) => {
    const successMessage = req.flash('success')
    const errorMessage = req.flash('failed')
    try {
        const users = await User.aggregate([
            {
                $lookup: {
                    from: 'posts', // Nama koleksi posts
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'posts'
                }
            },
            {
                $addFields: {
                    postsCount: { $size: '$posts' }
                }
            },
            {
                $project: {
                    posts: 0 // Menghilangkan field posts jika tidak diperlukan
                }
            }
        ])

        res.render('dashboard/users/index', {
            layout,
            users,
            successMessage,
            errorMessage,
            pageActive
        })
    } catch (err) {
        console.error(err)
    }
}

const createUserPage = (req, res) => {
    const errors = req.flash('errors')[0] ?? {}
    const userData = req.flash('userData')[0] ?? {}

    res.render('dashboard/users/create', {
        layout,
        errors,
        userData,
        pageActive
    })
}

const storeUser = async (req, res) => {
    try {
        const { fullname, password, email } = req.body;

        // Generate unique username
        let baseUsername = fullname.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        let username = baseUsername;
        let userExists = await User.findOne({ username });
        let counter = 1;
        while (userExists) {
            username = `${baseUsername}${counter}`;
            userExists = await User.findOne({ username });
            counter++;
        }

        // Encrypt password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const user = new User({
            fullname,
            username,
            email,
            password: hashedPassword,
        });

        await user.save();
        req.flash('success', 'User created successfully!');
        res.redirect('/dashboard/users');
    } catch (err) {
        console.error(err);
        req.flash('failed',  err.message || 'Something went wrong');
        res.redirect('/dashboard/users/create');
    }
}

const userDetailPage = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (req.user._id.valueOf() !== user._id.valueOf() && req.user.role !== 'super-admin') {
            req.flash('failed', 'Unable to access the page')
            return res.redirect('/dashboard')
        }

        res.render('dashboard/users/detail', {
            layout,
            user,
            pageActive
        })
    } catch (err) {
        console.log(err)
    }
}


const editUserPage = async (req, res) => {
    const errors = req.flash('errors')[0] ?? {}
    const userData = req.flash('userData')[0] ?? {}

    try {
        const user = await User.findById(req.params.id)

        if (req.user._id.valueOf() !== user._id.valueOf() && req.user.role !== 'super-admin') {
            req.flash('failed', 'Unable to access the page')
            return res.redirect('/dashboard')
        }

        res.render('dashboard/users/edit', {
            layout,
            user,
            errors,
            userData,
            pageActive
        })
    } catch (err) {
        console.log(err)
        req.flash(
            'failed',
            err.name === 'CastError' ? 'User not found' : 'Something went wrong'
        )
        res.redirect('/dashboard/posts')
    }
}

const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (req.user._id.valueOf() !== user._id.valueOf() && req.user.role !== 'super-admin') {
            req.flash('failed', 'Method not allowed')
            return res.redirect('/dashboard')
        }

        if (!user) {
            req.flash('failed', 'User not found')
            return res.redirect('/dashboard/users')
        }

        let { fullname, username, email, password,  bio = null, facebook = null, instagram = null, twitter = null, whatsapp = null, telegram = null } = req.body

        if(password !== user.password){
            password = await bcrypt.hash(password, 10);
        }

        const updatedFields = {
            fullname,
            username,
            email,
            password,
            bio,
            socialMedia: {
                facebook,
                instagram,
                twitter,
                whatsapp,
                telegram
            }
        }

        if (req.file) {
            updatedFields.image = req.file.path
            if (user.image) {
                deleteUserImage(user.image)
                    .catch((err) => console.error(err.message))
            }
        }

        await User.findByIdAndUpdate(req.params.id, { $set: updatedFields })

        req.flash('success', req.user._id.valueOf() === user._id.valueOf() ? 'Update profile successfuly!' : 'User updated successfuly')
        res.redirect(req.user.role === 'super-admin' && req.user._id.valueOf() !== user._id.valueOf() ? '/dashboard/users' : '/dashboard')
    } catch (err) {
        console.error(err)
        req.flash(
            'failed',
            err.name === 'CastError' ? 'User not found' : 'Something went wrong'
        )
        res.redirect('/dashboard/users')
    }
}

const removeUserImage = async(req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user) {
            req.flash('failed', 'User not found')
            return res.redirect('/dashboard/users')
        }

        const updatedFields = {
            image: null
        }

        deleteUserImage(user.image)
            .catch((err) => console.error(err.message))

        await User.findByIdAndUpdate(req.params.id, { $set: updatedFields })

        res.redirect(`/dashboard/users/${req.params.id}/edit`)
    } catch (err) {
        console.error(err)
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user) {
            req.flash('failed', 'User not found')
            res.redirect('/dashboard/users')
        }

        if (user.image) {
            deleteUserImage(user.image)
                .catch((err) => console.error(err.message))
        }

        await User.findByIdAndDelete(req.params.id)
        req.flash('success', 'User deleted successfully')
        res.redirect('/dashboard/users')
    } catch (err) {
        console.error(err)
        req.flash(
            'failed',
            err.name === 'CastError' ? 'Usernot found' : 'Something went wrong'
        )
        res.redirect('/dashboard/users')
    }
}

export {
    usersPage,
    createUserPage,
    storeUser,
    userDetailPage,
    editUserPage,
    updateUser,
    removeUserImage,
    deleteUser
}
