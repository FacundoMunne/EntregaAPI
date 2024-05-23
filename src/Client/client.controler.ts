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
    regristrationDate: req.body.regristrationDate,
  }
  //more checks here

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

function findAll(req: Request, res: Response) {
  res.json({ data: repository.findAll() })
}

function findOne(req: Request, res: Response) {
  const id = req.params.id
  const client = repository.findOne({ id })
  if (!client) {
    return res.status(404).send({ message: 'Client not found' })
  }
  res.json({ data: client })
}

function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput

  const clientInput = new Client(
    input.dni,
    input.firstname,
    input.lastname,
    input.address,
    input.phone,
    input.email,
    input.regristrationDate,
  )

  const client= repository.add(clientInput)
  return res.status(201).send({ message: 'Client created', data: client })
}

function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id
  const client = repository.update(req.body.sanitizedInput)

  if (!client) {
    return res.status(404).send({ message: 'Client not found' })
  }

  return res.status(200).send({ message: 'Client updated successfully', data: client })
}

function remove(req: Request, res: Response) {
  const id = req.params.id
  const client = repository.delete({ id })

  if (!client) {
    res.status(404).send({ message: 'Client not found' })
  } else {
    res.status(200).send({ message: 'Client deleted successfully' })
  }
}

export { sanitizeClientInput, findAll, findOne, add, update, remove }