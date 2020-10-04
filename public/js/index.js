import '@babel/polyfill';
import {login,logout} from './login';
import {singup} from './singup';
import {updateSettings} from './updateSettings';
import {bookMobile} from './stripe';

//DOM ELEMENTS
const loginform = document.querySelector('.form--login');
const singupForm = document.querySelector('.form--singup');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form--update');
const userPasswordChange = document.querySelector('.form--update-password');
const bookBtn = document.getElementById('addbutton');

if(loginform){
    loginform.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
      });
}

if(logoutBtn){
  logoutBtn.addEventListener('click',logout)
}

if(userDataForm){
  userDataForm.addEventListener('submit',e=>{
    e.preventDefault();
    const form  = new FormData();
    form.append('name',document.getElementById('name').value);
    form.append('email',document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    // const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value;
    updateSettings(form,'data')
  });
}

if(userPasswordChange){
  userPasswordChange.addEventListener('submit',  async e=>{
    e.preventDefault();
  
 
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
     await updateSettings({passwordCurrent,password,passwordConfirm},'password')
  });
  
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';

}

if (bookBtn)
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const {mobileId}  = e.target.dataset;
    bookMobile(mobileId);
  });

  if(singupForm){
    singupForm.addEventListener('submit',e => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('passwordConfirm').value;
    
      
      singup(name,email,password,passwordConfirm);
    });
  }




  
