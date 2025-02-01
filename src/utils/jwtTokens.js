import jwt from 'jsonwebtoken';

export const createAccessToken = (username) => {
    const accessToken = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return accessToken
};

export const createRefreshToken = (username) => {
    const refreshToken = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return refreshToken
};