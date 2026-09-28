/** Shapes shared by dashboard Server Actions and the client components that call them. */

export type FieldErrors = Partial<Record<string, string>>

export type ActionFailure = { ok: false; error: string; fieldErrors?: FieldErrors }

export type ActionResult<T extends object = object> = ({ ok: true } & T) | ActionFailure

export function actionFailure(error: string, fieldErrors?: FieldErrors): ActionFailure {
  return fieldErrors ? { ok: false, error, fieldErrors } : { ok: false, error }
}

/** Friendly message for errors thrown by a Server Action (expired session, network…). */
export const UNEXPECTED_ERROR =
  'Something went wrong. Please check your connection, reload the page and try again — you may need to sign in again.'
