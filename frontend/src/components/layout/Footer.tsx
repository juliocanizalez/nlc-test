export default function Footer() {
  return (
    <footer className='bg-background border-t border-[hsl(var(--border))] py-6'>
      <div className='container flex flex-col items-center justify-center gap-2'>
        <p className='text-center text-sm text-muted-foreground'>
          &copy; {new Date().getFullYear()} Service Order Management. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
