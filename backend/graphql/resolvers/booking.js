const bookingModel = require('../../models/booking');
const eventModel = require('../../models/event');
const { transformBooking, transformEvent } = require('./merge');

module.exports = {
	bookings: (args, req) => {
		if (!req.isAuth) {
			throw new Error('Unauthenticated');
		}
		return bookingModel
			.find({ user: req.userId })
			.then((bookings) => {
				return bookings.map((booking) => {
					return transformBooking(booking);
				});
			})
			.catch((err) => {
				console.log(err);
				throw err;
			});
	},

	bookEvent: async (args, req) => {
		if (!req.isAuth) {
			throw new Error('Unauthenticated');
		}
		const fetchedEvent = await eventModel.findOne({ _id: args.eventId });
		const booking = new bookingModel({
			user: req.userId,
			event: fetchedEvent,
		});

		const result = await booking.save();
		return transformBooking(result);
	},

	cancelBooking: async (args, req) => {
		if (!req.isAuth) {
			throw new Error('Unauthenticated');
		}

		try {
			const bookedEvent = await bookingModel
				.findById(args.bookingId)
				.populate('event');
			const event = transformEvent(bookedEvent.event);
			await bookingModel.deleteOne({ _id: args.bookingId });
			return event;
		} catch (err) {
			throw err;
		}
	},
};
