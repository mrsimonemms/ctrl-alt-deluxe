import { log } from '@temporalio/activity';
import { glob } from 'glob';
import { unlink } from 'node:fs/promises';

// If you wish to connect any dependencies (eg, database), add in here
export const createActivities = (/* db: typeorm.DataSource */) => ({
  async deleteFile(file: string): Promise<boolean> {
    log.info("You're terminated!", { file });

    try {
      // await unlink(file);
      console.log({ unlink });
      return true;
    } catch {
      log.info("File didn't die with honour", { file });
      return false;
    }

    return true;
  },

  async fileToDelete() {
    const files = await glob('/**/*');

    const id = Math.floor(Math.random() * files.length);

    return files[id];
  },
});
