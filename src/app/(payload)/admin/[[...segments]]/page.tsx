/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import { importMap } from '../importMap.js'
import config from '../../../../payload.config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'

import { Metadata } from 'next'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> => {
  return generatePageMetadata({ config, params: await params, searchParams: await searchParams })
}

const Page = async ({ params, searchParams }: Args) => {
  return RootPage({
    config,
    params: await params,
    searchParams: await searchParams,
    importMap,
  })
}

export default Page