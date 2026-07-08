# PolyHaven MCP Server

An [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server that provides agents and AI assistants access to the [PolyHaven](https://polyhaven.com/) 3D asset library.

This server allows you to search, query, and retrieve download links for high-quality, CC0 HDRIs, textures, and 3D models directly through your AI assistant.

## Features

This server exposes several tools that map directly to the PolyHaven public API:

- **`get_asset_types`**: Lists available asset types (`hdris`, `textures`, `models`).
- **`search_assets`**: Search for assets, optionally filtered by type and categories.
- **`get_asset_info`**: Retrieve detailed metadata and information about a specific asset by its ID.
- **`get_asset_files`**: Get a list of files for a specific asset, including direct download URLs for various formats and resolutions.
- **`get_categories`**: View available categories for a given asset type (and their asset counts).
- **`get_author_info`**: Retrieve information about a specific author.

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm

### Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/RN0000/polyhaven-mcp.git
   cd polyhaven-mcp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

## Usage with MCP Clients

To use this server with an MCP-compatible client (such as Claude Desktop or Antigravity), you need to configure your client to launch the server.

### Example Configuration

Add the following to your MCP client's configuration file:

```json
{
  "mcpServers": {
    "polyhaven": {
      "command": "node",
      "args": [
        "/absolute/path/to/polyhaven-mcp/build/index.js"
      ]
    }
  }
}
```

Make sure to replace `/absolute/path/to/polyhaven-mcp/build/index.js` with the actual path to the compiled `index.js` file on your system.

## Regarding API Usage

While this MCP server helps you connect to PolyHaven's API, this project is **not affiliated with, endorsed by, or officially connected to PolyHaven** in any way.

   PolyHaven is generous enough to offer their API for free when used for **non-commercial projects and academic research**. If you're building something commercial, you'll need to reach out to them for a custom license or sponsorship. Be sure to check out [PolyHaven's Terms of Service](https://github.com/Poly-Haven/Public-API/blob/master/ToS.md) to make sure you're abiding by their terms of Service.

## License

This project is licensed under the ISC License. See the `package.json` for more details. PolyHaven's assets are distributed under the CC0 license.
