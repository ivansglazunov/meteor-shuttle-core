Shuttle.Used = new Mongo.Collection('shuttle:used');

Shuttle.Used.attachTree();
if (Meteor.isServer) {
	History.watchInsert(Shuttle.Used);
	History.watchRemove(Shuttle.Used);
	Shuttle.Used.attachDelete();
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
	remove: function(userId, _use) {
		var use = Shuttle.Used._transform(_use);
		if (userId) {
			var user = Meteor.users.findOne(userId);
			var source = use.source();
	
			if (!Shuttle.can(Shuttle.Owning, source, user))
				throw new Meteor.Error('You can not owning use link '+JSON.stringify(use.Ref()));
	
			if (Shuttle.Used.find(lodash.merge(source.Ref('_source'))).count() <= 1)
				throw new Meteor.Error('You can not remove last use link '+JSON.stringify(use.Ref()));

			return false;
		}
		throw new Meteor.Error('You can not remove use link for '+JSON.stringify(use.Ref()));
	}
});