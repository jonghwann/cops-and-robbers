export interface UseMutationCallbacks<TData = unknown, TError = Error> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
}
