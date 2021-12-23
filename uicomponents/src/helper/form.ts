const validateNotEmpty = (value: any, path: any, clearErrors: any) => {
  clearErrors(path)
  return !!value
}

export { validateNotEmpty }
