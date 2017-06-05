import axios from 'axios';
import { browserHistory } from 'react-router';
import { 
	AUTH_USER,
	UNAUTH_USER,
	AUTH_ERROR,
	FETCH_MESSAGE
} from './types';

const API_URL = 'http://localhost:3001';

export function signinUser({ email, password }) {
	return (dispatch) => {
		// Submit email/password to the server
		axios.post(`${API_URL}/signin`, { email, password })
			.then(res => {
				// If request is good...
				// - Update state to indicate user is authenticated
				dispatch({ type: AUTH_USER });
				// - Save the JWT token
				localStorage.setItem('token', res.data.token);
				// - Redirect to the route '/feature'
				browserHistory.push('/feature');
			})
			.catch(() => {
				// If request is bad...
				// - Show an error to the user
				dispatch(authError('Bad Login Info'));
			});
	}
}

export function signupUser({ email, password }) {
	return function(dispatch) {
		axios.post(`${API_URL}/signup`, { email, password })
			.then(res => {
				dispatch({ type: AUTH_USER });
				localStorage.setItem('token', res.data.token);
				browserHistory.push('/feature');
			})
			.catch(res => dispatch(authError(res.data.err)))
	}
}

export function authError(error) {
	return {
		type: AUTH_ERROR,
		payload: error
	};
}

export function signoutUser() {
	localStorage.removeItem('token');


	return { type: UNAUTH_USER };
}

export function fetchMessage() {
	return function(dispatch) {
		axios.get(API_URL, {
			headers: { authorization: localStorage.getItem('token') }
		})
			.then(res => {
				dispatch({
					type: FETCH_MESSAGE,
					payload: res.data.message
				});
			});
	}
}



// REDUX PROMISE STRUCTURE
// export function fetchMessage() {
// 	const request = axios.get(API_URL, {
// 		headers: { authorization: localStorage.getItem('token') }
// 	});

// 	return {
// 		type: FETCH_MESSAGE,
// 		payload: request
// 	};
// }








