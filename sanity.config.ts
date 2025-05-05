'use client'

/**
 * This configuration is used to for the Sanity Studio that's mounted on the `\src\app\studio\[[...tool]]\page.tsx` route
 */

import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {structure} from './src/sanity/structure'
import { schemaTypes } from '@/sanity/schemaTypes'
import { structureTool } from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works

export default defineConfig({
  name: 'default',
  title: 'Towizaza',
  
  projectId,
  dataset,
  
  plugins: [
    
    structureTool({structure}),
    visionTool({defaultApiVersion: apiVersion}),
  ],
  
  schema: {
    types: schemaTypes,
  },
  
  basePath: '/studio',
})
