import { Command } from 'commander';
import { promises as fs } from 'fs';
import path from 'path';

export function registerStorageLinkCommand(program: Command) {
  program
    .command('storage:link')
    .description('Create a symbolic link from "public/storage" to "storage"')
    .action(async () => {
      const publicPath = path.join(process.cwd(), 'public', 'storage');
      const storagePath = path.join(process.cwd(), 'storage');

      console.log('🔗 Linking storage directory...');

      try {
        // Ensure storage directory exists
        await fs.mkdir(storagePath, { recursive: true });

        // Check if public directory exists, if not create it
        const publicDir = path.join(process.cwd(), 'public');
        await fs.mkdir(publicDir, { recursive: true });

        // Check if link already exists
        try {
          const stats = await fs.lstat(publicPath);
          if (stats.isSymbolicLink()) {
            console.log('✅ The [public/storage] link already exists.');
            return;
          }
        } catch {
          // Doesn't exist, proceed
        }

        // Create symbolic link (junction on Windows, dir symlink on Unix)
        const isWindows = process.platform === 'win32';
        await fs.symlink(storagePath, publicPath, isWindows ? 'junction' : 'dir');

        console.log('✨ The [public/storage] directory has been linked.');
      } catch (error: any) {
        console.error('❌ Failed to link storage directory:', error.message);
      }
    });
}

