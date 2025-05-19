'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';

import { cn } from '@workspace/ui/lib/utils';
import { Button } from '@workspace/ui/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '@workspace/ui/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/ui/popover';

export interface ComboboxProps {
	options: { value: string; label: string }[];
	value: string;
	onValueChange: (value: string) => void;
	onSearch?: (query: string) => Promise<void>;
	isSearching?: boolean;
	placeholder?: string;
	emptyText?: string;
	className?: string;
	autoFocus?: boolean;
	onClose?: () => void;
}

export function Combobox({
	options,
	value,
	onValueChange,
	onSearch,
	isSearching = false,
	placeholder = 'Select option...',
	emptyText = 'No option found.',
	className,
	autoFocus,
	onClose,
}: ComboboxProps) {
	const [open, setOpen] = React.useState(autoFocus);
	const [searchQuery, setSearchQuery] = React.useState('');
	const searchDebounceRef = React.useRef<NodeJS.Timeout>(null);
	const inputRef = React.useRef<HTMLInputElement>(null);

	// Force open state when autoFocus changes
	React.useEffect(() => {
		if (autoFocus) {
			setOpen(true);
			// Focus the input after a short delay to ensure the popover is open
			setTimeout(() => {
				inputRef.current?.focus();
			}, 0);
		}
	}, [autoFocus]);

	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		if (!isOpen) {
			setSearchQuery('');
			if (onClose) {
				onClose();
			}
		}
	};

	// Handle search with debounce
	const handleSearch = React.useCallback(
		(value: string) => {
			setSearchQuery(value);

			if (searchDebounceRef.current) {
				clearTimeout(searchDebounceRef.current);
			}

			if (onSearch) {
				searchDebounceRef.current = setTimeout(() => {
					onSearch(value);
				}, 300); // 300ms debounce
			}
		},
		[onSearch]
	);

	// Cleanup debounce timer
	React.useEffect(() => {
		return () => {
			if (searchDebounceRef.current) {
				clearTimeout(searchDebounceRef.current);
			}
		};
	}, []);

	// If no onSearch provided or no search query, show first 25 items
	// If searching (either locally or via API), show all filtered results
	const displayedOptions = React.useMemo(() => {
		// Always apply local filtering regardless of API search
		if (searchQuery) {
			return options.filter((option) =>
				option.label.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		// If not searching, show current value first if it exists
		const currentOption = options.find((option) => option.value === value);
		if (currentOption) {
			const otherOptions = options.filter((option) => option.value !== value);
			return [currentOption, ...otherOptions].slice(0, 25);
		}

		// Otherwise show first 25 items
		return options.slice(0, 25);
	}, [options, searchQuery, value]);

	const selectedLabel = options.find((option) => option.value === value)?.label;

	return (
		<Popover open={open} onOpenChange={handleOpenChange}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn('w-full justify-between', className)}
				>
					{selectedLabel || placeholder}
					<ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0">
				<Command shouldFilter={false}>
					<CommandInput
						ref={inputRef}
						placeholder={`Search ${placeholder.toLowerCase()}...`}
						value={searchQuery}
						onValueChange={handleSearch}
						autoFocus={autoFocus}
					/>
					{isSearching ? (
						<div className="py-6 text-center">
							<Loader2 className="mx-auto h-4 w-4 animate-spin" />
						</div>
					) : displayedOptions.length === 0 ? (
						<CommandEmpty>{emptyText}</CommandEmpty>
					) : (
						<CommandGroup className="max-h-[200px] overflow-auto">
							{displayedOptions.map((option) => (
								<CommandItem
									key={option.value}
									value={option.label}
									onSelect={() => {
										onValueChange(value === option.value ? '' : option.value);
										setOpen(false);
										setSearchQuery('');
									}}
								>
									<Check
										className={cn(
											'mr-2 h-4 w-4',
											value === option.value ? 'opacity-100' : 'opacity-0'
										)}
									/>
									{option.label}
								</CommandItem>
							))}
							{!searchQuery && options.length > 25 && (
								<div className="text-muted-foreground px-2 py-2 text-center text-xs">
									Showing first 25 items. Type to search all {options.length} items.
								</div>
							)}
						</CommandGroup>
					)}
				</Command>
			</PopoverContent>
		</Popover>
	);
}
