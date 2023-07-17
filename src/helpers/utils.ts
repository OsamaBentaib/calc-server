export const getErrorMessage = (err: unknown): string => {
  return err instanceof Error ? err.message : "An unknown error occurred";
};
