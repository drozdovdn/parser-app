import { Router } from 'express';

import { deleteBookCollection, getBookCollectionById, getUserBookCollections } from '../controllers/bookCollection';

const bookCollectionRouter = Router();

bookCollectionRouter.get('/', getUserBookCollections);
bookCollectionRouter.delete('/:id', deleteBookCollection);
bookCollectionRouter.get('/:id', getBookCollectionById);

export default bookCollectionRouter;
