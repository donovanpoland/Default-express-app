import { Router } from 'express';
import { index } from './controllers/homeController.js';
import { testErrorPage } from './controllers/errorsController.js';
import {
    //pages
    userRegistrationForm, loginForm, showDashboard, showAllUsers, showEditUserForm,
    //processing
    processUserRegistration, processLogin, processLogout, processEditUser,
    //required
    requireLogin, requireRole, requireSelf
} from './controllers/usersController.js';

// middleware rate limiters
import {
    loginLimiter,
    registrationLimiter,
} from './middleware/rateLimiters.js';


// Validation imports
import {
    userValidation,
    loginValidation,
    userEditValidation,
    handleValidationErrors,
} from './controllers/validationController.js';


// Users validation

const router = Router();


/*** Routes imported from controllers***/
router.get('/', index);

//users
router.get('/register-user', userRegistrationForm);
router.post(
    '/register-user',
    // limit number of registrations
    registrationLimiter,
    // Validate request
    userValidation,
    // Handle errors and preserve first and last names and email on validation error
    handleValidationErrors('/register-user', [
            'fname',
            'lname',
            'email',
    ]),
    // proceed with registration
    processUserRegistration
);
router.get('/login-user', loginForm);
router.post(
    '/login-user',
    // limit number of logins
    loginLimiter,
    // Validate request
    loginValidation,
    // Handle errors and preserve email on validation error
    handleValidationErrors('/login-user', ['email']),
    // Proceed to login user
    processLogin
);
router.post('/logout-user', processLogout);
router.get('/dashboard', requireLogin, showDashboard);
router.get('/users', requireRole('admin'), showAllUsers);
router.get('/edit-user/:id', requireLogin, requireSelf, showEditUserForm);
router.post(
    '/edit-user/:id', 
    requireLogin,
    requireSelf,
    userEditValidation,
    handleValidationErrors(
        (req) => `/edit-user/${req.params.id}`, 
        ['firstName', 'lastName', 'userEmail'],
    ),
    processEditUser);


// error-handling routes
router.get('/test-error', requireLogin, testErrorPage);


// export router to server.js
export default router;
