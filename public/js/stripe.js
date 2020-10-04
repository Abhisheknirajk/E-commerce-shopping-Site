
import axios from 'axios';
import {showAlert} from './alert';
const stripe = Stripe('pk_test_5W4XHflxYa0Cm97ADYZMxr3600utYa4yzD');


export const bookMobile = async mobileId => {
   try{
        //1) Get checkout session fro Api
    const session = await axios(
        `http://localhost:9000/api/v1/bookings/checkout-session/${mobileId}`
    
      );
      
    console.log(session);
    //2)Create checkout from +chance credait card
    await stripe.redirectToCheckout({
        sessionId:session.data.session.id
    });
   }catch(err){
       console.log(err);
       showAlert('error',err)
   }
    

};