# PolyHaven MCP Server Instructions

## Overview
This MCP server provides agents with access to the PolyHaven public API, allowing you to search and download high-quality, CC0 HDRIs, textures, and 3D models.

## Usage Best Practices

1. **Exploration vs Targeting**: 
   - If the user doesn't know exactly what they want, use `get_categories` and `get_asset_types` to understand what's available before searching.
   - Use `search_assets` with the `type` and `categories` arguments to find specific assets. It returns a list of assets that match the criteria.

2. **Fetching Asset Details**:
   - Once you find an asset using `search_assets`, extract its unique `id` (the slug or key in the returned dictionary).
   - Use `get_asset_info` with the `id` to retrieve metadata, dimensions, mapping resolution, and author credits.

3. **Downloading Files**:
   - Use `get_asset_files` with the `id` to obtain direct download URLs for the 3D files and textures. 
   - The files are typically nested by format (e.g., blend, fbx, gltf) and resolution (e.g., 1k, 2k, 4k, 8k).
   - Always choose the resolution that best fits the user's needs. If unspecified, assume 2k or 4k as a sensible default to save bandwidth, unless high quality is explicitly requested.
   - For `models`, be sure to fetch any dependent textures listed in the `include` block of the chosen format.

4. **Rate Limiting & Caching**:
   - The PolyHaven API is free but try to be efficient with your queries to respect their servers.

5. **Licensing**:
   - All PolyHaven assets are provided under the CC0 license (public domain). They are completely free to use for any purpose, including commercial projects, without credit (though credit is appreciated).
