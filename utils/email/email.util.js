import emailjs from '@emailjs/browser';

export const sendEmail = async(templateParams) => {
  const sending = await emailjs.send('service_n4hdqeq', 'template_1yty5mh', templateParams, 'Dm6gJD_8mW_onk0qp');                                    
  console.log(sending);
  return sending;
};


