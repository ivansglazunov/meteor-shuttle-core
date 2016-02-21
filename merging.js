Shuttle.Merging = new Mongo.Collection('shuttle:merging');

Shuttle.Merging.attachTree();
Shuttle.Merging.attachDelete();

if (Meteor.isServer) {
	History.watchInsert(Shuttle.Merging);
	History.watchRemove(Shuttle.Merging);
}

var restrict = function(userId, _merging) {
	var merging = Shuttle.Merging._transform(_merging);
	if (userId) {
		var user = Meteor.users.findOne(userId);

		if (Shuttle.can(Shuttle.Owning, merging.target(), user)) { // User can own target.
			return false; // The owner can do anything.
		}
	}
	return true;
};
Shuttle.Merging.deny({
	insert: restrict,
	update: restrict,
	delete: restrict,
	undelete: restrict,
	remove: function(userId, _merging) {
		return true;
	}
});