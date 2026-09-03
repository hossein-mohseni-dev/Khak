export interface FieldErrors {
  [key: string]: string | undefined
}

export function validateLogin(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {}
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email.'
  if (!password) errors.password = 'Password is required.'
  return errors
}

export function validateRegister(input: {
  name: string
  email: string
  password: string
  confirm: string
}): FieldErrors {
  const errors: FieldErrors = {}
  if (!input.name || input.name.trim().length < 2) errors.name = 'Name must be at least 2 characters.'
  if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) errors.email = 'Enter a valid email.'
  if (!input.password || input.password.length < 6) errors.password = 'Password must be at least 6 characters.'
  if (input.password !== input.confirm) errors.confirm = 'Passwords do not match.'
  return errors
}

export function validateProfile(input: { name: string }): FieldErrors {
  const errors: FieldErrors = {}
  if (!input.name || input.name.trim().length < 2) errors.name = 'Name must be at least 2 characters.'
  return errors
}

export function validateDiagnosis(input: { file: File | null; plant: string; symptoms: string }): FieldErrors {
  const errors: FieldErrors = {}
  if (!input.file) errors.file = 'Upload a plant photo.'
  else if (!input.file.type.startsWith('image/')) errors.file = 'File must be an image.'
  else if (input.file.size > 8 * 1024 * 1024) errors.file = 'Image must be under 8MB.'
  if (!input.plant.trim()) errors.plant = 'Tell us which plant this is.'
  if (input.symptoms.trim().length < 4) errors.symptoms = 'Describe the symptoms in a few words.'
  return errors
}

export function validateConsult(input: { message: string }): FieldErrors {
  const errors: FieldErrors = {}
  if (!input.message || input.message.trim().length < 8) {
    errors.message = 'Describe the problem in at least 8 characters.'
  }
  return errors
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.values(errors).some(Boolean)
}
