export * from './base';
export * from './email';
export * from './telegram';

export type MessageType = 'email' | 'telegram';

export interface QueueConfig {
  name: string;
  prefix?: string;
  defaultJobOptions?: {
    attempts?: number;
    backoff?: {
      type: 'exponential' | 'fixed';
      delay: number;
    };
    removeOnComplete?: boolean | number;
    removeOnFail?: boolean | number;
  };
}

export interface WorkerConfig extends QueueConfig {
  concurrency?: number;
  limiter?: {
    max: number;
    duration: number;
  };
} 