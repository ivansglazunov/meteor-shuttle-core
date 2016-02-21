Shuttle = {};

// Shuttle.defaultUser(tree, object) => ?User
Shuttle.defaultUser = undefined;

// Shuttle.right(tree, object, user) => Cursor
Shuttle.right = function(tree, object, user) {
	if (!user) {
		var user = Meteor.user();
		if (user) var user = user;
		else if (Shuttle.defaultUser) var user = Shuttle.defaultUser(tree, object);
		else user = Meteor.users.findOne('guest');
	}
	if (!user) {
		var user = Meteor.users._transform({ _id: 'guest' });
	}
	var merged = Shuttle.Merged.find(user.Ref('_source')).fetch();
	var $or = [user.Ref('_target')];
	for (var s in merged) {
		$or.push(merged[s].target().Ref('_target'));
	}
	var query = object.Ref('_source');
	query['$or'] = $or;
	return tree.find(query);
};

// Shuttle.can((tree:Mongo.Collection)|(action:String), object, user) => Boolean
Shuttle.can = function(tree, object, user) {
	if (!user) {
		var user = Meteor.user();
		if (user) var user = user;
		else if (Shuttle.defaultUser) var user = Shuttle.defaultUser(tree, object);
		else user = Meteor.users.findOne('guest');
	}
	if (!user) {
		var user = Meteor.users._transform({ _id: 'guest' });
	}
	if (!object) return false;
	if (tree instanceof Mongo.Collection) return !!Shuttle.right(tree, object, user).count();
	else if (typeof(tree) == 'string') {
		return Mongo.Collection.get(object.Ref().collection).checkRestrictions(tree, user._id, object);
	}
};