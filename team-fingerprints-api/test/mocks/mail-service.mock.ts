export const newAccountMail = jest.fn();
export const inviteToCompanyMail = jest.fn();
export const inviteToTeamMail = jest.fn();
export const newTeamLeaderMail = jest.fn();

export class MailServiceMock {
  newAccountMail = newAccountMail.mockReturnValue(true);
  inviteToCompanyMail = inviteToCompanyMail.mockReturnValue(true);
  inviteToTeamMail = inviteToTeamMail.mockReturnValue(true);
  newTeamLeaderMail = newTeamLeaderMail.mockReturnValue(true);
}
