Shuttle.Merged = new Mongo.Collection('shuttle:merged');

Shuttle.Merged.attachTree();
Shuttle.Merged.attachDelete();

if (Meteor.isServer) {
	History.watchInsert(Shuttle.Merged);
	History.watchRemove(Shuttle.Merged);
	Shuttle.Merged.inheritTree(Shuttle.Merged);
}

var restrict = function(userId, _merge) {
	var merge = Shuttle.Merged._transform(_merge);
	if (userId) {
		var user = Meteor.users.findOne(userId);
		
		if (Shuttle.can(Shuttle.Owning, merge.source(), user)) { // User can own source.
			if (Shuttle.can(Shuttle.Owning, merge.target(), user)) { // User can own target.
				return false; // The owner can do anything.
			} else if (Shuttle.can(Shuttle.Merging, merge.target(), user)) { // User can merging to target.
				return false;
			}
		} else if (Shuttle.can(Shuttle.Owning, merge.target(), user)) { // User can own target.
			return false; // The owner can do anything.
		}
	}
	return true;
};
Shuttle.Merged.deny({
	insert: restrict,
	update: restrict,
	delete: restrict,
	undelete: restrict,
	remove: function(userId, _merge) {
		return true;
	}
});