import { createFileRoute, Link } from '@tanstack/react-router';
import { trpc } from '@/utils/trpc';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/ui/button';

export const Route = createFileRoute('/status/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: healthCheckData, isLoading: healthCheckIsLoading } = useQuery(
		trpc.healthCheck.queryOptions()
	);

	return (
		<div className="container mx-auto max-w-3xl px-4 py-2">
			<div className="grid gap-6 pt-6">
				<div className="flex items-center gap-2">
					<Button variant="outline" asChild>
						<Link to="/studio/dashboard">Dashboard</Link>
					</Button>
					<Button variant="outline" asChild>
						<Link to="/login">Login</Link>
					</Button>
					<Button variant="outline" asChild>
						<a href="http://localhost:8000/docs">Python API</a>
					</Button>
				</div>

				<section className="rounded-lg border p-4">
					<h2 className="mb-2 font-medium">API Status</h2>
					<div className="flex items-center gap-2">
						<div
							className={`h-2 w-2 rounded-full ${healthCheckData ? 'bg-green-500' : 'bg-red-500'}`}
						/>
						<span className="text-muted-foreground text-sm">
							{healthCheckIsLoading
								? 'Checking...'
								: healthCheckData
									? 'Connected'
									: 'Disconnected'}
						</span>
					</div>
				</section>
			</div>
		</div>
	);
}
