import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useAuth } from '../../lib/use-auth';
import { motion } from 'framer-motion';
import { SlideIn, FadeIn } from '../ui/motion';

const navbarVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const navItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.2,
    },
  }),
};

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <motion.div
      className='border-b'
      initial='hidden'
      animate='visible'
      variants={navbarVariants}
    >
      <div className='flex h-16 items-center px-4 container mx-auto'>
        <Link
          to='/'
          className='font-bold text-xl'
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Service Order Manager
          </motion.div>
        </Link>

        <div className='ml-auto flex items-center space-x-4'>
          {isAuthenticated ? (
            <>
              <FadeIn delay={0.1}>
                <span className='text-sm text-muted-foreground'>
                  Welcome, {user?.username}
                </span>
              </FadeIn>
              <motion.div
                custom={0}
                variants={navItemVariants}
              >
                <Link to='/projects'>
                  <Button variant='ghost'>Projects</Button>
                </Link>
              </motion.div>
              <motion.div
                custom={1}
                variants={navItemVariants}
              >
                <Link to='/service-orders'>
                  <Button variant='ghost'>Service Orders</Button>
                </Link>
              </motion.div>
              <motion.div
                custom={2}
                variants={navItemVariants}
              >
                <Button
                  onClick={logout}
                  variant='outline'
                >
                  Logout
                </Button>
              </motion.div>
            </>
          ) : (
            <SlideIn direction='right'>
              <Link to='/auth'>
                <Button>Login</Button>
              </Link>
            </SlideIn>
          )}
        </div>
      </div>
    </motion.div>
  );
}
