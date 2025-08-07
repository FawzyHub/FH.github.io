// Function to fetch menu items from API
async function getMenuItems() {
  try {
    const response = await fetch('https://xwer1yi8u0.execute-api.eu-west-1.amazonaws.com/v1/list/items');
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
}

// Export the function
export { getMenuItems };
