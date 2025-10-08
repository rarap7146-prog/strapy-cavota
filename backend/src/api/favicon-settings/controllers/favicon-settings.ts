/**
 * Favicon Settings Controller
 * Handles favicon zip upload and extraction
 */

import { factories } from '@strapi/strapi';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import AdmZip from 'adm-zip';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

export default factories.createCoreController(
  'api::favicon-settings.favicon-settings',
  ({ strapi }) => ({
    /**
     * Upload and extract favicon zip file
     * POST /api/favicon-settings/upload
     */
    async upload(ctx) {
      try {
        const files = ctx.request.files;
        
        if (!files || !files.file) {
          return ctx.badRequest('No file uploaded');
        }

        const file = Array.isArray(files.file) ? files.file[0] : files.file;

        // Validate file is a zip
        if (file.type !== 'application/zip' && !file.name.endsWith('.zip')) {
          return ctx.badRequest('File must be a zip archive');
        }

        // Define favicon directory in public
        const faviconDir = path.join(process.cwd(), 'public', 'favicons');
        
        // Create directory if it doesn't exist
        try {
          await mkdir(faviconDir, { recursive: true });
        } catch (err) {
          // Directory might already exist
        }

        // Extract zip file
        try {
          const zip = new AdmZip(file.path);
          const zipEntries = zip.getEntries();

          const allowedFiles = [
            'apple-touch-icon.png',
            'favicon.ico',
            'favicon.svg',
            'favicon-96x96.png',
            'site.webmanifest',
            'web-app-manifest-192x192.png',
            'web-app-manifest-512x512.png',
          ];

          const extractedFiles = [];

          for (const entry of zipEntries) {
            const fileName = path.basename(entry.entryName);
            
            // Only extract allowed favicon files
            if (allowedFiles.includes(fileName) && !entry.isDirectory) {
              const targetPath = path.join(faviconDir, fileName);
              
              // Extract and write file
              const fileContent = entry.getData();
              await writeFile(targetPath, fileContent);
              
              extractedFiles.push(fileName);
            }
          }

          // Clean up uploaded zip file
          try {
            await unlink(file.path);
          } catch (err) {
            console.error('Could not delete uploaded file:', err);
          }

          // Update or create favicon-settings entry
          const existingSettings = await strapi.db
            .query('api::favicon-settings.favicon-settings')
            .findOne();

          const settingsData = {
            files: extractedFiles,
            uploadedAt: new Date().toISOString(),
          };

          let settings;
          if (existingSettings) {
            settings = await strapi.db
              .query('api::favicon-settings.favicon-settings')
              .update({
                where: { id: existingSettings.id },
                data: settingsData,
              });
          } else {
            settings = await strapi.db
              .query('api::favicon-settings.favicon-settings')
              .create({
                data: settingsData,
              });
          }

          return ctx.send({
            message: 'Favicon files uploaded successfully',
            extractedFiles,
            settings,
          });
        } catch (zipError) {
          console.error('Error extracting zip:', zipError);
          return ctx.badRequest('Invalid zip file or extraction failed');
        }
      } catch (error) {
        console.error('Error uploading favicon:', error);
        return ctx.internalServerError('Failed to upload favicon files');
      }
    },

    /**
     * Get current favicon settings
     * GET /api/favicon-settings
     */
    async find(ctx) {
      try {
        const settings = await strapi.db
          .query('api::favicon-settings.favicon-settings')
          .findOne();

        if (!settings) {
          return ctx.send({
            data: null,
            message: 'No favicon settings found',
          });
        }

        // Check which files actually exist
        const faviconDir = path.join(process.cwd(), 'public', 'favicons');
        const availableFiles = [];

        try {
          const files = await readdir(faviconDir);
          for (const file of files) {
            const filePath = path.join(faviconDir, file);
            const fileStat = await stat(filePath);
            if (fileStat.isFile()) {
              availableFiles.push(file);
            }
          }
        } catch (err) {
          // Directory might not exist yet
        }

        return ctx.send({
          data: {
            ...settings,
            availableFiles,
          },
        });
      } catch (error) {
        console.error('Error fetching favicon settings:', error);
        return ctx.internalServerError('Failed to fetch favicon settings');
      }
    },
  })
);
