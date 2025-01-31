let user = null; // This variable will hold the logged-in user's data

const setUser = (userData) => {
  user = userData; // Set the user data
};

const getUser = () => user; // Get the user data

const clearUser = () => {
  user = null; // Clear the user data
};

module.exports = { setUser, getUser, clearUser };