const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const paginateResults = (page = 1, limit = 10) => {
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;
  return { pageNum, limitNum, skip };
};

const buildPaginationResponse = (total, page, limit) => ({
  total,
  page: parseInt(page),
  limit: parseInt(limit),
  totalPages: Math.ceil(total / limit),
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) newObj[key] = obj[key];
  });
  return newObj;
};

module.exports = { generateOTP, paginateResults, buildPaginationResponse, filterObj };
