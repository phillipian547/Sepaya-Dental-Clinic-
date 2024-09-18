import { hash } from "bcryptjs";
import { compare } from "bcryptjs";

export async function hashPassword(password) {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
};

export async function verifyPassword(password, hashedPassword) {
  const isValid = await compare(password, hashedPassword);
  return isValid;
};

export function checkEmail(email) {
  if(email && email.includes('@')) {
    return true;
  } else {
    return false;
  }
};

export function checkPassword(password, minLength) {
  if(password && password.trim().length >= minLength) {
    return true;
  } else {
    return false;
  }
};


export function setupDate(dateString) {
  const dateObj = new Date(dateString);
  //console.log(dateObj);

  const month = dateObj.getMonth() + 1; 
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();

  const date = year + "-" + ("0" + month).slice(-2) + "-" + ("0" + day).slice(-2);

  return date;

};
