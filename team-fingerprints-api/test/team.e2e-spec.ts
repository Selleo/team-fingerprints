import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CompanyModule } from 'src/company/company.module';
import { AppModule } from 'src/app.module';
import * as mongoose from 'mongoose';
import { TeamModule } from 'src/company/team/team.module';
import { RoleModule } from 'src/role/role.module';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from 'src/company/models/company.model';
import { User } from 'src/users/models/user.model';
import { CreateUserDto } from 'src/users/dto/user.dto';
import { CreateCompanyDto } from 'src/company/dto/company.dto';
import { Role } from 'src/role/role.type';
import { Team } from 'src/company/models/team.model';
import { UpdateTeamDto } from 'src/company/team/dto/team.dto';

const usersData: Partial<User>[] = [
  {
    email: 'bedo@es.com',
    firstName: 'Bedo',
    lastName: 'Es',
    authId: 'sdh2hfefowhefnjkswfbnw',
  },
  {
    email: 'yetiasg@gmail.com',
    firstName: 'Kinny',
    lastName: 'Zimmer',
    authId: 'sdfh2hfefowhefnjkswfbnw',
  },
];

const teamData: Partial<Team> = {
  name: '2115',
  description: '2115',
};

let mockTeam: Omit<Team, 'pointColor' | 'pointShape'> = {
  name: teamData.name,
  description: teamData.description,
  emailWhitelist: [],
  members: [],
  teamLeader: undefined,
};

const returnTeam = ({
  emailWhitelist,
  members,
  teamLeader,
  name,
  description,
}: Team): typeof mockTeam => ({
  emailWhitelist,
  members,
  teamLeader,
  name,
  description,
});

const companyData = ({ _id, email }: User): Partial<Company> => ({
  name: 'Selleo',
  description: 'Selleo - w&m',
  domain: 'selleo.com',
  adminId: [_id],
  members: [_id],
  emailWhitelist: [email],
});

jest.setTimeout(10000);

describe('Company controller (e2e)', () => {
  let app: INestApplication;
  let companyModel: any;
  let userModel: any;
  let company: Company;
  let companyAdmin: User;
  let companyId: string;
  let team: Partial<Company>;
  let teamId: string;
  let user: User;

  const createUser = async (user: CreateUserDto) => {
    const userExists = await userModel.findOne({ email: user.email });
    if (userExists) await userModel.findOneAndDelete({ email: user.email });
    const newUser = await userModel.create(user);
    await newUser.save();
    return newUser;
  };

  const removeUser = async (userId: string) => {
    return await userModel.findOneAndDelete({ _id: userId });
  };

  const createCompany = async (company: CreateCompanyDto) => {
    const companyExists = await companyModel.findOne({
      domain: company.domain,
    });
    if (companyExists)
      await companyModel.findOneAndDelete({ domanin: company.domain });
    const newCompany = await companyModel.create(company);
    await newCompany.save();
    return newCompany;
  };

  const removeCompany = async (companyId: string) => {
    return await companyModel.findOneAndDelete({ _id: companyId });
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        CompanyModule,
        TeamModule,
        RoleModule,
        MongooseModule.forFeature([
          {
            name: Company.name,
            schema: CompanySchema,
          },
        ]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    companyModel = await moduleFixture.get(getModelToken(Company.name));
    userModel = await moduleFixture.get(getModelToken(User.name));

    companyAdmin = await createUser(usersData[0] as CreateUserDto);
    company = await createCompany(
      companyData(companyAdmin) as CreateCompanyDto,
    );

    companyId = new mongoose.Types.ObjectId(company._id).toString();

    companyAdmin = await userModel
      .findOneAndUpdate(
        { _id: companyAdmin._id },
        {
          $set: {
            role: Role.COMPANY_ADMIN,
            companyId: company._id,
          },
        },
        { new: true },
      )
      .exec();
  });

  afterAll(async () => {
    await removeCompany(company._id);

    await removeUser(companyAdmin._id);
    await removeUser(user._id);

    await mongoose.connection.close(true);
    await app.close();
  });

  describe('POST /teams - create team', () => {
    it('returns created team', async () => {
      return await request(app.getHttpServer())
        .post(`/companies/${companyId}/teams`)
        .send(teamData)
        .expect(201)
        .then(({ body }) => {
          expect(body.teams.length).toBe(1);

          const newTeam = returnTeam(body.teams[0]);
          expect(newTeam).toMatchObject(mockTeam);

          team = body.teams[0];
          teamId = new mongoose.Types.ObjectId(team._id).toString();
        });
    });
  });

  describe('GET /teams - get team by given id', () => {
    it('returns team', async () => {
      return await request(app.getHttpServer())
        .get(`/companies/${companyId}/teams/${teamId}`)
        .expect(200)
        .then(({ body }) => {
          expect(returnTeam(body)).toMatchObject(mockTeam);
        });
    });
  });

  describe('GET /teams - update team', () => {
    it('returns updated team', async () => {
      const updateData: UpdateTeamDto = {
        name: '5112',
        description: '5112',
      };
      return await request(app.getHttpServer())
        .patch(`/companies/${companyId}/teams/${teamId}`)
        .send(updateData)
        .expect(200)
        .then(({ body }) => {
          const updatedTeam = returnTeam(body.teams[0]);
          mockTeam = { ...mockTeam, ...updateData };
          expect(updatedTeam).toMatchObject(mockTeam);

          team = body.teams[0];
        });
    });
  });

  describe('Team members management', () => {
    describe('POST /teams/:teamId/member - Adding new team member', () => {
      it('returns updated team with new member', async () => {
        user = await createUser(usersData[1] as CreateUserDto);
        const updateData: Partial<Team> = {
          emailWhitelist: [user.email],
        };

        return await request(app.getHttpServer())
          .post(`/companies/${companyId}/teams/${teamId}/member`)
          .send({ email: user.email })
          .expect(201)
          .then(({ body }) => {
            const updatedTeam = returnTeam(body.teams[0]);
            mockTeam = { ...mockTeam, ...updateData };
            expect(updatedTeam).toMatchObject(mockTeam);

            team = body.teams[0];
          });
      });
    });

    describe('Adding team leader to team', () => {
      it('returns updated team with team leader', async () => {
        const updateData: Partial<Team> = {
          emailWhitelist: [user.email],
          teamLeader: {
            _id: user._id,
            email: user.email,
          },
        };

        return await request(app.getHttpServer())
          .post(`/companies/${companyId}/teams/${teamId}/leader`)
          .send({ email: user.email })
          .expect(201)
          .then(({ body }) => {
            const updatedTeam = returnTeam(body.teams[0]);
            mockTeam = { ...mockTeam, ...updateData };
            expect(updatedTeam).toMatchObject(mockTeam);

            team = body.teams[0];
          });
      });
    });

    describe('Removing team leader', () => {
      it('removes team leader from team', async () => {
        return await request(app.getHttpServer())
          .delete(`/companies/${companyId}/teams/${teamId}/leader`)
          .send({ email: user.email })
          .expect(200)
          .then(({ body }) => {
            const updatedTeam = returnTeam(body.teams[0]);

            mockTeam.teamLeader = { _id: '', email: '' };
            expect(updatedTeam).toMatchObject(mockTeam);

            team = body.teams[0];
          });
      });
    });

    describe('Removing team member', () => {
      it('removes team member by given id', async () => {
        return await request(app.getHttpServer())
          .delete(`/companies/${companyId}/teams/${teamId}/member`)
          .send({ email: team.emailWhitelist[0] })
          .expect(200)
          .then(({ body }) => {
            const updatedTeam = returnTeam(body.teams[0]);

            mockTeam.emailWhitelist = [];
            expect(updatedTeam).toMatchObject(mockTeam);
          });
      });
    });
  });

  describe('GET /teams - remove team by given id', () => {
    it('returns removed team', async () => {
      return await request(app.getHttpServer())
        .delete(`/companies/${companyId}/teams/${teamId}`)
        .expect(200)
        .then(({ body }) => {
          expect(body.teams.length).toBe(0);
          expect(body.teams).toEqual([]);
        });
    });
  });
});
