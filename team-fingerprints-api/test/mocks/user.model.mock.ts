export const findOne = jest.fn();
const exec = jest.fn();

export class UserModelMock {
  findOne = findOne;
  exec = exec;
}
