'use client';

import { useState } from 'react';
import { MembroEquipa } from '@/lib/types/forms';
import { FormField } from '../form-field';
import { FormActions } from '../form-actions';
import { Input } from '@/components/ui/input';

interface AddMembroFormProps {
  onSubmit: (membro: Omit<MembroEquipa, 'id'>) => void;
  onCancel: () => void;
}

export default function AddMembroForm({ onSubmit, onCancel }: AddMembroFormProps) {
  const [formData, setFormData] = useState({
    nome: '',
    cargo: '',
    departamento: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Nome" required>
        <Input
          value={formData.nome}
          onChange={e => handleChange('nome', e.target.value)}
          required
        />
      </FormField>

      <FormField label="Cargo" required>
        <Input
          value={formData.cargo}
          onChange={e => handleChange('cargo', e.target.value)}
          required
        />
      </FormField>

      <FormField label="Departamento" required>
        <Input
          value={formData.departamento}
          onChange={e => handleChange('departamento', e.target.value)}
          required
        />
      </FormField>

      <FormActions onCancel={onCancel} />
    </form>
  );
}