import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className='bg-background border-b border-[hsl(var(--border))]'>
      <div className='container flex h-16 items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='text-xl font-bold'>Service Order Management</span>
        </div>
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            size='sm'
          >
            Login
          </Button>
        </div>
      </div>
    </header>
  );
}
