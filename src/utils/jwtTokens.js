import jwt from 'jsonwebtoken';

export const createAccessToken = (username) => {
    const accessToken = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return accessToken
};