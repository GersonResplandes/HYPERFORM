import { IPhysicalProgressRepository } from '../../repositories/IPhysicalProgressRepository';
import { format } from 'date-fns';

export class ListStudentPhysicalProgressChartUseCase {
  constructor(private repo: IPhysicalProgressRepository) {}

  async execute(aluno_id: string) {
    const avals = await this.repo.findByStudentId(aluno_id);
    const labels = avals.map((a) => format(a.data_avaliacao, 'MMM'));
    const series: any = {
      peso: avals.map((a) => a.peso),
      gordura: avals.map((a) => a.gordura),
      imc: avals.map((a) => a.imc),
      massa_magra: avals.map((a) => a.massa_magra),
    };
    return { labels, series };
  }
}
