import { caresPage } from './caresPage';

export const schemaTypes = [caresPage];

/** One fixed document per page. Add the next page here when it moves into the CMS. */
export const singletons = [{ id: 'caresPage', type: 'caresPage', title: 'Mahela Cares page' }];
