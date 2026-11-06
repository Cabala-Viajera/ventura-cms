import {at, defineMigration, setIfMissing} from 'sanity/migrate'

export default defineMigration({
  title: 'Mark existing posts as Spanish',
  documentTypes: ['post'],
  filter: '!defined(language)',
  migrate: {
    document() {
      return at('language', setIfMissing('es'))
    },
  },
})
