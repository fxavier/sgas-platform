export interface RelatorioIncidente {
  id?: string;
  dataIncidente: Date;
  horaIncident: Date;
  descricaoDoIncidente: string;
  detalhesLesao: string;
  accoesImediatasTomadas: string;
  tipoFuncionario: 'CONTRATADO' | 'INCIDENTE_DE_TERCEIROS';
  categoriaPessoaEnvolvida: string;
  formaActividade: 'CONTROLADA' | 'NAO_CONTROLADA' | 'MONITORADA';
  foiRealizadaAvaliacaoRisco: 'SIM' | 'NAO';
  existePadraoControleRisco: 'SIM' | 'NAO';
  tipoConsequenciaIncidenteReal?: string;
  tipoConsequenciaIncidentePotencial?: string;
  efeitosIncidenteReal: 'SAUDE' | 'SEGURANCA' | 'AMBIENTE' | 'COMUNIDADE';
  classificacaoGravidadeIncidenteReal?: string;
  efeitosIncidentePotencial?: 'SAUDE' | 'SEGURANCA' | 'AMBIENTE' | 'COMUNIDADE';
  classificacaoGravidadeIncidentePotencial?: string;
  esteFoiIncidenteSemBarreira: 'SIM' | 'NAO';
  foiIncidenteRepetitivo: 'SIM' | 'NAO';
  foiIncidenteResultanteFalhaProcesso: 'SIM' | 'NAO';
  danosMateriais: 'SIM' | 'NAO';
  valorDanos?: number;
  statusInvestigacao?: string;
  dataInvestigacaoCompleta?: Date;
  ausenciaOuFalhaDefesas?: 'SIM' | 'NAO';
  descricaoAusenciaOuFalhaDefesas?: string;
  accoesIndividuaisOuEquipe?: string;
  descricaoAccaoIndividualOuEquipe?: string;
  tarefaOuCondicoesAmbientaisLocalTrabalho?: string;
  descricaoTarefaOuCondicoesAmbientaisLocalTrabalho?: string;
  tarefaOuCondicoesAmbientaisHumano?: string;
  descricaoTarefaOuCondicoesAmbientaisHumano?: string;
  factoresOrganizacionais?: string;
  descricaoFactoresOrganizacionais?: string;
  causasSubjacentesEPrincipaisFactoresContribuintes?: string;
  descricaoIncidenteAposInvestigacao?: string;
  principaisLicoes?: string;
  resgistoRiscoActivosActualizadosAposInvestigacao?: 'SIM' | 'NAO';
  voceCompartilhouAprendizadoDesteEventoComRestanteOrganizacao?: 'SIM' | 'NAO';
  comoPartilhou?: string;
  superiorHierarquicoResponsavel?: string;
  telefoneSuperiorHierarquicoResponsavel?: string;
  tituloSuperiorHierarquicoResponsavel?: string;
  emailSuperiorHierarquicoResponsavel?: string;
  tenantId: string;
  projectId: string;
}

export interface RegistoObjetivos {
  id?: string;
  numeroRefOAndM: string;
  aspetoRefNumero: string;
  centroCustos: string;
  objectivo: string;
  publicoAlvo: string;
  orcamentoRecursos: string;
  refDocumentoComprovativo: string;
  dataInicio: Date;
  dataConclusaoPrevista: Date;
  dataConclusaoReal: Date;
  pgasAprovadoPor: string;
  dataAprovacao: Date;
  observacoes: string;
  oAndMAlcancadoFechado: 'SIM' | 'NAO';
  assinaturaDirectorGeral: string;
  data: Date;
  tenantId: string;
  projectId: string;
  membrosDaEquipa?: Array<{
    objetivoMetaId: string;
    membroEquipaId: string;
    assignedAt: Date;
  }>;
  tabelasAccoes?: Array<{
    objetivoMetaId: string;
    tabelaAccaoId: string;
    assignedAt: Date;
  }>;
}

export interface RelatorioInicialIncidente {
  id?: string;
  tipoIncidente:
    | 'FATALIDADE'
    | 'OCORRENCIA_PERIGOSA'
    | 'INCIDENTE_QUASE_ACIDENTE'
    | 'TEMPO_PERDIDO'
    | 'INCIDENTE_AMBIENTAL'
    | 'SEGURANCA'
    | 'RECLAMACAO_EXTERNA'
    | 'NOTIFICACAO_DO_REGULADOR_VIOLACAO'
    | 'DERAMAMENTO_LBERACAO_DESCONTROLADA'
    | 'DANOS_PERDAS'
    | 'FLORA_FAUNA'
    | 'AUDITORIA_NAO_CONFORMIDADE';
  dataIncidente: Date;
  horaIncidente: Date;
  seccao?: string;
  localIncidente: string;
  dataComunicacao: Date;
  supervisor: string;
  empregado?: 'SIM' | 'NAO';
  nomeFuncionario?: string;
  subcontratante?: 'SIM' | 'NAO';
  nomeSubcontratado?: string;
  descricaoCircunstanciaIncidente: string;
  infoSobreFeriodosETratamentoFeito: string;
  declaracaoDeTestemunhas?: string;
  conclusaoPreliminar?: string;
  recomendacoes: string;
  inclusaoEmMateriaSeguranca?: string;
  prazo?: Date;
  necessitaDeInvestigacaoAprofundada: 'SIM' | 'NAO';
  incidenteReportavel: 'SIM' | 'NAO';
  credoresObrigadosASeremNotificados: 'SIM' | 'NAO';
  autorDoRelatorio?: string;
  dataCriacao: Date;
  nomeProvedor: string;
  data: Date;
  tenantId: string;
  projectId: string;
  incidentes?: Array<{
    relatorioInicialId: string;
    incidenteId: string;
    assignedAt: Date;
  }>;
}

export interface MembroEquipa {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
}

export interface TabelaAccao {
  id: string;
  accao: string;
  pessoaResponsavel: string;
  prazo: Date;
  dataConclusao: Date;
}
