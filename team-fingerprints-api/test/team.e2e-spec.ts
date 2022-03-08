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

const usersData: Partial<User>[] = [
  {
    email: 'bedo@es.com',
    firstName: 'Bedo',
    lastName: 'Es',
    authId: 'sdh2hfefowhefnjkswfbnw',
  },
  {
    email: 'white2115@gmail.com',
    firstName: 'White',
    lastName: '2115',
    authId: 'sdsdh2hfefowhefnjkswfbnw',
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

const team: Omit<Team, 'pointColor' | 'pointShape'> = {
  name: teamData.name,
  description: teamData.description,
  emailWhitelist: [null],
  members: [null],
  teamLeader: undefined,
};

const companyData = (user: User): Partial<Company> => ({
  name: 'Selleo',
  description: 'Selleo - w&m',
  domain: 'selleo.com',
  adminId: [user._id],
  members: [user._id],
  emailWhitelist: [user.email],
});

jest.setTimeout(10000);

describe('Company controller (e2e)', () => {
  let app: INestApplication;
  let companyModel: any;
  let userModel: any;
  let company: Company;
  let companyAdmin: User;
  let companyId: string;
  let teamLeader: User;
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

    // teamLeader = await createUser(usersData[1] as CreateUserDto);
    // user = await createUser(usersData[2] as CreateUserDto);
  });

  afterAll(async () => {
    await removeCompany(company._id);

    await removeUser(companyAdmin._id);
    // await removeUser(teamLeader._id);
    // await removeUser(user._id);

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
          const newTeam: typeof team = {
            emailWhitelist: body.teams[0].emailWhitelist,
            members: body.teams[0].members,
            teamLeader: body.teams[0].teamLeader,
            name: body.teams[0].name,
            description: body.teams[0].description,
          };

          expect(newTeam).toMatchObject(team);
        });
    });
  });
});
