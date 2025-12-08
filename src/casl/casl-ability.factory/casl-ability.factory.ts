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
  AppoitmentPolicies,
  DashboardPolicies,
  DoctorPolicies,
  MediaInformationPolicies,
  PatientPolicies,
  SchedulePolicies,
  SpecializationPolicies,
  UserLogin,
  userRoleType,
  UsersPolicies,
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
      | typeof DoctorPolicies
      | typeof UsersPolicies
      | typeof DashboardPolicies
      | typeof PatientPolicies
      | typeof AppoitmentPolicies
      | typeof SpecializationPolicies
      | typeof SchedulePolicies
      | typeof MediaInformationPolicies
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
      can(Action.Manage, DoctorPolicies);
      can(Action.Manage, SpecializationPolicies);
      can(Action.Manage, SchedulePolicies);
      can(Action.Manage, MediaInformationPolicies);
      can(Action.Read, DashboardPolicies);
      can(Action.Create, UsersPolicies);
      can(Action.Read, UsersPolicies);
      can(Action.Read, AppoitmentPolicies);
      can(Action.Read, PatientPolicies);
    } else if (userLogin.role === userRoleType.customer) {
      can(Action.Read, MediaInformationPolicies);
      can(Action.Read, AppoitmentPolicies);
      can(Action.Create, AppoitmentPolicies);
      can(Action.Manage, PatientPolicies);
      can(Action.Read, SchedulePolicies);
      can(Action.Read, SpecializationPolicies);
      can(Action.Read, DoctorPolicies);
      can(Action.Update, UsersPolicies);
      can(Action.Read, UsersPolicies);
    } else if (userLogin.role === userRoleType.doctor) {
      can(Action.Read, MediaInformationPolicies);
      can(Action.Read, AppoitmentPolicies);
      can(Action.Update, AppoitmentPolicies);
      can(Action.Update, DoctorPolicies);
      can(Action.Read, DoctorPolicies);
      can(Action.Read, SchedulePolicies);
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
