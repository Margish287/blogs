export const formateError = (error) => {
  return {
    status: error.status,
    success: error.success,
    message: error.message,
  };
};
