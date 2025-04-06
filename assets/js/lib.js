import { menuItems } from "./menu.js";

window.onload = function() {

  var acc = document.getElementsByClassName("accordion");
  var i;
  
  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.opacity === "1") {
        panel.style.opacity = "0";
        panel.style.height = "0";
      } else {
        panel.style.opacity = "1";
        panel.style.height = "450px";
      }
    });
  }

  const foodContainer = document.getElementById("food-menu-container")
  if (foodContainer) {

    populateMenuItem('Food', 'Starter')
    populateMenuItem("Food", "Salad")
    populateMenuItem('Food', 'Breakfast')
    populateMenuItem("Food", "Side Dishes")
    populateMenuItem("Food", "Rice")
    populateMenuItem("Food", "Pastas")
    populateMenuItem("Food", "Swallow")
    populateMenuItem("Food", "Soup")
    populateMenuItem("Food", "Protein")
    populateMenuItem("Food", "Sauce/Egg")
    populateMenuItem("Food", "Sea Foods")
    populateMenuItem("Food", "Barbecue")
    populateMenuItem("Food", "Chinese Cuisine")
    populateMenuItem("Food", "Others")
    populateMenuItem("Food", "Dessert")

    populateMenuItem("Drinks", "Beer")
    populateMenuItem("Drinks", "Spirit/Liquor/Champagne Drinks")
    populateMenuItem("Drinks", "Red Wine")
    populateMenuItem("Drinks", "Vodka")
    populateMenuItem("Drinks", "Energy Drink")
    populateMenuItem("Drinks", "Soft Drinks")
    populateMenuItem("Drinks", "Others")
    
  }


  document.getElementById("food-search").addEventListener("input", function() {
    var searchQuery = this.value.toLowerCase();
    // Select all food items (adjust the selector if necessary)
    var foodItems = document.querySelectorAll(".food-item-category");
    foodItems.forEach(function(item) {
      // Check if the food item's text includes the search query
      if (item.textContent.toLowerCase().includes(searchQuery)) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  });
  
};

const populateMenuItem = (category, subCategory) =>{

    const categoryList = menuItems.filter(item => item.category === category)
    const categoryItems = categoryList.filter(item => item.subCategory === subCategory)

    const categoryItemDiv = document.createElement("div")
    categoryItemDiv.setAttribute("class", "food-category");
    categoryItemDiv.setAttribute("id", subCategory);

    const categoryItemHeader = document.createElement("div")
    categoryItemHeader.setAttribute("class", "food-header-category");
    categoryItemHeader.innerHTML = `<h5>${subCategory}</h5>`
    categoryItemDiv.appendChild(categoryItemHeader)

    categoryItems.sort((a,b)=> a.item.localeCompare(b.item)).map((element) => {
      const { item, price } = element
      const elementDiv = document.createElement("div")
      elementDiv.setAttribute("class", "food-item-category");
      elementDiv.innerHTML = `
        <span class="proper-case">${item}</span> - <span class="h6">&#8358;${Number(price).toLocaleString()}<span> <br> 
        <span class="text-muted h6">${element.description ?? ''}<span>`
      categoryItemDiv.appendChild(elementDiv)
    })
    document.getElementById('food-menu-container').appendChild(categoryItemDiv);
}
