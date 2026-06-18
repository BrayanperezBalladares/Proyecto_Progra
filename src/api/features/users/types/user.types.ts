export type User = {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
}

export type UserFormPayload = {
  name: string
  email: string
  username: string
}

export type CreateUserPayload = UserFormPayload

export type UpdateUserPayload = UserFormPayload

export type UpdateUserVariables = {
  id: number
  payload: UpdateUserPayload
}

export type DeleteUserVariables = {
  id: number
}
