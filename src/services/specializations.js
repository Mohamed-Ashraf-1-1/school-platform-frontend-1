import { buildReferenceService } from './referenceFactory.js';

// /specializations -> { id, name, slug, description, _count: { schools }, createdAt, updatedAt }
export const specializationsApi = buildReferenceService('specializations');
