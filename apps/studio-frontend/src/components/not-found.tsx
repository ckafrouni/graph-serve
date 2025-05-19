import { Link } from '@tanstack/react-router';
import { Button } from '@workspace/ui/components/ui/button';

export const NotFound = ({ link }: { link: { label: string; to: string } }) => {
	return (
		<div className="flex h-screen items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				<h1 className="text-4xl font-bold">404</h1>
				<p className="text-lg">Looks like you're lost</p>
				<Button variant="outline" asChild className="w-fit">
					<Link to={link.to}>{link.label}</Link>
				</Button>
			</div>
		</div>
	);
};
