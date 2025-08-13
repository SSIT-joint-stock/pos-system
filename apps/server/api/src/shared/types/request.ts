import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';

export type Request = ExpressRequest;
export type Response = ExpressResponse;

export interface RequestWithTenant extends ExpressRequest {
    tenantId: string;
    domain?: string;
    action?: string;
}