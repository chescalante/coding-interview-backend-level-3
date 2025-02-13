import { Server } from "@hapi/hapi";
import { paramsIDSchema, payloadItemSchema } from "./lib/schemas";
import failActionFn from "./lib/failActionFn";
import getPrismaClient from "./lib/getPrismaClient";
import { EntidadItem, Prisma } from "@prisma/client";

export const defineRoutes = (server: Server) => {
  server.route({
    method: "GET",
    path: "/ping",
    handler: async (request, h) => {
      return {
        ok: true,
      };
    },
  });

  server.route({
    method: "GET",
    path: "/items",
    handler: async (request, h) => {
      const prisma = await getPrismaClient();

      const items = await prisma.entidadItem.findMany();

      return h.response(items).code(200);
    },
  });

  server.route({
    method: "POST",
    path: "/items",
    handler: async (request, h) => {
      const prisma = await getPrismaClient();

      const item = request.payload as Omit<EntidadItem, "id">;

      const result = await prisma.entidadItem.create({
        data: item,
      });

      return h.response(result).code(201);
    },
    options: {
      validate: {
        failAction: failActionFn,
        payload: payloadItemSchema,
      },
    },
  });

  server.route({
    method: "GET",
    path: "/items/{id}",
    handler: async (request, h) => {
      const prisma = await getPrismaClient();

      const itemID = request.params.id;

      const foundItem = await prisma.entidadItem.findUnique({
        where: {
          id: itemID,
        },
      });

      if (!foundItem) {
        return h.response().code(404);
      }

      return h.response(foundItem).code(200);
    },
    options: {
      validate: {
        params: paramsIDSchema,
      },
    },
  });

  server.route({
    method: "PUT",
    path: "/items/{id}",
    handler: async (request, h) => {
      const prisma = await getPrismaClient();

      const itemID = request.params.id;

      const item = request.payload as Omit<EntidadItem, "id">;

      try {
        const updatedItem = await prisma.entidadItem.update({
          where: {
            id: itemID,
          },
          data: item,
        });

        return h.response(updatedItem).code(200);
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          return h.response().code(404);
        }

        throw error;
      }
    },
    options: {
      validate: {
        failAction: failActionFn,
        payload: payloadItemSchema,
        params: paramsIDSchema,
      },
    },
  });

  server.route({
    method: "DELETE",
    path: "/items/{id}",
    handler: async (request, h) => {
      const prisma = await getPrismaClient();

      const itemID = request.params.id;

      try {
        await prisma.entidadItem.delete({
          where: {
            id: itemID,
          },
        });

        return h.response().code(204);
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          return h.response().code(404);
        }

        throw error;
      }
    },
    options: {
      validate: {
        params: paramsIDSchema,
      },
    },
  });
};
