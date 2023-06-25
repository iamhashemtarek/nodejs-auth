import bcrypt from 'bcrypt';

export const hash = async (plainPassword) => {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    return hashedPassword;
}

export const verify = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
}