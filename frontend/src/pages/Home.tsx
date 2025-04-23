import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Home() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Manage your projects</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground'>
            View and manage all your current projects.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service Orders</CardTitle>
          <CardDescription>Track service orders</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground'>
            Create and track service orders for your projects.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>View your stats</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground'>
            Get an overview of your projects and service orders.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
