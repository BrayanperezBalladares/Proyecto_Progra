import type { UserFormPayload } from '@api/features/users/types/user.types'
import type { UserFormValues } from './user-form.schema'

export type UserFormMode = 'create' | 'edit'

export type UserFormProps = {
  mode: UserFormMode
  initialValues?: UserFormValues
  onSubmit: (payload: UserFormPayload) => void
  onCancel?: () => void
  isSubmitting?: boolean
}
