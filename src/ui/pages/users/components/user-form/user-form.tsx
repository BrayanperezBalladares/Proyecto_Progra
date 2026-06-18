import { useForm } from '@tanstack/react-form'
import { AppButton } from '@ui/shell/button/app-button'
import { userFormSchema, type UserFormValues } from './user-form.schema'
import type { UserFormProps } from './user-form.types'

const emptyValues: UserFormValues = {
  name: '',
  email: '',
  username: '',
}

export function UserForm({
  mode,
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: UserFormProps) {
  const form = useForm({
    defaultValues: initialValues ?? emptyValues,
    validators: {
      onChange: userFormSchema,
    },
    onSubmit: ({ value }) => {
      onSubmit(value)
      if (mode === 'create') {
        form.reset()
      }
    },
  })

  const title = mode === 'create' ? 'Create user' : 'Edit user'
  const submitLabel = mode === 'create' ? 'Create user' : 'Save changes'

  return (
    <form
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <h2 className="mb-4 text-lg font-semibold text-gray-900">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <form.Field name="name">
          {(field) => (
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-gray-700">Name</span>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors[0] && (
                <span className="mt-1 block text-xs text-red-600">
                  {String(field.state.meta.errors[0])}
                </span>
              )}
            </label>
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-gray-700">Email</span>
              <input
                type="email"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors[0] && (
                <span className="mt-1 block text-xs text-red-600">
                  {String(field.state.meta.errors[0])}
                </span>
              )}
            </label>
          )}
        </form.Field>

        <form.Field name="username">
          {(field) => (
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-gray-700">
                Username
              </span>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors[0] && (
                <span className="mt-1 block text-xs text-red-600">
                  {String(field.state.meta.errors[0])}
                </span>
              )}
            </label>
          )}
        </form.Field>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <AppButton type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </AppButton>
        {mode === 'edit' && onCancel && (
          <AppButton type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </AppButton>
        )}
      </div>
    </form>
  )
}
