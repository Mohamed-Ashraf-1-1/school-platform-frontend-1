import { buildReferenceService } from './referenceFactory.js';

// /governorates -> { id, name, slug, _count: { schools }, createdAt, updatedAt }
export const governoratesApi = buildReferenceService('governorates');
