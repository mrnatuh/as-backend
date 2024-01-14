import { RequestHandler } from "express";
import * as people from '../services/people';
import { z } from "zod";
import { decryptMatch } from "../utils/match";

export const getAll: RequestHandler = async (req, res) => {
    const { id_event, id_group } = req.params;

    const items = await people.getAll({ id_event, id_group });
    if (items) return res.json({ people: items });

    res.json({ error: 'Ocorreu um erro' });
}

export const getPerson: RequestHandler = async (req, res) => {
    const { id_event, id_group, id } = req.params;

    const item = await people.getOne({ id_event, id_group, id });
    if (item) return res.json({ person: item });

    res.json({ error: 'Ocorreu um erro' });
}

export const addPerson: RequestHandler = async (req, res) => {
    const { id_event, id_group } = req.params;

    const addPersonSchema = z.object({
        name: z.string(),
        cpf: z.string().transform(val => val.replace(/\.|\-/gm, '')),
    });

    const body = addPersonSchema.safeParse(req.body);
    if (!body.success) return res.json({ error: 'Dados inválidos' });

    const newPerson = await people.addPerson({
        ...body.data,
        id_event,
        id_group,
    });
    if (newPerson) return res.status(201).json({ person: newPerson });

    res.json({ error: 'Ocorreu um erro' });
}

export const updatePerson: RequestHandler = async (req, res) => {
    const { id_event, id_group, id } = req.params;

    const updatePersonSchema = z.object({
        name: z.string().optional(),
        cpf: z.string().transform(val => val.replace(/\.|\-/gm, '')).optional(),
        matched: z.string().optional(),
    });

    const body = updatePersonSchema.safeParse(req.body);
    if (!body.success) return res.json({ error: 'Dados inválidos' });

    const updatedPerson = await people.update({
        id_event,
        id_group,
        id,
    }, body.data);
    if (updatedPerson) {
        const item = await people.getOne({ id, id_event });
        return res.json({ person: item });
    }

    res.json({ error: 'Ocorreu um erro' });
}

export const deletePerson: RequestHandler = async (req, res) => {
    const { id_event, id_group, id } = req.params;

    const deletedPerson = await people.remove({ id, id_event, id_group });
    if (deletedPerson) return res.json({ person: deletedPerson });

    res.json({ error: 'Ocorreu um erro' });
}

export const searchPerson: RequestHandler = async (req, res) => {
    const { id_event } = req.params;

    const searchPersonSchema = z.object({
        cpf: z.string().transform(val => val.replace(/\.|-/gm, '')),
    });
    const query = searchPersonSchema.safeParse(req.query);
    if (!query.success) return res.json({ error: 'Dados inválidos' });

    const item = await people.getOne({ id_event, cpf: query.data.cpf });
    if (item && item.matched) {
        const matchId = decryptMatch(item.matched);

        const personMatched = await people.getOne({
            id_event,
            id: matchId,
        });

        if (personMatched) {
            return res.json({ 
                person: {
                    id: item.id,
                    name: item.name,
                },
                matched: {
                    id: personMatched.id,
                    name: personMatched.name,
                },
            });
        }
    }

    res.json({ error: 'Ocorreu um erro' });
}