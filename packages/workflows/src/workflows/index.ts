import { webSearchRagGraph, webSearchRagWorkflow } from './web-search-rag';

export { webSearchRagGraph, webSearchRagWorkflow };

export type { GraphAnnotationType as WebSearchGraphAnnotationType } from './web-search-rag';

export const workflowSelector = (workflow: string) => {
	switch (workflow) {
		case 'web-search-rag':
			return webSearchRagWorkflow;
		default:
			return null;
	}
};
