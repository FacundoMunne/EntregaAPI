import { Request, Response, NextFunction } from 'express'
import { ClientRepository } from './client.repository.js'
import { Client } from './client.entity.js'

const repository = new ClientRepository()

function sanitizeClientInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    dni: req.body.dni,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
    registrationDate: req.body.registrationDate,
  };
  //more checks here

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

async function findAll(req: Request, res: Response) {
  res.json({ data: await repository.findAll() })
}
async function findOne(req: Request, res: Response) {
  const id = Number.parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).send({ message: 'Invalid id parameter' });
  }
  const client = await repository.findOne({ id: id.toString() });
  if (!client) {
    return res.status(404).send({ message: 'Client not found' });
  }
  res.json({ data: client });
}

async function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput;

  const clientInput = new Client(
    input.dni,
    input.firstname,
    input.lastname,
    input.address,
    input.phone,
    input.email,
    input.registrationDate,
  );

  try {
    const client = await repository.add(clientInput); // Espera la inserción en la base de datos
    return res.status(201).send({ message: 'Client created', data: client });
  } catch (error) {
    console.error('Error adding client:', error);
    return res.status(500).send({ message: 'Failed to create client' });
  }
}

async function update(req: Request, res: Response) {
  const client = await repository.update(req.params.id, req.body.sanitizedInput)

  if (!client) {
    return res.status(404).send({ message: 'Client not found' })
  }

  return res.status(200).send({ message: 'Client updated successfully', data: client })
}

async function remove(req: Request, res: Response) {
  const { id } = req.params;
  const client = await repository.delete({ id })

  if (!client) {
    res.status(404).send({ message: 'Client not found' })
  } else {
    res.status(200).send({ message: 'Client deleted successfully' })
  }
}

export { sanitizeClientInput, findAll, findOne, add, update, remove }