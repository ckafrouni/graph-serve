import React from 'react';
import { Button } from '@workspace/ui/components/ui/button';
import { Input } from '@workspace/ui/components/ui/input';
import type { Workflow } from '@workspace/workflows-ui/hooks/useChatStream';
import { cn } from '@workspace/ui/lib/utils';
import { Send, type LucideIcon } from 'lucide-react';

export const UserInput = ({
  input,
  setInput,
  sendMessage,
  selectedWorkflow,
  setSelectedWorkflow,
  className,
  workflowOptions,
}: {
  input: string;
  setInput: (input: string) => void;
  sendMessage: (prompt: string, workflow: Workflow) => Promise<void>;
  selectedWorkflow: string;
  setSelectedWorkflow: (workflow: string) => void;
  className?: string;
  workflowOptions: { name: string; label: string; icon: LucideIcon }[];
}) => {
  return (
    <div className={cn('bg-background p-2', className)}>
      <div className="flex gap-2">
        {workflowOptions.map((option) => (
          <Button
            key={option.name}
            variant={selectedWorkflow === option.name ? 'outline' : 'ghost'}
            onClick={() => setSelectedWorkflow(option.name)}
            aria-label={option.name}
            title={option.name}
          >
            <option.icon className="h-4 w-4" />
            <span className="sr-only">{option.label}</span>
          </Button>
        ))}
        <form
          className="flex w-full gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            const prompt = input.trim();

            if (!prompt) return;

            setInput('');
            await sendMessage(prompt, selectedWorkflow as Workflow);
          }}
        >
          <Input
            type="text"
            name="prompt"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1"
          />
          <Button
            variant="default"
            className="hover:cursor-pointer"
            type="submit"
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
