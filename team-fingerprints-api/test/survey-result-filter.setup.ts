import { Model, Types } from 'mongoose';
import { Role } from 'src/role/models/role.model';
import { RoleType } from 'team-fingerprints-common';
import { Survey } from 'src/survey/models/survey.model';
import { User } from 'src/users/models/user.model';

export const companyWithTeamData = [
  {
    name: 'Test company - 1',
    pointColor: '#fffaaa',
    pointShape: 'square',
    domain: 'example.com',
    filterTemplates: [],
    teams: [
      {
        _id: new Types.ObjectId(),
        name: 'Test team - 1',
        pointColor: '#fffaaa',
        pointShape: 'square',
        filterTemplates: [],
      },
    ],
  },
  {
    name: 'Test company - 2',
    pointColor: '#222333',
    pointShape: 'circle',
    domain: 'oelles.com',
    filterTemplates: [],
    teams: [
      {
        _id: new Types.ObjectId(),
        name: 'Test team - 2',
        pointColor: '#bbbccc',
        pointShape: 'circle',
        filterTemplates: [],
      },
    ],
  },
];

export const surveyData: Partial<Survey> = {
  title: 'Test survey',
  amountOfQuestions: 2,
  isPublic: true,
  archived: false,
  categories: [
    {
      _id: new Types.ObjectId(),
      title: 'Category 1 - test',
      trends: [
        {
          _id: new Types.ObjectId(),
          primary: 'Aaaa - test',
          secondary: 'Bbbb - test',
          questions: [
            {
              _id: new Types.ObjectId(),
              title: 'Jdiokehfjiwebdfvjdbfv?',
              primary: true,
            },
            {
              _id: new Types.ObjectId(),
              title: 'Aadasddfs?',
              primary: true,
            },
          ],
        },
      ],
    },
  ],
};

export const filtersWithValuesData = [
  {
    name: 'Country',
    filterPath: 'country',
    values: [
      {
        _id: new Types.ObjectId(),
        value: 'Poland',
      },
      {
        _id: new Types.ObjectId(),
        value: 'Slovakia',
      },
    ],
  },
  {
    name: 'Level',
    filterPath: 'level',
    values: [
      {
        _id: new Types.ObjectId(),
        value: 'Junior',
      },
      {
        _id: new Types.ObjectId(),
        value: 'Independent',
      },
    ],
  },
];

export const addUserToTeam = async (
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

export const createSurvey = async (
  surveyModel: Model<Survey>,
  surveyData: Partial<Survey>,
): Promise<Survey> => {
  return await (await surveyModel.create(surveyData)).save();
};
