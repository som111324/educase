const express = require('express');
const router = express.Router();
const School = require("../models/school-model");

router.post('/addSchool', async (req, res) => {
    const { name, address, latitude, longitude } = req.body;
  
    // Input validation
    if (!name || !address || latitude == null || longitude == null) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    try {
      const newSchool = new School({ name, address, latitude, longitude });
      await newSchool.save();
      res.status(201).json({ message: 'School added successfully' });
    } catch (error) {
      console.error('Error saving school:', error.message);
      res.status(500).json({ error: 'Server error' });
    }
  });


  router.get('/listSchools', async (req, res) => {
    const { userLatitude, userLongitude } = req.query;
  
    if (userLatitude == null || userLongitude == null) {
      return res.status(400).json({ error: 'User latitude and longitude are required' });
    }
  
    try {
      const schools = await School.find();
  
      // Calculate distance and sort
      const schoolsWithDistance = schools.map(school => {
        const distance = calculateDistance(
          parseFloat(userLatitude),
          parseFloat(userLongitude),
          school.latitude,
          school.longitude
        );
        return { ...school._doc, distance };
      });
  
      schoolsWithDistance.sort((a, b) => a.distance - b.distance);
  
      res.json(schoolsWithDistance);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // Helper function to calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
  
    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };
  
  module.exports = router;