const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const pug = require('pug');
module.exports = class Email{
 constructor(user,url){
  this.to = user.email;
  this.firstName = user.name.split(' ')[0];
  this.url = url;
  this.from = `abhishekNiraj<${process.env.EMAIL_FROM}>`;
 }
 newTransport(){
   if (process.env.NODE_ENV === 'production')
   {
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
   }
   return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    addd: process.env.EMAIL_ADDRESS,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
      authen: process.env.EMAIL_AUTHENTICATION
    }
  });
 }
 async send (template,subject){
   // 1) Render HTML based on a pug template
   const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
    firstName: this.firstName,
    url: this.url,
    subject
  });
   // 2) Define the email options
  const mailOptions = {
    from: this.from,
    to: this.to,
    subject,
    html,
    text: htmlToText.fromString(html)
    
  };

  // 3) Actually send the email
  await this.newTransport().sendMail(mailOptions);
}
 async sendWelcom(){
   await this.send('welcome','Welcome to the Mobile Store');
 }
 async sendPasswordReset(){
   await this.send('passwordReset','Your password reset token (valid for only 10 minutes)')
 }
 };
