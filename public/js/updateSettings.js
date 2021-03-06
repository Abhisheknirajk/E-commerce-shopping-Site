/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const updateSettings = async (data,type)=>{
try{
    const url =
     type === 'password'
     ? 'http://localhost:9000/api/v1/users/updatePassword' 
     : 'http://localhost:9000/api/v1/users/updateMe';
    const res = await axios({
     method:'PATCH',
     url,
     data
    });
    if((res.data.status === 'success')){
        showAlert('success',`${type}updated successfully`);
        window.setTimeout(() => {
            location.assign('/');
          }, 1500);
    }
}catch(err){
showAlert('error',err.response.data.message)
}
}

