const validateNotEmpty = (value: any, path: any, clearErrors: any): boolean => {
  clearErrors(path)
  return !!value
}

export { validateNotEmpty }
