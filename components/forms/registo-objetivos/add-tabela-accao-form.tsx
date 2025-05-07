import { useState } from 'react';
import { FormField } from '../form-field';
import { FormActions } from '../form-actions';
import { Input } from '@/components/ui/input';

interface TabelaAccao {
  id?: string;
  accao: string;
  pessoaResponsavel: string;
  prazo: Date;
  dataConclusao: Date;
}

interface AddTabelaAccaoFormProps {
  onSubmit: (data: Omit<TabelaAccao, 'id'>) => void;
  onCancel: () => void;
}

export default function AddTabelaAccaoForm({
  onSubmit,
  onCancel,
}: AddTabelaAccaoFormProps) {
  const [formData, setFormData] = useState<Omit<TabelaAccao, 'id'>>({
    accao: '',
    pessoaResponsavel: '',
    prazo: new Date(),
    dataConclusao: new Date(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    field: keyof Omit<TabelaAccao, 'id'>,
    value: string | Date
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <FormField label='Ação' required>
        <Input
          value={formData.accao}
          onChange={(e) => handleChange('accao', e.target.value)}
          required
        />
      </FormField>

      <FormField label='Pessoa Responsável' required>
        <Input
          value={formData.pessoaResponsavel}
          onChange={(e) => handleChange('pessoaResponsavel', e.target.value)}
          required
        />
      </FormField>

      <FormField label='Prazo' required>
        <Input
          type='date'
          value={
            formData.prazo instanceof Date
              ? formData.prazo.toISOString().split('T')[0]
              : ''
          }
          onChange={(e) => handleChange('prazo', new Date(e.target.value))}
          required
        />
      </FormField>

      <FormField label='Data de Conclusão' required>
        <Input
          type='date'
          value={
            formData.dataConclusao instanceof Date
              ? formData.dataConclusao.toISOString().split('T')[0]
              : ''
          }
          onChange={(e) =>
            handleChange('dataConclusao', new Date(e.target.value))
          }
          required
        />
      </FormField>

      <FormActions onCancel={onCancel} />
    </form>
  );
}
