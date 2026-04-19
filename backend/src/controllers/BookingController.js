export class BookingController {
  constructor(bookingService) {
    this.bookingService = bookingService;
  }

  create = async (request, response) => {
    const booking = await this.bookingService.createBooking({
      userId: request.user.id,
      ...request.validated.body
    });

    response.status(201).json({ booking: booking.toJSON() });
  };

  listMine = async (request, response) => {
    const bookings = await this.bookingService.getUserBookings(request.user.id);
    response.status(200).json({ bookings: bookings.map((booking) => booking.toJSON()) });
  };

  cancel = async (request, response) => {
    const booking = await this.bookingService.cancelBooking(request.validated.params.id, request.user.id);
    response.status(200).json({ booking: booking.toJSON() });
  };

  listAll = async (request, response) => {
    const bookings = await this.bookingService.listAllBookings(request.validated.query);
    response.status(200).json({ bookings: bookings.map((booking) => booking.toJSON()) });
  };

  approve = async (request, response) => {
    const booking = await this.bookingService.approveBooking(request.validated.params.id);
    response.status(200).json({ booking: booking.toJSON() });
  };
}

