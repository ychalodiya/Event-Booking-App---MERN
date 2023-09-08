const eventModel = require('../../models/event');
const userModel = require('../../models/user');

const { transformEvent } = require('./merge');

module.exports = {
	events: async () => {
		try {
			const events = await eventModel.find();
			return events.map((event) => {
				return transformEvent(event);
			});
		} catch (err) {
			console.log(err);
			throw err;
		}
	},

	createEvent: (args, req) => {
		if (!req.isAuth) {
			throw new Error('Unauthenticated');
		}
		const event = new eventModel({
			title: args.inputEvent.title,
			description: args.inputEvent.description,
			price: +args.inputEvent.price,
			date: new Date(args.inputEvent.date),
			creator: req.userId,
		});
		let createdEvent;
		return event
			.save()
			.then((result) => {
				createdEvent = transformEvent(result);
				return userModel.findById(req.userId);
			})
			.then((user) => {
				if (!user) {
					throw new Error('User not found.');
				}
				user.createdEvents.push(event);
				return user.save();
			})
			.then((result) => {
				return createdEvent;
			})
			.catch((err) => {
				console.log(err);
				throw err;
			});
	},
};
