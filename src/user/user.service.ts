import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClient, User } from '@prisma/client';
import { UserDTO } from './dto/user.dto';
import { CreateUserInput } from './dto/createUser.input';
import { DEFAULT_ROLES } from '@/constants/constant';
import { RoleType } from '@/constants/enum';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async getVerifiedRoles(tx: Partial<PrismaClient>, roles: RoleType[]) {
        const rolesList = await tx.role.findMany({
            select: {
                id: true
            },
            where: {
                id: {
                    in: roles
                }
            }
        });
        const rolesIdList = rolesList.map(role => role.id);

        return rolesIdList;
    }

    async createUser(payload: CreateUserInput) {
        const user = await this.prisma.$transaction(async (tx) => {
            const existingUser = await tx.user.findFirst({
                where: {
                    username: payload.username
                }
            });

            if (existingUser) {
                throw new BadRequestException(`User ${payload.username} already exists`);
            }

            const user = await tx.user.create({
                data: {
                    username: payload.username,
                    displayName: payload.displayName,
                    profilePictureUrl: payload.profilePictureUrl,
                }
            });

            const roles = [...new Set([...DEFAULT_ROLES, ...(payload?.roles || [])])] as RoleType[];
            const rolesIdList = await this.getVerifiedRoles(tx, roles);
            const notExistRoles = roles.filter(role => !rolesIdList.includes(role));
            if (notExistRoles.length > 0) {
                throw new BadRequestException(`Role ${notExistRoles} not exist`);
            }

            await tx.userRole.createMany({
                data: roles.map(role => ({
                    userId: user.id,
                    roleId: role
                }))
            });

            return user;
        });

        return UserDTO.fromUser(user);
    }

    async getUser(userQuery: Partial<Pick<User, 'id' | 'username' | 'displayName'>>) {
        const user = await this.prisma.user.findFirst({
            where: userQuery
        });

        if (!user) {
            return null;
        }

        return UserDTO.fromUser(user);
    }

    async getUserRolesIdList(userId: string): Promise<RoleType[]> {
        const userRoles = await this.prisma.userRole.findMany({
            where: { userId },
            select: { roleId: true }
        });

        return userRoles.map(role => role.roleId as RoleType);
    }
}