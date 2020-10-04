/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const singup = async (name,email, password,passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url:'http://localhost:9000/api/v1/users/singup',
      
      data: {
        name,
        email,
        password,
        passwordConfirm
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Account created  successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};



// url:' http://localhost:9000/api/v1/users/login',
