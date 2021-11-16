//otpravka polzowatelu podtwergdenija registracii
//ispolzujem nodemailer
const nodemailer = require('nodemailer');

class MailService {
  //paramitry funkcii to - email, kuda idot pismo i ssylka;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    })
  }

  //otprawka poczty
  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      //ot kogo ischodit pismo
      from: process.env.SMTP_USER,
      to,
      //tema pisma + adres naszego sajta
      subject: 'Активация аккаунта на ' + process.env.API_URL,
      //text - esli nuzen
      text: '',
      html:
          `
                    <div>
                        <h1>Для активации перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
    })
  }
}

module.exports = new MailService();