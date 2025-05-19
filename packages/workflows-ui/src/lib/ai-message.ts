import type { AIMessageChunk } from '@langchain/core/messages';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

export interface ParsedAIMessageChunk {
	type: string;
	id: string[];
	kwargs?: {
		content?: string;
	};
}

export const isAIMessageChunk = (data: unknown): data is AIMessageChunk | ParsedAIMessageChunk => {
	if (typeof data !== 'object' || data === null) {
		return false;
	}
	const obj = data as Record<string, unknown>;

	const hasAIMessageChunkProps =
		typeof obj?.content === 'string' || typeof obj?._lc_kwargs === 'object';

	const hasParsedChunkProps =
		obj?.type === 'constructor' &&
		Array.isArray(obj?.id) &&
		(obj.id as unknown[]).includes('AIMessageChunk') &&
		!!obj?.kwargs &&
		typeof obj.kwargs === 'object' &&
		obj.kwargs !== null;

	return hasAIMessageChunkProps || hasParsedChunkProps;
};

export interface ParsedAIMessageChunk {
	type: string;
	id: string[];
	kwargs?: {
		content?: string;
	};
}

export interface GeneratorOutput {
	messages: AIMessageChunk | ParsedAIMessageChunk;
}

export type GraphUpdate =
	| { generator: GeneratorOutput }
	| Record<string, GeneratorOutput | unknown>;

export interface Document {
	pageContent: string;
	metadata: {
		id: string;
		distance?: number;
		source?: string;
	};
}

export interface Turn {
	user: HumanMessage;
	steps: GraphUpdate[];
	ai: AIMessage | null;
	sourceDocuments?: Document[];
}
