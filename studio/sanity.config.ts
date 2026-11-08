import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes, singletons } from './schemaTypes';

export default defineConfig({
  name: 'mahela',
  title: 'Mahela Group',
  projectId: import.meta.env.SANITY_STUDIO_PROJECT_ID,
  dataset: import.meta.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Website pages')
          .items(singletons.map((s) => S.listItem().title(s.title).id(s.id).child(S.document().schemaType(s.type).documentId(s.id).title(s.title)))),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    // Pages are fixed documents: hide them from "Create new" so nobody makes a second Cares page by mistake.
    templates: (templates) => templates.filter(({ schemaType }) => !singletons.some((s) => s.type === schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      singletons.some((s) => s.type === schemaType) ? actions.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action)) : actions,
  },
});
