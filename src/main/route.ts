import { Router } from 'express';

export interface IRoute {
    register(router: Router): void
}