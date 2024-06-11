import { menuItems } from "./menu.js";

menuItems
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
    populateMenuItem(menuItems, "Food", "Starter", "starters")
    populateMenuItem(menuItems, "Food", "Side Dishes", "starters")
    populateMenuItem(menuItems, "Food", "Quick Bites", "starters")
    populateMenuItem(menuItems, "Food", "Rice", "mains")
    populateMenuItem(menuItems, "Food", "Swallow", "mains")
    populateMenuItem(menuItems, "Food", "Protein", "mains")
    populateMenuItem(menuItems, "Food", "Soup", "mains")
    populateMenuItem(menuItems, "Food", "Salad", "mains")
    populateMenuItem(menuItems, "Food", "Sauce/Egg", "mains")
    populateMenuItem(menuItems, "Food", "Sea Foods", "mains")
    populateMenuItem(menuItems, "Food", "Barbecue", "mains")
    populateMenuItem(menuItems, "Food", "Others", "mains")
    populateMenuItem(menuItems, "Food", "Chinese Cuisine", "continental")
    populateMenuItem(menuItems, "Food", "Pastas", "continental")
    populateMenuItem(menuItems, "Food", "Dessert", "dessert")

    populateMenuItem(menuItems, "Drinks", "Beer", "drink")
    populateMenuItem(menuItems, "Drinks", "Spirit/Liquor/Champagne Drinks", "drink")
    populateMenuItem(menuItems, "Drinks", "Red Wine", "drink")
    populateMenuItem(menuItems, "Drinks", "Vodka", "drink")
    populateMenuItem(menuItems, "Drinks", "Energy Drink", "drink")
    populateMenuItem(menuItems, "Drinks", "Soft Drinks", "drink")
    populateMenuItem(menuItems, "Drinks", "Others", "drink")
    
  }
  
};

const populateMenuItem = (menuItems, category, subCategory, parentId) =>{
  const categorySelection = menuItems.filter((element) => element.subCategory === subCategory && category === category)
  const categoryElement = document.createElement("div")
  categoryElement.setAttribute("class", "food-category");
  
  const categoryHeader = document.createElement("div")
  categoryHeader.setAttribute("class", "food-header-category");
  categoryHeader.innerHTML = `<h5>${subCategory} </h5></b> <hr></hr>`
  categoryElement.appendChild(categoryHeader)

  categorySelection.map((element) => {
    const { item, price } = element
    const elementDiv = document.createElement("div")
    elementDiv.setAttribute("class", "food-item-category");
    elementDiv.innerHTML = `${item} => <span>&#8358;</span>${Number(price).toLocaleString()}`
    categoryElement.appendChild(elementDiv)
  })
  document.getElementById(parentId).appendChild(categoryElement);
} 

function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
  }

  function openNav() {
    document.getElementById("mySidenav").style.width = "100%";
  }

  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }
