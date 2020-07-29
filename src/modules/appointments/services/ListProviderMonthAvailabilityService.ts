import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        month,
        year,
      },
    );

    const numberOfDaysInMouth = getDaysInMonth(new Date(year, month - 1));

    const eachDay = Array.from(
      { length: numberOfDaysInMouth },
      (_, index) => index + 1,
    );

    const availability = eachDay.map(day => {
      const compareDate = new Date(year, month - 1, day, 17, 0, 0);
      const todayDate = new Date(Date.now());

      const appointmentsInDay = appointments.filter(
        appointment => getDate(appointment.date) === day,
      );

      return {
        day,
        available:
          isAfter(compareDate, todayDate) && appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
