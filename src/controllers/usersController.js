import bcrypt from 'bcrypt';
import { pageMeta } from '../config/pageMeta.js';
  import {
    createUser,
    authenticateUser,
    getUserInfo,
    updateUserById,
    getUserSessionInfoById,
    getAllUsers,
  } from '../models/usersModel.js';


// render user registration form with applicable data
const userRegistrationForm = async (req, res) => {

    
    // set form data if saved in session
    const formData = req.session.formData ?? {};
    // Remove old session data
    delete req.session.formData;

    // render registration data
    res.render('users/register-user', { 
        ...pageMeta.registration,
        // get saved form data
        email: formData.email ?? '',
        fname: formData.fname ?? '',
        lname: formData.lname ?? '',
    });
};

// save user to database and redirect
const processUserRegistration = async (req, res) => {
    // initialize body info
    const { fname, lname, email, password } = req.body;

    try {
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create the user in the database
        await createUser(fname, lname, email, passwordHash);

        // Redirect to the home page after successful registration
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect(303, '/');
    } catch (error) {
        console.error('Error registering user:', error);
        if (error.code === '23505' && error.constraint === 'users_user_email_key') {
            req.flash('error', 'That email is already registered. Please log in or use a different email.');
            req.session.formData = { fname, lname, email };
            return res.redirect(303, '/register-user');
        }
        req.flash('error', 'An error occurred during registration. Please try again.');
        req.session.formData = { fname, lname, email };
        return res.redirect(303, '/register-user');
        
    }
};

// render login form form with applicable data
const loginForm = (req, res) => {
    // reset form data if saved in session
    const formData = req.session.formData ?? {};
    delete req.session.formData;

    // Render login data
    res.render('users/login-user', { 
        // Get page meta data
        ...pageMeta.login,
        // get saved form data
        email: formData.email ?? '',
    });
};

// authenticate, login user and redirect
const processLogin = async (req, res, next) => {

    // initialize body info
    const { email, password } = req.body;

    try {
        // authenticate user data
        const user = await authenticateUser(email, password);
        if (user) {
            // Delete stored session data
            delete req.session.formData;
            // Store user info in session
            req.session.user = user;
            // Display login successful flash message
            req.flash(
                'success',
                 `Welcome ${user.first_name} ${user.last_name}, you have been successfully logged in!`
            );

            // if in development mode log user info to the console
            if (process.env.NODE_ENV === 'development') {
                console.log('User logged in:', user);
            }

            // exit controller and redirect to home on success
            return res.redirect(303, '/');
        } else {
            // get email from session
            req.session.formData = { email };
            // warn user
            req.flash('warning', 'Invalid email or password.');

            // exit controller and redirect to log in
            return res.redirect(303, '/login-user'); 
        }
    } catch (error) {
        // exit controller go to next middleware route and send error
        return next(error);
    };
};

// log out user, delete session data and redirect
const processLogout = async (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }

    // Message user of logout
    req.flash('success', 'Logout successful!');
    // Redirect to login page
    res.redirect(303, '/login-user');
};

// require login for specific features to be accessed
const requireLogin = (req, res, next) => {
    // check for user session
    if (!req.session || !req.session.user) {
        // send message if not logged in
        req.flash('warning', 'You must be logged in to access that page.');
        // Redirect to login page
        return res.redirect(303, '/login-user');
    }
    next();
};

// require authentication of self to modify user data
const requireSelf = (req, res, next) => {
    // check for user session
    if (!req.session?.user) {
        // send message if not logged in
        req.flash('error', 'You must be logged in.');
        // redirect to log in page
        return res.redirect(303, '/login-user');
    }
    // if attempting to access non self data
    if (req.session.user.user_id !== Number(req.params.id)) {
        // send message about account edit
        req.flash('warning', 'You can only edit your own account.');
        // redirect to own dashboard
        return res.redirect(303, '/dashboard');
    }
    next();
};

// display dashboard for logged in user
const showDashboard =  async (req, res) => {
    // get the user from information from saved session
    const user = req.session.user;

    //render dashboard and page data
    res.render('users/dashboard', { 
        ...pageMeta.dashboard,
        user,
    });
};

// display all users in database to admin
const showAllUsers = async (req, res) => {
    // get all user from database
    const users = await getAllUsers();

    // render all users page and data
    res.render('users/users', { 
        ...pageMeta.allUsers,
        users
    });
};

/**
 * Middleware factory to require specific role for route access
 * Returns middleware that checks if user has the required role
 * 
 * @param {string} role - The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
const requireRole = (role) => {
    return (req, res, next) => {
        // Check if user is logged in first
        if (!req.session || !req.session.user) {
            // send message to user about login requirement
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect(303, '/login-user');
        }

        // Check if user's role matches the required role
        if (req.session.user.role_name !== role) {
            // send message to user about page permission
            req.flash('error', 'You do not have permission to access this page.');
            // redirect to home page
            return res.redirect(303, '/');
        }

        // User has required role, continue
        next();
    };
};

// display user edit from
const showEditUserForm = async (req, res) => {
    // get user id from param
    const userId = req.params.id;
    // reset form session data
    const formData = req.session.formData ?? {};
    delete req.session.formData;
    // get user info
    const storedUser = await getUserInfo(userId);
    const user = {
      ...storedUser,
      first_name: formData.firstName ?? storedUser.first_name,
      last_name: formData.lastName ?? storedUser.last_name,
      user_email: formData.userEmail ?? storedUser.user_email,
    };
    
    
    // render edit user page and data
    res.render('users/edit-user', { 
        ...pageMeta.userEdit,
        user,
    });
};

// update users information, redirect
const processEditUser = async (req, res) => {
    const userId = req.params.id;
    // Extract form data from req.body
    const {firstName, lastName, userEmail} = req.body;
    // catch errors or update successful
    try {
        // update the user in the database - id is returned when updateUserById is used
        await updateUserById(firstName, lastName, userEmail, userId);
        // update user info in session
        req.session.user = await getUserSessionInfoById(userId);
        // Send flash message to user
        req.flash('success', `${firstName} ${lastName} your info has been updated successfully!`)
        // Redirect to dashboard
        res.redirect(`/dashboard`);
    } catch (error) {
        console.error('Error updating user info:', error);
        // Send flash message to user
        req.flash('error', 'There was an error updating the your info.');
        // Redirect to user edit page
        res.redirect(`/edit-user/${userId}`);
    }
};

export {
    //pages
    userRegistrationForm, loginForm, showDashboard, showAllUsers, showEditUserForm,
    //processing
    processUserRegistration, processLogin, processLogout, processEditUser,
    //required
    requireLogin, requireRole, requireSelf
};