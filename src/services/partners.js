import { buildReferenceService } from './referenceFactory.js';

// /partners -> { id, name, slug, logo, description, website, _count: { schools }, createdAt, updatedAt }
export const partnersApi = buildReferenceService('partners');
