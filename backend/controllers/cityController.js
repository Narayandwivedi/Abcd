const City = require("../models/City");

// Get all cities with pagination and search (public - for frontend forms)
const getAllCities = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      district = '',
      sortBy = 'city'
    } = req.query;

    // Build query
    let query = { isActive: true };

    // Add search filter
    if (search) {
      query.city = { $regex: search, $options: 'i' };
    }

    // Add district filter
    if (district) {
      query.district = district;
    }

    // Limit validation - max 1000 to allow fetching all cities
    const parsedLimit = Math.min(parseInt(limit) || 20, 1000);
    const parsedPage = parseInt(page) || 1;

    // Calculate pagination
    const skip = (parsedPage - 1) * parsedLimit;

    // Fetch cities with pagination
    const cities = await City.find(query)
      .select('state district city')
      .sort({ [sortBy]: 1 })
      .skip(skip)
      .limit(parsedLimit)
      .lean(); // Use lean() for better performance

    // Get total count for pagination
    const total = await City.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: cities,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit),
        hasMore: skip + cities.length < total
      }
    });
  } catch (error) {
    console.error('Get all cities error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all cities with details (admin)
const getAllCitiesAdmin = async (req, res) => {
  try {
    const { sortBy = 'city', order = 'asc', search } = req.query;

    let query = {};

    // Search functionality
    if (search) {
      query = {
        $or: [
          { city: { $regex: search, $options: 'i' } },
          { district: { $regex: search, $options: 'i' } },
          { state: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const cities = await City.find(query)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .select('state district city isActive createdAt updatedAt');

    // Group by district for summary
    const summary = cities.reduce((acc, city) => {
      if (!acc[city.district]) {
        acc[city.district] = { total: 0, active: 0, inactive: 0 };
      }
      acc[city.district].total++;
      if (city.isActive) {
        acc[city.district].active++;
      } else {
        acc[city.district].inactive++;
      }
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      count: cities.length,
      districtCount: Object.keys(summary).length,
      summary,
      cities
    });
  } catch (error) {
    console.error('Get all cities admin error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get states list
const getStates = async (req, res) => {
  try {
    const states = await City.distinct('state');

    // Sort alphabetically
    states.sort();

    return res.status(200).json({
      success: true,
      count: states.length,
      states
    });
  } catch (error) {
    console.error('Get states error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get districts list
const getDistricts = async (req, res) => {
  try {
    const districts = await City.distinct('district');

    // Sort alphabetically
    districts.sort();

    return res.status(200).json({
      success: true,
      count: districts.length,
      districts
    });
  } catch (error) {
    console.error('Get districts error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get cities by state
const getCitiesByState = async (req, res) => {
  try {
    const { state } = req.params;

    const cities = await City.find({
      state,
      isActive: true
    })
    .select('city district')
    .sort({ city: 1 });

    return res.status(200).json({
      success: true,
      state,
      count: cities.length,
      cities
    });
  } catch (error) {
    console.error('Get cities by state error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get cities by district
const getCitiesByDistrict = async (req, res) => {
  try {
    const { district } = req.params;

    const cities = await City.find({
      district,
      isActive: true
    })
    .select('city')
    .sort({ city: 1 });

    const cityList = cities.map(c => c.city);

    return res.status(200).json({
      success: true,
      district,
      count: cityList.length,
      cities: cityList
    });
  } catch (error) {
    console.error('Get cities by district error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create new city (admin)
const createCity = async (req, res) => {
  try {
    const { state, district, city } = req.body;

    // Validate required fields
    if (!state || !district || !city) {
      return res.status(400).json({
        success: false,
        message: "State, district and city are required"
      });
    }

    // Check if city already exists in the district
    const existingCity = await City.findOne({
      state: state.trim(),
      district: district.trim(),
      city: city.trim()
    });

    if (existingCity) {
      return res.status(400).json({
        success: false,
        message: "City already exists in this state and district"
      });
    }

    // Create new city
    const newCity = await City.create({
      state: state.trim(),
      district: district.trim(),
      city: city.trim(),
      isActive: true
    });

    console.log(`[ADMIN] City created: ${newCity.city} in ${newCity.district}, ${newCity.state}`);

    return res.status(201).json({
      success: true,
      message: "City created successfully",
      city: newCity
    });
  } catch (error) {
    console.error('Create city error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update city (admin)
const updateCity = async (req, res) => {
  try {
    const { cityId } = req.params;
    const { state, district, city, isActive } = req.body;

    // Find city
    const existingCity = await City.findById(cityId);

    if (!existingCity) {
      return res.status(404).json({
        success: false,
        message: "City not found"
      });
    }

    // Check if new combination already exists (if changing state, district or city name)
    if (state || district || city) {
      const duplicateCity = await City.findOne({
        _id: { $ne: cityId },
        state: state ? state.trim() : existingCity.state,
        district: district ? district.trim() : existingCity.district,
        city: city ? city.trim() : existingCity.city
      });

      if (duplicateCity) {
        return res.status(400).json({
          success: false,
          message: "City with this name already exists in the state and district"
        });
      }
    }

    // Update fields
    if (state) existingCity.state = state.trim();
    if (district) existingCity.district = district.trim();
    if (city) existingCity.city = city.trim();
    if (isActive !== undefined) existingCity.isActive = isActive;

    await existingCity.save();

    console.log(`[ADMIN] City updated: ${existingCity.city} in ${existingCity.district}, ${existingCity.state}`);

    return res.status(200).json({
      success: true,
      message: "City updated successfully",
      city: existingCity
    });
  } catch (error) {
    console.error('Update city error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete city (admin)
const deleteCity = async (req, res) => {
  try {
    const { cityId } = req.params;

    const city = await City.findById(cityId);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found"
      });
    }

    await City.findByIdAndDelete(cityId);

    console.log(`[ADMIN] City deleted: ${city.city} in ${city.district}`);

    return res.status(200).json({
      success: true,
      message: "City deleted successfully"
    });
  } catch (error) {
    console.error('Delete city error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Toggle city status (admin)
const toggleCityStatus = async (req, res) => {
  try {
    const { cityId } = req.params;

    const city = await City.findById(cityId);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found"
      });
    }

    city.isActive = !city.isActive;
    await city.save();

    console.log(`[ADMIN] City status toggled: ${city.city} - ${city.isActive ? 'Active' : 'Inactive'}`);

    return res.status(200).json({
      success: true,
      message: `City ${city.isActive ? 'activated' : 'deactivated'} successfully`,
      city
    });
  } catch (error) {
    console.error('Toggle city status error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllCities,
  getAllCitiesAdmin,
  getStates,
  getDistricts,
  getCitiesByState,
  getCitiesByDistrict,
  createCity,
  updateCity,
  deleteCity,
  toggleCityStatus
};
