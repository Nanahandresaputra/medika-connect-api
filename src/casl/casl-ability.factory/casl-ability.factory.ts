import { Injectable } from '@nestjs/common';
import {
  PureAbility,
  AbilityBuilder,
  subject,
  InferSubjects,
  ExtractSubjectType,
} from '@casl/ability';
import { createPrismaAbility, PrismaModel, PrismaQuery } from '@casl/prisma';
import {
  Appoitment,
  Dashboard,
  Doctor,
  MediaInformation,
  Patient,
  Schedule,
  Specialization,
  UserLogin,
  userRoleType,
  Users,
} from '../policies.entity';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

type Subjects =
  | InferSubjects<
      | typeof UserLogin
      | typeof Doctor
      | typeof Users
      | typeof Dashboard
      | typeof Patient
      | typeof Appoitment
      | typeof Specialization
      | typeof Schedule
      | typeof MediaInformation
    >
  | 'all';

export type AppAbility = PureAbility<[Action, Subjects], PrismaQuery>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(userLogin: UserLogin) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createPrismaAbility,
    );

    if (userLogin.role === userRoleType.admin) {
      can(Action.Manage, Doctor);
      can(Action.Manage, Specialization);
      can(Action.Manage, Schedule);
      can(Action.Manage, MediaInformation);
      can(Action.Read, Dashboard);
      can(Action.Create, Users);
      can(Action.Read, Appoitment);
    } else if (userLogin.role === userRoleType.customer) {
      can(Action.Read, Appoitment);
      can(Action.Create, Appoitment);
      can(Action.Manage, Patient);
      can(Action.Read, Schedule);
    } else if (userLogin.role === userRoleType.doctor) {
      can(Action.Read, Appoitment);
      can(Action.Update, Appoitment);
      can(Action.Read, Schedule);
    } else {
      cannot(Action.Manage, 'all');
    }

    // can(Action.Update, Article, { authorId: user.id });
    // cannot(Action.Delete, Article, { isPublished: true });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
