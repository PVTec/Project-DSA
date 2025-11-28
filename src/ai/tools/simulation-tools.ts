'use server';
/**
 * @fileOverview Server Actions that execute the logic for simulation tools.
 */

import { z } from 'genkit';
import { type ToolResponse } from './tool-types';

const InjectTrafficInput = z.object({
  count: z.number().describe('The number of users to inject. Defaults to 1.'),
});

/**
 * Server Action to run the injectTraffic tool logic.
 */
export async function runInjectTrafficTool(input: z.infer<typeof InjectTrafficInput>): Promise<ToolResponse> {
  return { name: 'injectTraffic', params: { count: input.count || 1 } };
}


const ToggleAutoInjectInput = z.object({
  enable: z.boolean().describe('Set to true to enable, false to disable.'),
  interval: z.number().optional().describe('The interval in milliseconds for auto-injection. Only used when enabling.'),
});

/**
 * Server Action to run the toggleAutoInject tool logic.
 */
export async function runToggleAutoInjectTool(input: z.infer<typeof ToggleAutoInjectInput>): Promise<ToolResponse> {
    return { name: 'toggleAutoInject', params: { enable: input.enable, interval: input.interval } };
}
