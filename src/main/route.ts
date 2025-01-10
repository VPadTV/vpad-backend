import { Router } from 'express';

export interface IRoute {
    prefix: string
    register(router: Router): void
}