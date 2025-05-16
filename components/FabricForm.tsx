import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export const schema = Yup.object({
  epc: Yup.string().required(),
  name: Yup.string().required(),
  color: Yup.string().required(),
  weight: Yup.number().positive().required(),
  location: Yup.string().required(),
  tagIssuedOn: Yup.date().required(),
  rollType: Yup.string().required(),
});

export type FabricPayload = Yup.InferType<typeof schema>;

type Props = {
  initial?: Partial<FabricPayload>;
  onSubmit: (data: FabricPayload) => void;
};

export default function FabricForm({ initial = {}, onSubmit }: Props) {
  const form = useFormik<FabricPayload>({
    initialValues: {
      epc: '',
      name: '',
      color: '',
      weight: 0,
      location: '',
      tagIssuedOn: new Date(),
      rollType: '',
      ...initial,
    },
    validationSchema: schema,
    onSubmit,
  });

  const field = (name: keyof FabricPayload, type = 'text') => (
    <div className="flex flex-col gap-1">
      <label className="text-sm">{name}</label>
      <input
        type={type}
        name={name}
        value={(form.values as any)[name]}
        onChange={form.handleChange}
        className="border rounded px-2 py-1"
      />
      {form.touched[name] && form.errors[name] && (
        <p className="text-xs text-red-600">{String(form.errors[name])}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={form.handleSubmit} className="space-y-4">
      {field('epc')}
      <div className="grid grid-cols-2 gap-4">
        {field('name')}
        {field('color')}
        {field('weight', 'number')}
        {field('location')}
        {field('tagIssuedOn', 'date')}
        {field('rollType')}
      </div>
      <button
        type="submit"
        disabled={form.isSubmitting}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {form.isSubmitting ? 'Saving…' : 'Save Fabric'}
      </button>
    </form>
  );
} 