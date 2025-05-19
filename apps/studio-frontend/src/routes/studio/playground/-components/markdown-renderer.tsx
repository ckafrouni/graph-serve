import React from 'react';
import { cn } from '@workspace/ui/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const MarkdownRenderer = ({
	content,
	className,
}: {
	content: string;
	className?: string;
}) => {
	return (
		<div className={cn('prose dark:prose-invert max-w-none', className)}>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					a: ({ ...props }) => (
						<a
							{...props}
							target="_blank"
							rel="noopener noreferrer"
							className={cn(
								props.className,
								'px-0.5 text-purple-400 hover:text-purple-600',
								'rounded border bg-blue-400/50 px-1.5 py-0.5 text-white no-underline hover:bg-blue-400 hover:text-white'
							)}
						/>
					),
					h1: ({ ...props }) => <h1 {...props} className={cn('mb-4')} />,
					h2: ({ ...props }) => <h2 {...props} className={cn('mt-4')} />,
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
};
