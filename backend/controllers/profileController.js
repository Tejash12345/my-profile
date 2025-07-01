import Profile from '../models/Profile.js';

// GET /profile
export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// POST /profile (create or update)
export const upsertProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (profile) {
      Object.assign(profile, req.body);
      await profile.save();
    } else {
      profile = await Profile.create(req.body);
    }
    res.status(200).json(profile);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update profile' });
  }
}; 