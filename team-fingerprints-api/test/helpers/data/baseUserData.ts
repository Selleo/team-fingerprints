import { CreateUserDto } from 'src/users/dto/user.dto';

export const baseUserData = () =>
  ({
    email: 'kinnyzimer@gmail.com',
    firstName: 'Kinny',
    lastName: 'Zimmer',
    authId: 'tesing-authId|123456789abcdef',
  } as CreateUserDto);
