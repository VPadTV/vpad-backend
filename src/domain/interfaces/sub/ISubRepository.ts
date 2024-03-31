import { IBaseRepository } from './../shared/IBaseRepository';
import { Subscription } from "@prisma/client";


export interface ISubRepository extends IBaseRepository<Subscription>{}