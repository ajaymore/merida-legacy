var mongoose = require('mongoose');
var bCrypt = require('bcrypt');
var Group = require('./group.model');

let UserSchema = new mongoose.Schema({
  email: { type: String, lowercase: true, required: true },
  password: { type: String },
  name: { type: String },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  blocked: { type: Boolean },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() }
});

UserSchema.statics.generateHash = function(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

UserSchema.statics.validPassword = function(user, password) {
  return bCrypt.compareSync(password, user.password);
};

UserSchema.post('remove', async function(doc, next) {
  await doc.groups.forEach(async function(group) {
    await Group.findByIdAndUpdate(group, {
      $pullAll: {
        users: [doc._id]
      }
    });
  });

  next(null, doc);
});

UserSchema.post('save', async function(doc, next) {
  await doc.groups.forEach(async function(group) {
    await Group.findByIdAndUpdate(
      group,
      {
        $addToSet: {
          users: doc._id
        }
      },
      {
        safe: true,
        upsert: true,
        new: true
      }
    );
  });
  next(null, doc);
});

module.exports = mongoose.model('User', UserSchema);
