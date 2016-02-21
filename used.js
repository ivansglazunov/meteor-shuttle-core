Shuttle.Used = new Mongo.Collection('shuttle:used');

Shuttle.Used.attachTree();
Shuttle.Used.attachDelete();

if (Meteor.isServer) {
	History.watchInsert(Shuttle.Used);
	History.watchRemove(Shuttle.Used);
}

Shuttle.Used.deny({
	insert: function(userId, _use) {
		var use = Shuttle.Used._transform(_use);
		var source = use.source();
		if (userId) {
			var user = Meteor.users.find
	
			if (!Shuttle.Used.find(lodash.merge(source.Ref('_source'))).count())
				return false;
	
			if (Shuttle.can(Shuttle.Owning, source, user))
				return false;
		}
		return true;
	},
	delete: function(userId, _use) {
		var use = Shuttle.Used._transform(_use);
		if (userId) {
			var user = Meteor.users.findOne(userId);
			var source = use.source();
	
			if (!Shuttle.can(Shuttle.Owning, source, user)) {
				throw new Meteor.Error('You can not owning use link '+JSON.stringify(use.Ref()));
			}
			
			if (!Shuttle.Used.find(lodash.merge(source.Ref('_source'), { _id: { $ne: use._id } })).count()) { // Not last owning link.
				throw new Meteor.Error('You can not delete last use link '+JSON.stringify(use.Ref()));
			}

			return false;
		}
		return true;
	},
	undelete: function(userId, _use) {
		var use = Shuttle.Used._transform(_use);
		if (userId) {
			var user = Meteor.users.findOne(userId);
			var source = use.source();
	
			if (!Shuttle.can(Shuttle.Owning, source, user)) {
				throw new Meteor.Error('You can not owning use link '+JSON.stringify(use.Ref()));
			}

			return false;
		}
		return true;
	},
	remove: function(userId, _use) {
		return true;
	}
});