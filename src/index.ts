#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "polyhaven-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const API_BASE_URL = "https://api.polyhaven.com";

// Helper function to fetch from PolyHaven API
async function fetchPolyHavenAPI(endpoint: string, params?: Record<string, string>) {
  const url = new URL(endpoint, API_BASE_URL);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
         url.searchParams.append(key, value);
      }
    }
  }

  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent": "PolyHaven-MCP-Server/1.0.0",
    },
  });

  if (!response.ok) {
    throw new Error(`PolyHaven API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_asset_types",
        description: "List of asset types available (e.g., hdris, textures, models).",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "search_assets",
        description: "Returns a list of assets, optionally filtered by type and categories.",
        inputSchema: {
          type: "object",
          properties: {
            type: {
              type: "string",
              description: "Filter to assets of a particular type. Can be hdris/textures/models/all.",
            },
            categories: {
              type: "string",
              description: "A comma-separated list of categories to filter by. Only assets that match all categories specified will be included.",
            },
          },
        },
      },
      {
        name: "get_asset_info",
        description: "Information about an individual asset.",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "The unique ID/slug of the asset.",
            },
          },
          required: ["id"],
        },
      },
      {
        name: "get_asset_files",
        description: "File list for a specific asset, providing URLs to download the actual files.",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "The unique ID/slug of the asset.",
            },
          },
          required: ["id"],
        },
      },
      {
        name: "get_categories",
        description: "A list of available categories for a specific asset type.",
        inputSchema: {
          type: "object",
          properties: {
            type: {
              type: "string",
              description: "The asset type (hdris/textures/models/all).",
            },
            in: {
              type: "string",
              description: "A comma-separated list of categories to filter by.",
            },
          },
          required: ["type"],
        },
      },
      {
        name: "get_author_info",
        description: "Information about a specific author.",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "The unique ID of the author.",
            },
          },
          required: ["id"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "get_asset_types": {
      const data = await fetchPolyHavenAPI("/types");
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }

    case "search_assets": {
      const { type, categories } = request.params.arguments as any;
      const params: Record<string, string> = {};
      if (type) params.t = type;
      if (categories) params.c = categories;
      const data = await fetchPolyHavenAPI("/assets", params);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }

    case "get_asset_info": {
      const { id } = request.params.arguments as any;
      const data = await fetchPolyHavenAPI(`/info/${id}`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }

    case "get_asset_files": {
      const { id } = request.params.arguments as any;
      const data = await fetchPolyHavenAPI(`/files/${id}`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }

    case "get_categories": {
      const { type, in: inCategories } = request.params.arguments as any;
      const params: Record<string, string> = {};
      if (inCategories) params.in = inCategories;
      const data = await fetchPolyHavenAPI(`/categories/${type}`, params);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }

    case "get_author_info": {
      const { id } = request.params.arguments as any;
      const data = await fetchPolyHavenAPI(`/author/${id}`);
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }

    default:
      throw new Error("Unknown tool");
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("PolyHaven MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
