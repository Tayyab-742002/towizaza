import {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Artist Info')
        .child(
          S.document()
            .schemaType('artist')
            .documentId('artist')
        ),
      ...S.documentTypeListItems().filter(
        listItem => !['artist'].includes(listItem.getId() || '')
      ),
    ])
