
import Link from 'next/link';
import { auth } from '@/auth';
import { signOutUser } from '@/lib/actions/user.actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// User icon removed - not used in this minimal button

const UserButton = async () => {
  const session = await auth();

  if (!session) {
    return (
        <Link href='/sign-in' className='text-sm tracking-widest font-bold hover:opacity-70 transition-opacity'>
          LOGIN
        </Link>
    );
  }

  return (
    <div className='flex gap-2 items-center'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className='flex items-center cursor-pointer text-sm tracking-widest font-bold hover:opacity-70 transition-opacity'>
            ACCOUNT
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56 rounded-none border-black border-2' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1 cursor-pointer'>
              <div className='text-sm font-medium leading-none cursor-pointer'>
                {session.user?.name}
              </div>
              <div className='text-sm text-muted-foreground leading-none cursor-pointer'>
                {session.user?.email}
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem>
            <Link href='/user/profile' className='w-full'>
              User Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href='/user/orders' className='w-full'>
              Order History
            </Link>
          </DropdownMenuItem>

          {session?.user?.role === 'admin' && (
            <DropdownMenuItem>
              <Link href='/admin/dashboard' className='w-full'>
                Admin
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className='p-0 mb-1 cursor-pointer'>
            <form action={signOutUser} className='w-full cursor-pointer'>
              <Button
                className='w-full py-4 px-2 h-4 justify-start cursor-pointer'
                variant='ghost'
              >
                Sign Out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
