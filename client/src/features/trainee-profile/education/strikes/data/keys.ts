export const strikeKeys = {
  all: ['strikes'] as const,
  list: (traineeId: string) => [...strikeKeys.all, 'list', traineeId] as const,
  detail: (strikeId: string) => [...strikeKeys.all, 'detail', strikeId] as const,
};
