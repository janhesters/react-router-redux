import { faker } from '@faker-js/faker';
import { createId } from '@paralleldrive/cuid2';

import type { Layout, Position } from './terminal-reducer';

/**
 * Response type for terminal API calls.
 */
export type TerminalApiResponse = {
  layout: Layout;
  lastSync: string;
};

/**
 * Mock function to retrieve a random layout with simulated network latency.
 * @returns Promise that resolves to a random Layout with lastSync timestamp.
 */
export const retrieveLayout = async (): Promise<TerminalApiResponse> => {
  // Create a random layout with up to 4 widgets (one per position).
  const layout: Layout = {};
  const positions: Position[] = ['top', 'bottom', 'left', 'right'];

  // Shuffle the positions array to randomly select which positions will have
  // widgets.
  const shuffledPositions = [...positions].sort(() =>
    faker.number.int({ min: -1, max: 1 }),
  );

  // Generate between 1 and 4 widgets (one per position).
  const widgetCount = faker.number.int({ min: 1, max: 4 });

  // Assign one widget to each of the first 'widgetCount' positions.
  for (let index = 0; index < widgetCount; index++) {
    const id = createId();
    const position = shuffledPositions[index];

    layout[id] = { position, widget: { id } };
  }

  // Generate a timestamp within the last minute.
  const now = new Date();
  const lastSync = new Date(
    now.getTime() - faker.number.int({ min: 1, max: 60 }) * 1000,
  ).toISOString();

  // Simulate network latency.
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ layout, lastSync });
    }, 1000);
  });
};

/**
 * Mock function to update a layout with simulated network latency.
 * @param data The terminal data to update.
 * @returns Promise that resolves to the same layout and timestamp that were
 * passed in.
 */
export const updateLayout = async (
  data: TerminalApiResponse,
): Promise<TerminalApiResponse> => {
  // Simulate network latency.
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, 1000);
  });
};
