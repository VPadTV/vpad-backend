import { Body } from 'src/old/docs/helpers';
import { exId } from './id';

export const simpleUser: Body = {
    id: exId,
    nickname: 'string',
    profilePhotoUrl: 'string',
}