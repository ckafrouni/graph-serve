import { useState, useCallback } from 'react';
import { HumanMessage, AIMessage, AIMessageChunk } from '@langchain/core/messages';
import type { Turn, Document } from '../lib/ai-message';
import { isAIMessageChunk } from '../lib/ai-message';
import { apiFetch } from '../lib/fetch';

export function useChatStream() {
	const [turns, setTurns] = useState<Turn[]>([]);

	const sendMessage = useCallback(async (prompt: string, workflow: string) => {
		setTurns((prevTurns) => [
			...prevTurns,
			{
				user: new HumanMessage(prompt),
				steps: [],
				ai: null,
				sourceDocuments: [],
			},
		]);

		try {
			const response = await apiFetch(`/api/workflows/messages`, {
				method: 'POST',
				body: JSON.stringify({ prompt, workflow }),
			});

			if (!response.ok || !response.body) {
				setTurns((prevTurns) => {
					const lastTurnIndex = prevTurns.length - 1;
					if (lastTurnIndex < 0) return prevTurns;
					const lastTurn = prevTurns[lastTurnIndex];
					return [
						...prevTurns.slice(0, -1),
						{
							...lastTurn,
							ai: new AIMessage(`Error: ${response.statusText}`),
						},
					];
				});
				return;
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let buffer = '';

			while (true) {
				const { done, value } = await reader.read();
				if (done) {
					break;
				}

				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split('\n');
				buffer = lines.pop() || '';

				for (const line of lines) {
					if (line.trim() === '') continue;

					const parsedData = JSON.parse(line);

					if (!Array.isArray(parsedData) || parsedData.length !== 2) {
						continue;
					}

					const [eventType, payload] = parsedData;

					if (eventType === 'updates') {
						const update = payload as Record<string, unknown>;
						const nodeKeys = Object.keys(update);
						if (nodeKeys.length > 0) {
							const stepName = nodeKeys[0];
							const stepData = (update as Record<string, unknown>)[stepName];
							let sourceDocuments: Document[] = [];
							setTurns((prevTurns) => {
								const lastTurnIndex = prevTurns.length - 1;
								if (lastTurnIndex < 0) return prevTurns;
								const lastTurn = prevTurns[lastTurnIndex];
								return [
									...prevTurns.slice(0, -1),
									{
										...lastTurn,
										steps: [...lastTurn.steps, { name: stepName, data: stepData }],
										sourceDocuments: [
											...(lastTurn.sourceDocuments || []),
											...(sourceDocuments || []),
										],
									},
								];
							});
						}
					} else if (eventType === 'messages') {
						if (!Array.isArray(payload) || payload.length === 0) {
							continue;
						}
						const messageChunk = payload[0];

						if (isAIMessageChunk(messageChunk)) {
							let chunkContent = '';
							if (
								'kwargs' in messageChunk &&
								messageChunk.kwargs &&
								typeof messageChunk.kwargs.content === 'string'
							) {
								chunkContent = messageChunk.kwargs.content;
							} else if ('content' in messageChunk && typeof messageChunk.content === 'string') {
								chunkContent = messageChunk.content;
							}

							if (chunkContent) {
								setTurns((prevTurns) => {
									const lastTurnIndex = prevTurns.length - 1;
									if (lastTurnIndex < 0) return prevTurns;
									const currentTurn = prevTurns[lastTurnIndex];

									const currentAIContent = (currentTurn.ai?.content as string) || '';
									const updatedAIContent = currentAIContent + chunkContent;

									let sourceDocuments = currentTurn.sourceDocuments;
									const metadataChunk = messageChunk as AIMessageChunk;
									if (
										metadataChunk.response_metadata &&
										'source_documents' in metadataChunk.response_metadata &&
										Array.isArray(metadataChunk.response_metadata.source_documents)
									) {
										sourceDocuments = metadataChunk.response_metadata
											.source_documents as Document[];
									}

									const updatedTurn = {
										...currentTurn,
										ai: new AIMessage({
											content: updatedAIContent,
											response_metadata: {
												...(currentTurn.ai?.response_metadata || {}),
												...(metadataChunk.response_metadata || {}),
											},
										}),
										sourceDocuments,
									};

									const updatedTurns = [...prevTurns];
									updatedTurns[lastTurnIndex] = updatedTurn;
									return updatedTurns;
								});
							}
						}
					}
				}
			}
		} catch {
			setTurns((prevTurns) => {
				const lastTurnIndex = prevTurns.length - 1;
				if (lastTurnIndex < 0) return prevTurns;
				const lastTurn = prevTurns[lastTurnIndex];
				return [
					...prevTurns.slice(0, -1),
					{
						...lastTurn,
						ai: new AIMessage(`Error: Failed to connect or process stream.`),
					},
				];
			});
		}
	}, []);

	return { turns, sendMessage };
}
