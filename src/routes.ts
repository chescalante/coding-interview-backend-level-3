import { Server } from "@hapi/hapi";
import { EntidadItem } from "./types";
import { paramsIDSchema, payloadItemSchema } from "./schemas";
import failActionFn from "./failActionFn";

const items: EntidadItem[] = [];

let latestId = 1;

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
      return h.response(items).code(200);
    },
  });

  server.route({
    method: "POST",
    path: "/items",
    handler: async (request, h) => {
      const item = request.payload as Omit<EntidadItem, "id">;

      const id = latestId++;

      const newItem: EntidadItem = {
        id,
        name: item.name,
        price: item!.price,
      };

      items.push(newItem);

      return h.response(newItem).code(201);
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
      const itemID = request.params.id;

      const foundItem = items.find((i) => i.id === itemID);

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
      const itemID = request.params.id;

      const itemWithoutIDToUpdate = request.payload as Omit<EntidadItem, "id">;

      const index = items.findIndex((i) => i.id === itemID);

      if (index === -1) {
        return h.response().code(404);
      }

      const itemToUpdate: EntidadItem = {
        id: itemID,
        ...itemWithoutIDToUpdate,
      };

      items[index] = itemToUpdate;

      return h.response(itemToUpdate).code(200);
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
      const itemID = request.params.id;

      const index = items.findIndex((i) => i.id === itemID);

      if (index === -1) {
        return h.response().code(404);
      }

      items.splice(index, 1);

      return h.response().code(204);
    },
    options: {
      validate: {
        params: paramsIDSchema,
      },
    },
  });
};
