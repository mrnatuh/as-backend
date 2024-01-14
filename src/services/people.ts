import { Prisma, PrismaClient } from '@prisma/client';
import * as groups from '../services/groups';

const prisma = new PrismaClient();

type GetAllPeopleFilters = { id_event: string, id_group?: string }
export const getAll = async (filters: GetAllPeopleFilters) => {
    try {
        return await prisma.eventPeople.findMany({ where: filters });
    } catch (err) { return false }
}

type GetOnePeopleFilters = { 
    id?: string; 
    id_event: string, 
    id_group?: string, 
    cpf?: string; 
}
export const getOne = async(filters: GetOnePeopleFilters) => {
    try {
        if (!filters.id && !filters.cpf) return false;

        return await prisma.eventPeople.findFirst({ where: filters });
    } catch (err) { return false }
}

type PeopleCreateData = Prisma.Args<typeof prisma.eventPeople, 'create'>['data']
export const addPerson = async (data: PeopleCreateData) => {
    try {
        if (!data.id_group) return false;

        const group = await groups.getOne({
            id: data.id_group,
            id_event: data.id_event
        });

        if (!group) return false;

        return await prisma.eventPeople.create({ data });
    } catch (err) { return false }
}

type PeopleUpdateFilters = { id?: string; id_event: string; id_group?: string; }
type PeopleUpdateData = Prisma.Args<typeof prisma.eventPeople, 'update'>['data']
export const update = async (filters: PeopleUpdateFilters, data: PeopleUpdateData) => {
    try {
        return await prisma.eventPeople.updateMany({ where: filters, data });
    } catch (err) { return false }
}

type PeopleRemoveFilters = { id: string; id_event?: string; id_group?: string; }
export const remove = async (filters: PeopleRemoveFilters) => {
    try {
        return await prisma.eventPeople.delete({ where: filters });
    } catch (err) { return false }
}