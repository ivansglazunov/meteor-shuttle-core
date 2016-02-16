Shuttle.Unused = new Mongo.Collection('shuttle:unused');

Shuttle.Unused.attachTree();
Shuttle.Unused.attachSchema({ _inserted: { type: insertedSchema() }});

// It is not for users...
Shuttle.Unused.deny({
	insert: function(userId, _unused) {
		return true;
	},
	remove: function(userId, _unused) {
		return true;
	}
});

if (Meteor.isServer) {
	// If use inserted then remove unused.
	Shuttle.Used.after.insert(function(userId, _use) {
		var use = Shuttle.Used._transform(_use);
		var unuseds = Shuttle.Unused.find(use.source().Ref('_source'));
		if (unuseds.count()) { // If unused exists
			unuseds.forEach(function(unused) {
				Shuttle.Unused.remove(unused._id);
			});
		}
	});
	// If use removed
	Shuttle.Used.after.remove(function(userId, _use) {
		var use = Shuttle.Used._transform(_use);
		var uses = Shuttle.Used.find(use.source().Ref('_source'));
		if (!uses.count()) { // If uses no exists
			Shuttle.Unused.insert({
				_source: use.source().Ref(),
				_target: userId ? Meteor.users.findOne(userId).Ref() : use.source().Ref()
			});
		}
	});

	// Create unused after insertion of the documents in collection.
	Mongo.Collection.prototype.attachUnused = function () {
		var collection = this;
		collection.after.insert(function(userId, _document) {
			var document = collection._transform(_document);
			Shuttle.Unused.insert({
				_source: document.Ref(),
				_target: userId ? Meteor.users.findOne(userId).Ref() : document.Ref()
			});
		});
	};
}