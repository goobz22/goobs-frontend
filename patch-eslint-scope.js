// Patch for eslint-scope compatibility issue
const Module = require('module');
const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function (request, parent, isMain) {
  // Intercept requests for eslint-scope/lib/referencer
  if (request === 'eslint-scope/lib/referencer') {
    try {
      // Try to resolve eslint-scope first
      const eslintScopePath = originalResolveFilename.call(this, 'eslint-scope', parent, isMain);
      const path = require('path');
      // Return the main eslint-scope module instead
      return eslintScopePath;
    } catch (e) {
      // Fallback to original behavior
    }
  }
  return originalResolveFilename.call(this, request, parent, isMain);
};