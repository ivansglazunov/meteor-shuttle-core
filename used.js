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
		throw new Meteor.Error('You can not insert use links for '+JSON.stringify(source.Ref()));
	},
	update: function(userId, _use) {
		var use = Shuttle.Used._transform(_use);
		if (userId) {
			var user = Meteor.users.findOne(userId);
			var source = use.source();
	
			if (!Shuttle.can(Shuttle.Owning, source, user)) {
				throw new Meteor.Error('You can not owning use link '+JSON.stringify(use.Ref()));
			}
			
			if (lodash.includes(fieldNames, '_deleted') && !Shuttle.Used.find(lodash.merge(source.Ref('_source'), { _id: { $ne: use._id } })).count()) { // Not last owning link.
				throw new Meteor.Error('You can not delete last use link '+JSON.stringify(use.Ref()));
			}

			return false;
		}
		throw new Meteor.Error('You can not remove use link for '+JSON.stringify(use.Ref()));
	},
	remove: function(userId, _use) {
		return true;
	}
});