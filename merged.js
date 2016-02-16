Shuttle.Merged = new Mongo.Collection('shuttle:merged');

Shuttle.Merged.attachTree();
Shuttle.Merged.attachSchema({ _inserted: { type: insertedSchema() }});

if (Meteor.isServer) Shuttle.Merged.inheritTree(Shuttle.Merged);

Shuttle.Merged.deny({
	insert: function(userId, _merge) {
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
		throw new Meteor.Error('You are not permitted to join '+JSON.stringify(merge._target));
	},
	remove: function(userId, _merge) {
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
		throw new Meteor.Error('You are not permitted to remove '+JSON.stringify(merge.Ref()));
	}
});