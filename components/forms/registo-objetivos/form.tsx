'use client';

import { useState, useEffect } from 'react';
import { RegistoObjetivos, MembroEquipa, TabelaAccao } from '@/lib/types/forms';
import { useFormApi } from '@/lib/hooks/use-form-api';
import { FormSection } from '../form-section';
import { FormRow } from '../form-row';
import { FormField } from '../form-field';
import { FormActions } from '../form-actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AddEntityDialog } from '../related-entities/add-entity-dialog';
import { EntityList } from '../related-entities/entity-list';
import { Button } from '@/components/ui/button';
import { CalendarClock, ClipboardList, Plus, UserPlus } from 'lucide-react';
import AddMembroForm from './add-membro-form';
import AddTabelaAccaoForm from './add-tabela-accao-form';
import { useMembrosEquipa } from '@/lib/hooks/use-membros-equipa';
import { useTabelaAccao } from '@/lib/hooks/use-tabela-accao';

interface RegistoObjetivosFormProps {
  initialData?: Partial<RegistoObjetivos>;
  onSuccess?: (data: RegistoObjetivos) => void;
  onCancel?: () => void;
}

export function RegistoObjetivosForm({
  initialData,
  onSuccess,
  onCancel,
}: RegistoObjetivosFormProps) {
  // Initialize form with default dates if not provided
  const defaultData = {
    dataInicio: new Date(),
    dataConclusaoPrevista: new Date(),
    dataConclusaoReal: new Date(),
    dataAprovacao: new Date(),
    data: new Date(),
    ...initialData,
  };

  const [formData, setFormData] =
    useState<Partial<RegistoObjetivos>>(defaultData);

  // Get membros equipa from API
  const {
    data: membrosEquipaData,
    isLoading: isLoadingMembros,
    create: createMembro,
  } = useMembrosEquipa();

  // Get tabela accoes from API
  const {
    data: tabelasAccoesData,
    isLoading: isLoadingTabelasAccoes,
    create: createTabelaAccao,
  } = useTabelaAccao();

  // Membros da Equipa state
  const [selectedMembros, setSelectedMembros] = useState<Array<MembroEquipa>>(
    []
  );

  // Tabelas Accoes state
  const [selectedTabelasAccoes, setSelectedTabelasAccoes] = useState<
    Array<TabelaAccao>
  >([]);

  const { create, update, isLoading, error } = useFormApi<RegistoObjetivos>({
    endpoint: 'registo-objetivos',
  });

  // Load initial membros da equipa if present in initialData
  useEffect(() => {
    if (initialData?.membrosDaEquipa && membrosEquipaData.length > 0) {
      const selectedMembroIds = initialData.membrosDaEquipa.map(
        (m: any) => m.membroEquipaId
      );
      const selectedMembros = membrosEquipaData.filter((membro) =>
        selectedMembroIds.includes(membro.id)
      );
      setSelectedMembros(selectedMembros);
    }
  }, [initialData?.membrosDaEquipa, membrosEquipaData]);

  // Load initial tabelas accoes if present in initialData
  useEffect(() => {
    if (initialData?.tabelasAccoes && tabelasAccoesData.length > 0) {
      const selectedTabelasIds = initialData.tabelasAccoes.map(
        (t: any) => t.tabelaAccaoId
      );
      const selectedTabelas = tabelasAccoesData.filter((tabela) =>
        selectedTabelasIds.includes(tabela.id)
      );
      setSelectedTabelasAccoes(selectedTabelas);
    }
  }, [initialData?.tabelasAccoes, tabelasAccoesData]);

  // Format date for input element (YYYY-MM-DD)
  const formatDateForInput = (date: Date | string | undefined): string => {
    if (!date) return '';

    const dateObj = date instanceof Date ? date : new Date(date);

    // Check if date is valid
    if (isNaN(dateObj.getTime())) return '';

    return dateObj.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Ensure all dates are valid Date objects
      const processedData = { ...formData };

      // Process date fields
      [
        'dataInicio',
        'dataConclusaoPrevista',
        'dataConclusaoReal',
        'dataAprovacao',
        'data',
      ].forEach((field) => {
        const value = (processedData as any)[field];
        if (value && !(value instanceof Date)) {
          (processedData as any)[field] = new Date(value);
        } else if (!value) {
          (processedData as any)[field] = new Date();
        }
      });

      const dataToSubmit = {
        ...processedData,
        membrosDaEquipa: selectedMembros.map((membro) => ({
          objetivoMetaId: formData.id || '',
          membroEquipaId: membro.id,
          assignedAt: new Date(),
        })),
        tabelasAccoes: selectedTabelasAccoes.map((tabelaAccao) => ({
          objetivoMetaId: formData.id || '',
          tabelaAccaoId: tabelaAccao.id,
          assignedAt: new Date(),
        })),
      };

      console.log('Submitting form data:', dataToSubmit);

      const result = formData.id
        ? await update(formData.id, dataToSubmit as RegistoObjetivos)
        : await create(dataToSubmit as RegistoObjetivos);
      onSuccess?.(result);
    } catch (err) {
      console.error('Error submitting form:', err);
      // Error is handled by the hook
    }
  };

  const handleChange = (field: keyof RegistoObjetivos, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handlers for Membros da Equipa
  const handleAddMembro = (membroId: string) => {
    const membro = membrosEquipaData.find((m) => m.id === membroId);
    if (membro && !selectedMembros.some((m) => m.id === membroId)) {
      setSelectedMembros((prev) => [...prev, membro]);
    }
  };

  const handleCreateMembro = async (newMembro: Omit<MembroEquipa, 'id'>) => {
    const createdMembro = await createMembro(newMembro);
    if (createdMembro) {
      setSelectedMembros((prev) => [...prev, createdMembro]);
    }
  };

  // Handlers for Tabelas Accoes
  const handleAddTabelaAccao = (tabelaAccaoId: string) => {
    const tabelaAccao = tabelasAccoesData.find((t) => t.id === tabelaAccaoId);
    if (
      tabelaAccao &&
      !selectedTabelasAccoes.some((t) => t.id === tabelaAccaoId)
    ) {
      setSelectedTabelasAccoes((prev) => [...prev, tabelaAccao]);
    }
  };

  const handleCreateTabelaAccao = async (
    newTabelaAccao: Omit<TabelaAccao, 'id'>
  ) => {
    const createdTabelaAccao = await createTabelaAccao(newTabelaAccao);
    if (createdTabelaAccao) {
      setSelectedTabelasAccoes((prev) => [...prev, createdTabelaAccao]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-8'>
      {error && (
        <div className='bg-red-50 text-red-500 p-4 rounded-md'>{error}</div>
      )}

      <FormSection title='Informações Básicas'>
        <FormRow>
          <FormField label='Número de Referência O&M' required>
            <Input
              value={formData.numeroRefOAndM}
              onChange={(e) => handleChange('numeroRefOAndM', e.target.value)}
              required
            />
          </FormField>

          <FormField label='Aspeto Ref. Número' required>
            <Input
              value={formData.aspetoRefNumero}
              onChange={(e) => handleChange('aspetoRefNumero', e.target.value)}
              required
            />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label='Centro de Custos' required>
            <Input
              value={formData.centroCustos}
              onChange={(e) => handleChange('centroCustos', e.target.value)}
              required
            />
          </FormField>

          <FormField label='Público Alvo' required>
            <Input
              value={formData.publicoAlvo}
              onChange={(e) => handleChange('publicoAlvo', e.target.value)}
              required
            />
          </FormField>
        </FormRow>

        <FormField label='Objetivo' required>
          <Textarea
            value={formData.objectivo}
            onChange={(e) => handleChange('objectivo', e.target.value)}
            required
          />
        </FormField>
      </FormSection>

      <FormSection title='Recursos e Documentação'>
        <FormRow>
          <FormField label='Orçamento e Recursos' required>
            <Input
              value={formData.orcamentoRecursos}
              onChange={(e) =>
                handleChange('orcamentoRecursos', e.target.value)
              }
              required
            />
          </FormField>

          <FormField label='Ref. Documento Comprovativo' required>
            <Input
              value={formData.refDocumentoComprovativo}
              onChange={(e) =>
                handleChange('refDocumentoComprovativo', e.target.value)
              }
              required
            />
          </FormField>
        </FormRow>
      </FormSection>

      <FormSection title='Datas'>
        <FormRow>
          <FormField label='Data de Início' required>
            <Input
              type='date'
              value={formatDateForInput(formData.dataInicio)}
              onChange={(e) => {
                const date = e.target.value
                  ? new Date(e.target.value)
                  : new Date();
                handleChange('dataInicio', date);
              }}
              required
            />
          </FormField>

          <FormField label='Data de Conclusão Prevista' required>
            <Input
              type='date'
              value={formatDateForInput(formData.dataConclusaoPrevista)}
              onChange={(e) => {
                const date = e.target.value
                  ? new Date(e.target.value)
                  : new Date();
                handleChange('dataConclusaoPrevista', date);
              }}
              required
            />
          </FormField>
        </FormRow>

        <FormField label='Data de Conclusão Real' required>
          <Input
            type='date'
            value={formatDateForInput(formData.dataConclusaoReal)}
            onChange={(e) => {
              const date = e.target.value
                ? new Date(e.target.value)
                : new Date();
              handleChange('dataConclusaoReal', date);
            }}
            required
          />
        </FormField>
      </FormSection>

      <FormSection title='Aprovação e Status'>
        <FormRow>
          <FormField label='PGAS Aprovado Por' required>
            <Input
              value={formData.pgasAprovadoPor}
              onChange={(e) => handleChange('pgasAprovadoPor', e.target.value)}
              required
            />
          </FormField>

          <FormField label='Data de Aprovação' required>
            <Input
              type='date'
              value={formatDateForInput(formData.dataAprovacao)}
              onChange={(e) => {
                const date = e.target.value
                  ? new Date(e.target.value)
                  : new Date();
                handleChange('dataAprovacao', date);
              }}
              required
            />
          </FormField>
        </FormRow>

        <FormField label='Observações'>
          <Textarea
            value={formData.observacoes}
            onChange={(e) => handleChange('observacoes', e.target.value)}
          />
        </FormField>

        <FormRow>
          <FormField label='O&M Alcançado/Fechado' required>
            <Select
              value={formData.oAndMAlcancadoFechado}
              onValueChange={(value) =>
                handleChange('oAndMAlcancadoFechado', value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Selecione' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='SIM'>Sim</SelectItem>
                <SelectItem value='NAO'>Não</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label='Assinatura do Director Geral' required>
            <Input
              value={formData.assinaturaDirectorGeral}
              onChange={(e) =>
                handleChange('assinaturaDirectorGeral', e.target.value)
              }
              required
            />
          </FormField>

          <FormField label='Data' required>
            <Input
              type='date'
              value={formatDateForInput(formData.data)}
              onChange={(e) => {
                const date = e.target.value
                  ? new Date(e.target.value)
                  : new Date();
                handleChange('data', date);
              }}
              required
            />
          </FormField>
        </FormRow>
      </FormSection>

      <FormSection title='Membros da Equipa'>
        <div className='space-y-4'>
          <div className='flex space-x-2'>
            <AddEntityDialog
              title='Selecionar Membro'
              trigger={
                <Button variant='outline' size='sm'>
                  <Plus className='h-4 w-4 mr-2' />
                  Adicionar Existente
                </Button>
              }
            >
              <div className='space-y-4'>
                <FormField label='Selecione o Membro'>
                  <Select onValueChange={handleAddMembro}>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione um membro' />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingMembros ? (
                        <SelectItem value='loading' disabled>
                          Carregando membros...
                        </SelectItem>
                      ) : (
                        membrosEquipaData
                          .filter(
                            (membro) =>
                              !selectedMembros.some((m) => m.id === membro.id)
                          )
                          .map((membro) => (
                            <SelectItem key={membro.id} value={membro.id}>
                              {membro.nome} - {membro.cargo}
                            </SelectItem>
                          ))
                      )}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </AddEntityDialog>

            <AddEntityDialog
              title='Novo Membro'
              trigger={
                <Button variant='outline' size='sm'>
                  <UserPlus className='h-4 w-4 mr-2' />
                  Criar Novo
                </Button>
              }
            >
              <AddMembroForm
                onSubmit={handleCreateMembro}
                onCancel={() => {}} // Dialog handles closing
              />
            </AddEntityDialog>
          </div>

          <EntityList
            items={selectedMembros}
            renderItem={(item) => (
              <div className='space-y-1'>
                <div className='font-medium'>{item.nome}</div>
                <div className='text-sm text-muted-foreground'>
                  {item.cargo} - {item.departamento}
                </div>
              </div>
            )}
            onRemove={(id) => {
              setSelectedMembros((prev) => prev.filter((m) => m.id !== id));
            }}
          />
        </div>
      </FormSection>

      <FormSection title='Tabela de Ações'>
        <div className='space-y-4'>
          <div className='flex space-x-2'>
            <AddEntityDialog
              title='Selecionar Ação'
              trigger={
                <Button variant='outline' size='sm'>
                  <Plus className='h-4 w-4 mr-2' />
                  Adicionar Existente
                </Button>
              }
            >
              <div className='space-y-4'>
                <FormField label='Selecione a Ação'>
                  <Select onValueChange={handleAddTabelaAccao}>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione uma ação' />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingTabelasAccoes ? (
                        <SelectItem value='loading' disabled>
                          Carregando ações...
                        </SelectItem>
                      ) : (
                        tabelasAccoesData
                          .filter(
                            (tabelaAccao) =>
                              !selectedTabelasAccoes.some(
                                (t) => t.id === tabelaAccao.id
                              )
                          )
                          .map((tabelaAccao) => (
                            <SelectItem
                              key={tabelaAccao.id}
                              value={tabelaAccao.id}
                            >
                              {tabelaAccao.accao} -{' '}
                              {tabelaAccao.pessoaResponsavel}
                            </SelectItem>
                          ))
                      )}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </AddEntityDialog>

            <AddEntityDialog
              title='Nova Ação'
              trigger={
                <Button variant='outline' size='sm'>
                  <ClipboardList className='h-4 w-4 mr-2' />
                  Criar Nova
                </Button>
              }
            >
              <AddTabelaAccaoForm
                onSubmit={handleCreateTabelaAccao}
                onCancel={() => {}} // Dialog handles closing
              />
            </AddEntityDialog>
          </div>

          <EntityList
            items={selectedTabelasAccoes}
            renderItem={(item) => (
              <div className='space-y-1'>
                <div className='font-medium'>{item.accao}</div>
                <div className='text-sm text-muted-foreground'>
                  Responsável: {item.pessoaResponsavel}
                </div>
                <div className='text-xs text-muted-foreground flex items-center'>
                  <CalendarClock className='h-3 w-3 mr-1' />
                  Prazo:{' '}
                  {item.prazo instanceof Date
                    ? item.prazo.toLocaleDateString()
                    : 'Data inválida'}
                </div>
              </div>
            )}
            onRemove={(id) => {
              setSelectedTabelasAccoes((prev) =>
                prev.filter((t) => t.id !== id)
              );
            }}
          />
        </div>
      </FormSection>

      <FormActions onCancel={onCancel} isSubmitting={isLoading} />
    </form>
  );
}
