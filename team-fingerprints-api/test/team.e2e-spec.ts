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

const companyData: Partial<Company> = {
  name: 'Selleo',
  description: 'Selleo - w&m',
  domain: 'selleo.com',
};

describe('Company controller (e2e)', () => {
  let app: INestApplication;
  let companyModel: any;
  let userModel: any;
  let company: Company;
  let companyAdmin: User;
  let teamLeader: User;
  let user: User;

  const createUser = async (user: CreateUserDto) => {
    const userExists = await userModel.findOne({ email: user.email });
    if (userExists) await userModel.findOneAndDelete({ email: user.email });
    const newUser = await userModel.create(user);
    return await newUser.save();
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
    return await newCompany.save();
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

    company = await createCompany(companyData as CreateCompanyDto);

    companyAdmin = await createUser(usersData[0] as CreateUserDto);
    teamLeader = await createUser(usersData[1] as CreateUserDto);
    user = await createUser(usersData[2] as CreateUserDto);
  });

  describe('POST /teams - create team', () => {
    it('returns true', async () => {
      return true;
    });
  });

  afterAll(async () => {
    await removeCompany(company._id);

    await removeUser(companyAdmin._id);
    await removeUser(teamLeader._id);
    await removeUser(user._id);

    await mongoose.connection.close(true);
    await app.close();
  });
});
