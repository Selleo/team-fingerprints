import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from 'src/company/models/company.model';
import { Team } from 'src/company/models/team.model';
import { Role } from 'src/role/models/role.model';
import { RoleType } from 'src/role/role.type';
import { User } from 'src/users/models/user.model';
import { getApplication } from './helpers/getApplication';
import { getBaseUser } from './helpers/getBaseUser';
import * as request from 'supertest';

const createCompany = async (companyModel: Model<Company>) => {
  const companyData: Partial<Company> = {
    name: 'Company test',
    pointColor: '#123456',
    pointShape: 'circle',
    teams: [],
    domain: 'ello.com',
    filterTemplates: [],
  };

  return await (await companyModel.create(companyData)).save();
};

const createTeamInCompany = async (
  companyModel: Model<Company>,
  companyId: string,
) => {
  const teamData: Partial<Team> = {
    name: 'Team test',
    pointColor: '#654321',
    pointShape: 'triangle',
    filterTemplates: [],
  };

  return await companyModel
    .findByIdAndUpdate(
      companyId,
      {
        $push: {
          teams: teamData,
        },
      },
      { new: true },
    )
    .exec();
};

const addUserToTeam = async (
  roleModel: Model<Role>,
  baseUser: User,
  companyId: string,
  teamId: string,
): Promise<Role> => {
  const roleDocumentData: Partial<Role> = {
    role: RoleType.USER,
    companyId,
    teamId,
    email: baseUser.email,
    userId: baseUser._id.toString(),
  };

  return await (await roleModel.create(roleDocumentData)).save();
};

const addUserDetials = async (userModel: Model<User>, baseUser: User) => {
  const userDetails = {
    country: 'Poland',
    level: 'Junior',
  };
  return await userModel.findByIdAndUpdate(
    baseUser._id.toString(),
    {
      userDetails,
    },
    { new: true },
  );
};

describe('AuthController', () => {
  let app: INestApplication;
  let companyModel: Model<Company>;
  let roleModel: Model<Role>;
  let userModel: Model<User>;
  let company: Company;
  let team: Team;
  let baseUser: User;

  beforeEach(async () => {
    app = await getApplication();
    companyModel = app.get(getModelToken(Company.name));
    roleModel = app.get(getModelToken(Role.name));
    userModel = app.get(getModelToken(User.name));

    baseUser = await addUserDetials(userModel, await getBaseUser(userModel));

    company = await createCompany(companyModel);
    team = (await createTeamInCompany(companyModel, company._id.toString()))
      .teams[0];
  });

  describe('GET /auth/profile - get current user profile', () => {
    it('returns user profile', async () => {
      const roleDocument = await addUserToTeam(
        roleModel,
        baseUser,
        company._id.toString(),
        team._id.toString(),
      );

      const { body } = await request(app.getHttpServer())
        .get('/auth/profile')
        .expect(200);

      const { email, _id, userDetails, privileges } = body;
      const userPrivilege = privileges[1];
      const { company: userCompany, team: userTeam } = userPrivilege;

      expect(_id).toEqual(baseUser._id.toString());
      expect(email).toEqual(baseUser.email);

      expect(userDetails).toEqual({
        country: 'Poland',
        level: 'Junior',
      });

      expect(privileges.length).toBe(2);
      expect(userPrivilege.role).toEqual(RoleType.USER);
      expect(userPrivilege.roleId).toEqual(roleDocument._id.toString());

      expect(userCompany._id).toEqual(company._id.toString());
      expect(userCompany.name).toEqual(company.name);
      expect(userCompany.pointColor).toEqual(company.pointColor);
      expect(userCompany.pointShape).toEqual(company.pointShape);
      expect(userCompany.description).toEqual(company.description);

      expect(userTeam._id).toEqual(team._id.toString());
      expect(userTeam.name).toEqual(team.name);
      expect(userTeam.pointColor).toEqual(team.pointColor);
      expect(userTeam.pointShape).toEqual(team.pointShape);
      expect(userTeam.description).toEqual(team.description);
    });
  });
});
