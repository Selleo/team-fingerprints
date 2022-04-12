export const findById = jest.fn();
const exec = jest.fn();

export class SurveyModelMock {
  findById = findById;
  exec = exec;
}
