import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { connectedUsers, io } = request;
    const { provider_id, date } = request.body;

    const createAppointment = container.resolve(CreateAppointmentService);

    const { appointment, notification } = await createAppointment.execute({
      date,
      user_id,
      provider_id,
    });

    const ownerSocket = connectedUsers[provider_id];

    if (ownerSocket) {
      io.to(ownerSocket).emit('notification', notification.content);
    }

    return response.json(appointment);
  }
}
