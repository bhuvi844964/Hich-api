export const paginationOptionsWIthPopulate = (
  page = 1,
  limit = 10,
  populate,
  sort,
  sortField
) => {
  const options = {
    page: page,
    limit: limit,
    populate,
    sort:
      sortField && sort ? { [sortField]: sort === "desc" ? -1 : 1 } : undefined,
  };
  return options;
};

// export const paginationOptions = (page = 1, limit = 10) => {
//   const options = {
//     page: page || 1,
//     limit: limit || 10,
//   };
//   return options;
// };
export const paginationOptions = (page = 1, limit = 10, sortField, sortOrder) => {
  const options = {
    page: page || 1,
    limit: limit || 10,
    sort: {},
  };

  if (sortField && sortOrder) {
    options.sort[sortField] = sortOrder;
  }

  return options;
};
