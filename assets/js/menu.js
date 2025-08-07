let menuItems = [];

// Fetch menu items from API
fetch('https://xwer1yi8u0.execute-api.eu-west-1.amazonaws.com/v1/list/items')
  .then(response => response.json())
  .then(data => {
    menuItems = data;
  })
  .catch(error => {
    console.error('Error fetching menu items:', error);
  });

export { menuItems };
