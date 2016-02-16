Shuttle.Owning = new Mongo.Collection('shuttle:owning');

Shuttle.Owning.attachRefs();
Shuttle.Owning.attachTree();
Shuttle.Owning.attachSchema({ _inserted: { type: insertedSchema() }});

if (Meteor.isServer) Shuttle.Used.inheritTree(Shuttle.Owning);
if (Meteor.isServer) Shuttle.Unused.inheritTree(Shuttle.Owning);

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
	remove: function(userId, _owning) {
		var owning = Shuttle.Owning._transform(_owning);
		if (userId) {
			var user = Meteor.users.findOne(userId);
	
			if (Shuttle.can(Shuttle.Owning, owning.source(), user)) { // User can own target.
				if (Shuttle.Owning.find(owning.source().Ref('_source')).count() > 1) { // Not last owning link.
					return false; // a owner can do anything.
				} else {
					throw new Meteor.Error('You can not remove last for source owning link.');
				}
			}
		}
		throw new Meteor.Error('You are not permitted to remove owning '+JSON.stringify(owning.Ref()));
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