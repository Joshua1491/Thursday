import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

// GET all fabrics
export const useFabrics = () =>
  useQuery(['fabrics'], () => api.get('/fabrics').then(r => r.data));

// CREATE
export const useCreateFabric = () => {
  const qc = useQueryClient();
  return useMutation(
    (d: any) => api.post('/fabrics', d).then(r => r.data),
    { onSuccess: () => qc.invalidateQueries(['fabrics']) }
  );
};

// UPDATE
export const useUpdateFabric = () => {
  const qc = useQueryClient();
  return useMutation(
    ({ epc, ...d }: any) =>
      api.put(`/fabrics/${epc}`, d).then(r => r.data),
    { onSuccess: () => qc.invalidateQueries(['fabrics']) }
  );
};

// DELETE
export const useDeleteFabric = () => {
  const qc = useQueryClient();
  return useMutation(
    (epc: string) => api.delete(`/fabrics/${epc}`),
    { onSuccess: () => qc.invalidateQueries(['fabrics']) }
  );
}; 