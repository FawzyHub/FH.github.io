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
    populateMenuItem(menuItems, "Starter", "starters")
    populateMenuItem(menuItems, "Side Dishes", "starters")
    populateMenuItem(menuItems, "Quick Bites", "starters")
  
    populateMenuItem(menuItems, "Rice", "mains")
    populateMenuItem(menuItems, "Swallow", "mains")
    populateMenuItem(menuItems, "Protein", "mains")
    populateMenuItem(menuItems, "Soup", "mains")
    populateMenuItem(menuItems, "Salad", "mains")
    populateMenuItem(menuItems, "Sauce/Egg", "mains")
    populateMenuItem(menuItems, "Sea Foods", "mains")
    populateMenuItem(menuItems, "Barbecue", "mains")
    
    populateMenuItem(menuItems, "Chinese Cuisine", "continental")
    populateMenuItem(menuItems, "Pastas", "continental")

    populateMenuItem(menuItems, "Beer", "drink")
    populateMenuItem(menuItems, "Spirit/Liquor/Champagne Drinks", "drink")
    populateMenuItem(menuItems, "Red Wine", "drink")
    populateMenuItem(menuItems, "Vodka", "drink")
    populateMenuItem(menuItems, "Energy Drink", "drink")
    populateMenuItem(menuItems, "Soft Drinks", "drink")
    populateMenuItem(menuItems, "Others", "drink")
    
    populateMenuItem(menuItems, "Dessert", "dessert")
  }
  
};

const populateMenuItem = (menuItems, subCategory, parentId) =>{
  const categorySelection = menuItems.filter((element) => element.subCategory === subCategory)
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
