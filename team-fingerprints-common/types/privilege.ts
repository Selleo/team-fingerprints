import { RoleType } from "../enums";

export type Privilege = {
  readonly roleId: string;
  readonly role: RoleType;
  readonly company?: {
    _id: string;
    name: string;
    description?: string | undefined;
    pointShape?: string;
    pointColor?: string;
  };
  readonly team?: {
    _id: string;
    name: string;
    description?: string | undefined;
    pointShape?: string;
    pointColor?: string;
  };
};
