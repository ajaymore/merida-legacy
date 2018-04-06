var User = require('./models/user.model');
var Group = require('./models/group.model');

module.exports = async function() {
  const admin = await User.findOne({
    email: process.env.ADMIN_USER
  });

  if (!admin) {
    await User.remove({});
    await Group.remove({});

    let adminGroup = new Group();
    adminGroup.name = 'admins';
    adminGroup.createdAt = new Date();
    adminGroup.updatedAt = new Date();
    adminGroup.users = [];
    await adminGroup.save();

    let newAdmin = new User();
    newAdmin.email = process.env.ADMIN_USER;
    newAdmin.name = 'Admin';
    newAdmin.password = User.generateHash('merida@1234');
    newAdmin.groups = [adminGroup._id];
    newAdmin.blocked = false;
    newAdmin.createdAt = new Date();
    newAdmin.updatedAt = new Date();
    await newAdmin.save();

    await Group.findOneAndUpdate(
      { _id: adminGroup._id },
      {
        $addToSet: {
          users: newAdmin._id
        }
      }
    );

    console.log('Seed complete!!');
  }
};
