import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { extend } from 'lodash';

export type Request = ExpressRequest;
export type Response = ExpressResponse;

export interface RegisterWithAuth extends ExpressRequest {
    userId: string
    domain?: string;
    action?: string;
}

export interface RequestWithTenant extends RegisterWithAuth {
    tenantId: string;
}