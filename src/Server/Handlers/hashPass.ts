import bcrypt from 'bcrypt';

const hashPass = (password: string) => {
  const salt = parseInt(process.env.SALT_ROUNDS as string, 10);
  return bcrypt.hashSync(`${password}${process.env.BCRYPT_PASSWORD}`, salt);
};

export default hashPass;
