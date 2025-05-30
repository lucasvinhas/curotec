import express, { Request, Response as ExpressResponse } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Resource Model Validation (basic example)
interface ResourceCreateInput {
  name: string;
  description?: string;
}

interface ResourceUpdateInput {
  name?: string;
  description?: string;
}

// Helper for error handling
const handleError = (res: ExpressResponse, error: any, message: string): ExpressResponse => {
  console.error(message, error);
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Resource not found.' });
    }
  }
  return res.status(500).json({ message: `An error occurred: ${error.message || 'Internal server error'}` });
};

// Create a new resource
app.post('/resources', async (req: Request, res: ExpressResponse): Promise<void> => {
  try {
    const { name, description } = req.body as ResourceCreateInput;
    if (!name) {
      res.status(400).json({ message: 'Name is required.' });
      return;
    }
    const resource = await prisma.resource.create({
      data: { name, description },
    });
    res.status(201).json(resource);
  } catch (error) {
    handleError(res, error, 'Failed to create resource:');
  }
});

// Get all resources
app.get('/resources', async (req: Request, res: ExpressResponse): Promise<void> => {
  try {
    const { name, description } = req.query; // Extract filter query parameters

    const where: Prisma.ResourceWhereInput = {};

    if (name) {
      where.name = {
        contains: name as string,
        mode: 'insensitive', // Case-insensitive search
      };
    }

    if (description) {
      where.description = {
        contains: description as string,
        mode: 'insensitive', // Case-insensitive search
      };
    }

    const resources = await prisma.resource.findMany({
      where, // Apply filters
      orderBy: { // Optional: default ordering
        updatedAt: 'desc',
      }
    });
    res.status(200).json(resources);
  } catch (error) {
    handleError(res, error, 'Failed to retrieve resources:');
  }
});

// Get a single resource by ID
app.get('/resources/:id', async (req: Request, res: ExpressResponse): Promise<void> => {
  try {
    const { id } = req.params;
    const resource = await prisma.resource.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!resource) {
      res.status(404).json({ message: 'Resource not found.' });
      return;
    }
    res.status(200).json(resource);
  } catch (error) {
    handleError(res, error, 'Failed to retrieve resource:');
  }
});

// Update a resource by ID
app.put('/resources/:id', async (req: Request, res: ExpressResponse): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body as ResourceUpdateInput;

    if (name === undefined && description === undefined) {
      res.status(400).json({ message: 'No update data provided. Provide name or description.' });
      return;
    }

    const resource = await prisma.resource.update({
      where: { id: parseInt(id, 10) },
      data: { name, description },
    });
    res.status(200).json(resource);
  } catch (error) {
    handleError(res, error, 'Failed to update resource:');
  }
});

// Delete a resource by ID
app.delete('/resources/:id', async (req: Request, res: ExpressResponse): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.resource.delete({
      where: { id: parseInt(id, 10) },
    });
    res.status(204).send();
  } catch (error) {
    handleError(res, error, 'Failed to delete resource:');
  }
});

// Original root route (can be kept or removed)
app.get('/', async (req: Request, res: ExpressResponse): Promise<void> => {
  res.send('Hello from the backend! CRUD API is at /resources');
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
  console.log(`CRUD API available at http://localhost:${port}/resources`);
}); 