const pool = require("../config/db");

const parseList = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
};

const parseObject = (value) => {
  if (!value) return {};

  if (typeof value === "object" && !Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? parsed
        : {};
    } catch {
      return {};
    }
  }

  return {};
};

const serializeList = (value) => JSON.stringify(parseList(value));
const serializeObject = (value) => JSON.stringify(parseObject(value));

const mapProfile = (row) => ({
  id: row.id,
  userId: row.user_id,
  companyName: row.company_name,
  tagline: row.tagline || "",
  about: row.about || "",
  servicesOffered: parseList(row.services_offered),
  specializations: parseList(row.specializations),
  industriesServed: parseList(row.industries_served),
  serviceLocations: row.service_locations || "",
  businessEmail: row.business_email || "",
  mobileNumber: row.mobile_number || "",
  website: row.website || "",
  addressLine1: row.address_line1 || "",
  brandHashtags: parseList(row.brand_hashtags),
  socialProfiles: parseObject(row.social_profiles),
  logoUrl: row.logo_url || "",
  latitude: row.latitude,
  longitude: row.longitude,
  locationName: row.location_name || "",
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const normalizeProfile = (data, file) => {
  const profile = {
    companyName: data.companyName?.trim(),
    tagline: data.tagline?.trim() || "",
    about: data.about?.trim(),
    servicesOffered: serializeList(data.servicesOffered),
    specializations: serializeList(data.specializations),
    industriesServed: serializeList(data.industriesServed),
    serviceLocations: data.serviceLocations?.trim() || "",
    businessEmail: data.businessEmail?.trim().toLowerCase(),
    mobileNumber: data.mobileNumber?.trim(),
    website: data.website?.trim() || "",
    addressLine1: data.addressLine1?.trim(),
    brandHashtags: serializeList(data.brandHashtags),
    socialProfiles: serializeObject(data.socialProfiles),
    logoUrl: file ? `/uploads/profiles/${file.filename}` : null,
    latitude: data.latitude || null,
    longitude: data.longitude || null,
    locationName: data.locationName?.trim() || "",
  };

  if (
    !profile.companyName ||
    !profile.about ||
    !profile.businessEmail ||
    !profile.mobileNumber ||
    !profile.addressLine1
  ) {
    return {
      error: "Company name, about, business email, mobile number, and address are required",
    };
  }

  return { profile };
};

exports.getMyProfile = async (userId) => {
  const [rows] = await pool.query(
    "SELECT * FROM profiles WHERE user_id = ? LIMIT 1",
    [userId]
  );

  if (!rows.length) {
    return {
      status: 404,
      message: "Profile not found",
      profile: null,
    };
  }

  return {
    status: 200,
    profile: mapProfile(rows[0]),
  };
};

exports.upsertMyProfile = async (userId, data, file) => {
  const { profile, error } = normalizeProfile(data, file);

  if (error) {
    return {
      status: 400,
      message: error,
    };
  }

  const [existing] = await pool.query(
    "SELECT id, logo_url FROM profiles WHERE user_id = ? LIMIT 1",
    [userId]
  );

  const logoUrl =
    profile.logoUrl || existing[0]?.logo_url || null;

  if (existing.length) {
    await pool.query(
      `UPDATE profiles
       SET company_name=?,
           tagline=?,
           about=?,
           services_offered=?,
           specializations=?,
           industries_served=?,
           service_locations=?,
           business_email=?,
           mobile_number=?,
           website=?,
           address_line1=?,
           brand_hashtags=?,
           social_profiles=?,
           logo_url=?,
           latitude=?,
           longitude=?,
           location_name=?
       WHERE user_id=?`,
      [
        profile.companyName,
        profile.tagline,
        profile.about,
        profile.servicesOffered,
        profile.specializations,
        profile.industriesServed,
        profile.serviceLocations,
        profile.businessEmail,
        profile.mobileNumber,
        profile.website,
        profile.addressLine1,
        profile.brandHashtags,
        profile.socialProfiles,
        logoUrl,
        profile.latitude,
        profile.longitude,
        profile.locationName,
        userId,
      ]
    );
  } else {
    await pool.query(
      `INSERT INTO profiles
       (user_id, company_name, tagline, about, services_offered, specializations,
        industries_served, service_locations, business_email, mobile_number,
        website, address_line1, brand_hashtags, social_profiles, logo_url,
        latitude, longitude, location_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        profile.companyName,
        profile.tagline,
        profile.about,
        profile.servicesOffered,
        profile.specializations,
        profile.industriesServed,
        profile.serviceLocations,
        profile.businessEmail,
        profile.mobileNumber,
        profile.website,
        profile.addressLine1,
        profile.brandHashtags,
        profile.socialProfiles,
        logoUrl,
        profile.latitude,
        profile.longitude,
        profile.locationName,
      ]
    );
  }

  return exports.getMyProfile(userId);
};
