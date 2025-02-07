export const calculateExpInSec = (exp, iat) => {
    const expToInt = parseInt(exp);
    const iatToInt = parseInt(iat);
    return expToInt - iatToInt;
};