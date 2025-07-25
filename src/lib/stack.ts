import { StackClientApp } from '@stackframe/stack'

export const stackClientApp = new StackClientApp({
  tokenStore: 'nextjs-cookie',
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID || 'temp-project-id',
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY || 'temp-key',
  urls: {
    signIn: '/admin/login',
    signUp: '/admin/signup',
    forgotPassword: '/admin/forgot-password',
    home: '/admin/dashboard',
  },
})