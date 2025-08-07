// Initialize menuItems as an empty array
const menuItems = [];

// Fetch menu items from API
fetch('https://xwer1yi8u0.execute-api.eu-west-1.amazonaws.com/v1/list/items')
  .then(response => response.json())
  .then(data => {
    // Update menuItems by pushing data into it
    items = data.response
    menuItems.push(...items);
    console.log('Menu items fetched successfully:', menuItems);
  })
  .catch(error => {
    console.error('Error fetching menu items:', error);
  });

// Export menuItems
export { menuItems };
