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
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  return generatePageMetadata({ config, params: resolvedParams, searchParams: resolvedSearchParams })
}

const Page = async ({ params, searchParams }: Args) => {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  return RootPage({
    config,
    params: resolvedParams,
    searchParams: resolvedSearchParams,
    importMap,
  })
}

export default Page