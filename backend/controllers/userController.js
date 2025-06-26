const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query).select('-password');
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server error', error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const updatedFields = { name, email, role };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedFields.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, updatedFields, { new: true }).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    res.json({ success: true, msg: 'User updated', data: user });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server error', error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }
    res.json({ success: true, msg: 'User deleted', data: {} });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server error', error: err.message });
  }
};
