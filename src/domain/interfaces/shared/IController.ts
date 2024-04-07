import { Router } from 'express';

export interface IController {
	register(router: Router): void;
}
