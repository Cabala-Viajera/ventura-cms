import {Select} from '@sanity/ui'
import {getPublishedId, set, useEditState, useFormValue, type StringInputProps} from 'sanity'

export function LanguageInput(props: StringInputProps) {
  const documentId = useFormValue(['_id']) as string
  const {published, ready} = useEditState(getPublishedId(documentId), 'post')
  const hasPublishedLanguage = published?.language === 'es' || published?.language === 'en'
  const readOnly = Boolean(props.readOnly || !ready || hasPublishedLanguage)
  const hasLanguage = props.value === 'es' || props.value === 'en'

  return (
    <Select
      {...props.elementProps}
      value={hasLanguage ? props.value : ''}
      disabled={readOnly}
      readOnly={readOnly}
      customValidity={props.validationError}
      onChange={(event) => {
        const language = event.currentTarget.value
        if (!readOnly && (language === 'es' || language === 'en')) {
          props.onChange(set(language))
        }
      }}
    >
      {!hasLanguage && (
        <option value="" disabled>
          Select a language
        </option>
      )}
      <option value="es">Español</option>
      <option value="en">English</option>
    </Select>
  )
}
