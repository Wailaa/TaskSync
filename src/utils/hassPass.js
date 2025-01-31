
import bcrypt from 'bcrypt';

export const creatHashPass = async (password) => {
    const saltPass = 10;
    const hashedpass = await bcrypt.hash(password,saltPass);
    return hashedpass
}; 

export const compareHashed = async (password,hashedPass) =>{
    const isHashed = await bcrypt.compare(password,hashedPass)
    return isHashed
};