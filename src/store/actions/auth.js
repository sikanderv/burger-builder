import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    }
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
};

export const setAuthState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logout());
        } else {
            const expirationTime = new Date(localStorage.getItem('expirationTime'));
            // Alt. apporach to get user id from firebase
            // issue POST request to https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=[API_KEY
            // See https://firebase.google.com/docs/reference/rest/auth/#section-get-account-info
            if (expirationTime > new Date()) {
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, userId));
                dispatch(checkAuthTimeout( (expirationTime.getTime() - new Date().getTime()) /1000) ) ;
            } else {
                dispatch(logout());
            }
            
        }
    }
};


/* 
    ASYNC ACTIONS/CODE 
*/
export const auth = (email, password, isSignUp) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };

        let url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyA0O2qP0fvNs47p2d7bC278Q_rdhI03ZZ8";
        if (!isSignUp) {
            url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyA0O2qP0fvNs47p2d7bC278Q_rdhI03ZZ8";
        }

        axios.post(url, authData)
            .then(response => {
                console.log(response);
                const expirationTime = new Date(new Date().getTime() + (response.data.expiresIn * 1000));
                localStorage.setItem('token',response.data.token);
                localStorage.setItem('expirationTime', expirationTime);
                localStorage.setItem('userId', response.data.localId);
                dispatch(authSuccess(response.data.idToken, response.data.localId));
                dispatch(checkAuthTimeout(response.data.expiresIn));
            })
            .catch(err => {
                // Axios allows access to the original response object even in catch
                // so we can wrap the err with response to get additional information about the error message
                dispatch(authFail(err.response.data.error));
            });
    }
};


// related to token expiring and logging out
// dispatches logout when expirationTime is reached
export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000)
    }
};
