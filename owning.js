Shuttle.Owning = new Mongo.Collection('shuttle:owning');

Shuttle.Owning.attachTree();
Shuttle.Owning.attachDelete();

if (Meteor.isServer) {
	History.watchInsert(Shuttle.Owning);
	History.watchRemove(Shuttle.Owning);
	Shuttle.Used.inheritTree(Shuttle.Owning);
	Shuttle.Unused.inheritTree(Shuttle.Owning);
}

Shuttle.Owning.deny({
	insert: function(userId, _owning) {
		var owning = Shuttle.Owning._transform(_owning);
		if (userId) {
			var user = Meteor.users.findOne(userId);
	
			if (Shuttle.can(Shuttle.Owning, owning.source(), user)) { // User can own source.
				return false; // The owner can do anything.
			}
		}
		throw new Meteor.Error('You are not permitted to insert owning '+JSON.stringify(owning));
	},
	update: function(userId, _owning, fieldNames, modifier) {
		var owning = Shuttle.Owning._transform(_owning);
		if (userId) {
			var user = Meteor.users.findOne(userId);
	
			if (Shuttle.can(Shuttle.Owning, owning.source(), user)) { // User can own target.
				if (!lodash.includes(fieldNames, '_deleted') || Shuttle.Owning.find(lodash.merge(owning.source().Ref('_source'), { _id: { $ne: owning._id } })).count()) { // Not last owning link.
					return false; // a owner can do anything.
				} else {
					throw new Meteor.Error('You can not delete last for source owning link.');
				}
			}
		}
		throw new Meteor.Error('You are not permitted to update owning '+JSON.stringify(owning.Ref()));
	},
	remove: function(userId, _owning) {
		return true;
	}
});

if (Meteor.isServer) {
	Meteor.users.after.insert(function(userId, _user) {
		var user = Meteor.users._transform(_user);
		Shuttle.Owning.insert({
			_source: user.Ref(),
			_target: user.Ref()
		});
	});
}