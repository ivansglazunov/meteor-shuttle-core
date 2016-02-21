Shuttle.Merging = new Mongo.Collection('shuttle:merging');

Shuttle.Merging.attachTree();
Shuttle.Merging.attachDelete();

if (Meteor.isServer) {
	History.watchInsert(Shuttle.Merging);
	History.watchRemove(Shuttle.Merging);
}

Shuttle.Merging.deny({
	insert: function(userId, _merging) {
		var merging = Shuttle.Merging._transform(_merging);
		if (userId) {
			var user = Meteor.users.findOne(userId);
	
			if (Shuttle.can(Shuttle.Owning, merging.target(), user)) { // User can own target.
				return false; // The owner can do anything.
			}
		}
		throw new Meteor.Error('You are not permitted to insert merging for '+JSON.stringify(merging._target));
	},
	update: function(userId, _merging) {
		var merging = Shuttle.Merging._transform(_merging);
		if (userId) {
			var user = Meteor.users.findOne(userId);
	
			if (Shuttle.can(Shuttle.Owning, merging.target(), user)) { // User can own target.
				return false; // The owner can do anything.
			}
		}
		throw new Meteor.Error('You are not permitted to update merging for '+JSON.stringify(merging._target));
	},
	remove: function(userId, _merging) {
		return true;
	}
});