import {
  ApplicationFailure,
  log,
  proxyActivities,
  sleep,
  startChild,
} from '@temporalio/workflow';

import type { createActivities } from './activities';

const { fileToDelete, deleteFile } = proxyActivities<
  ReturnType<typeof createActivities>
>({
  startToCloseTimeout: '1 minute',
  retry: {
    nonRetryableErrorTypes: ['do_not_retry'],
  },
});

export async function successWorkflow(dryRun: boolean = false) {
  const handler = await startChild(doomWorkflow, {
    args: [dryRun],
  });

  await sleep(1000);

  const isHealthy = await handler.result();

  if (isHealthy) {
    await Promise.all([successWorkflow(dryRun), successWorkflow(dryRun)]);
  } else {
    throw new ApplicationFailure('message', 'do_not_retry');
  }
}

// Add Workflow Definitions here.
export async function doomWorkflow(dryRun: boolean = true): Promise<boolean> {
  // Randomly select a file to delete
  log.info('Find a file to delete');
  const file = await fileToDelete();

  // Delete it
  if (dryRun) {
    log.info('Delete the mofo', {
      file,
    });

    await deleteFile(file);
  }

  // Check if it's healthy
  log.info('Has this killed the machine?');

  return true;
}
