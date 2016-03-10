# ~~meteor-shuttle-rights~~ DEPRECATED

```
meteor add ivansglazunov:shuttle-rights
```

Basic trees of rights.

## Trees

### Merged
Stores links merge users. This makes it possible to perceive target links as a group in relation to the source. Source inherits from target all its access. This tree is inherited in itself that allows to receive 1 request all nesting.

* Holder of the right `owning` of target can create and remove and link to any source.
* Holder of the right `owning` of source and the rights `merging` of target can create and remove simila link.

![Merged](http://ivansglazunov.github.io/meteor-shuttle-rights/merged.svg)

* 6 is simultaneously a 6, 4 and 1

### Merging
Store links as rights to merge source with target. Only the owner of the target can give such a right.

* Holder of the right `owner` of target can create and remove `merging` right.

![Merging](http://ivansglazunov.github.io/meteor-shuttle-rights/merging.svg)

* 4 had merge right with 1
* 3 and 5 can independently merge with 1
* 3 already merged with 1

### Unused
The tree to which are attached all the documents that have not been used by anyone. These documents can be regarded as corrupt and remove them if after some time not be connected to the tree `used`.

Users can not control this tree. At the time of creating a document on a server, it can be added to the tree `unused`. After connecting the document to the `used` tree, it detached from the `unused` tree.

The rest has the same properties that used.

![Unused](http://ivansglazunov.github.io/meteor-shuttle-rights/unused.svg)

1. 1 is user
2. user 1 inserted document 2
3. server will automatically add it to the tree `unused`
4. user 1 add document 2 to the tree `used`
5. server will automatically remove it from the tree `unused`
6. user 1 remove document 2 from the tree `used`
7. server will automatically add it to the tree `unused`

To automatically add document after inserting to tree `unused`, call:
```js
Shuttle.Unused.watch(collection);
```

### Used
Tree of nesting to transfer ownership rights as `owning`.
The user must manually connect his document to this tree or else, with time, it will be cleared as the unused.

* Holder of the right `owning` to source can create and remove and link to any target.
* The first connection to the source can make any user without `owning` right to source.
* Last link can not be removed.

![Used](http://ivansglazunov.github.io/meteor-shuttle-rights/used.svg)

* 2 and 3 used by 1
* 4 and 5 used by 1 and 3
* 6 used by 5, 4, 3 and 1

### Owning
Tree of inherited the tree `used`. It symbolizes the complete unconditional rights to the document. Target - it is link to subject of right.

* Holder of the right `owning` to source can create and remove any link.
* Last link can not be removed.

![Owning](http://ivansglazunov.github.io/meteor-shuttle-rights/owning.svg)

* The `owning` right given to 1 is automatically inherited to 2, 3, 4 and 5

## `Shuttle.right(tree: Mongo.Collection, object?: Document, user? User) => Cursor`
Look for for the rights of the user in the tree in relation to the object. If the user is not transmitted, call `Shuttle.defaultUser(tree: Mongo.Collection, object?: Document) => ?User` to get default user. If not getted - looking for user with id "guest". If not found it perceives temporary object { _id: "guest" } as a user. Returns cursor contains or does not contain the appropriate rights.

> Define your version of `Shuttle.defaultUser(tree: Mongo.Collection, object?: Document) => ?User` if you need.

## `Shuttle.can(tree: Mongo.Collection, object?: Document, user? User) => Boolean`
The short version of the method `.right`.

## Versions

### 0.0.6
* Support `ivansglazunov:restrict` with `delete` and `undelete` restrictions

### 0.0.5
* Deny remove for all, only delete allowed

### 0.0.4
* Support `ivansglazunov:history`
* Support `ivansglazunov:delete`

### 0.0.3
* Remove `ivansglazunov:inserted`
* Add `ivansglazunov:history`

### 0.0.2
* Fix `stevezhu:lodash@4.3.0`

### 0.0.1
* Added `watch` to readme.