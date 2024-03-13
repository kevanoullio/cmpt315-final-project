import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// import MenuItem from "./components/menuItem/menuItem.component";
// import Restaurant from "./components/restaurant/restaurant.component";
// import Manager from "./components/manager/manager.component";
// import Customer from "./components/customer/customer.component";
// import Order from "./components/order/order.component";

import RestaurantCard from "./components/restaurantCard/restaurantCard.component";
import MenuItemsTable from "./components/menuItemTable/menuItemTable.component";
import CurrentOrderCartTable from "./components/currentOrderCartTable/currentOrderCartTable.component";
import ManagerTable from "./components/managerTable/managerOrdersTable.component";

import DropDown from "./components/dropDown/dropDown.component";
import SearchBar from "./components/searchBar/searchBar.component";
import menuItemTable from "./components/menuItemTable/menuItemTable.component";

/**
 * Main App component
 * @returns {JSX.Element} App component
 */
function App() {
	const [view, setView] = useState("customer"); // Set default view to customer
	const [searchText, setSearchText] = useState("");
	
  const [menuItems, setMenuItems] = useState([]);
	const [restaurants, setRestaurants] = useState([]);
  const [managers, setManagers] = useState([]);
  const [customers, setCustomers] = useState([]);
	const [orders, setOrders] = useState([]);

	const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);

	const [currentRestaurant, setCurrentRestaurant] = useState([]);
  const [currentManager, setCurrentManager] = useState([]);
  const [currentCustomer, setCurrentCustomer] = useState([]);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [currentRestaurantOrders, setCurrentRestaurantOrders] = useState([]);

	const [menuItemsInCart, setMenuItemsInCart] = useState([]);

	/**
	 * Function to handle view button click
	 * @param {String} view - The view
	 * @returns {void} - The function does not return a value
	 */
	const onViewButtonClick = (view) => {
		setView(view);
    // reset the restaurant back to empty because restaurant will depend on view 
    setCurrentRestaurant([]);
	}

  /**
   * Function to handle adding a menuItem to the cart
   * @param {Object} menuItem - The menuItem to add to the cart
   * @returns {void} - The function does not return a value
   */
  const onAddToCart = (menuItem) => {
    setMenuItemsInCart([...menuItemsInCart, menuItem]);
  }

  /**
   * Function to handle removing a menuItem from the cart
   * @param {Object} menuItem - The menuItem to remove from the cart
   * @returns {void} - The function does not return a value
   */
  const onRemoveFromCart = (menuItem) => {
    const newCart = menuItemsInCart.filter(item => item !== menuItem);
    setMenuItemsInCart(newCart);
  }

  /**
   * Sets the orders for a single specified restaurant. 
   * @param {*} orders a list of all the orders for all restaurants 
   * @param {*} currentRestaurantId the id of the specified restaurant to get the orders for 
   */
  const getOrdersForCurrentRestaurant = (orders, currentRestaurantId) => {
    setCurrentRestaurantOrders(orders.filter(order => order.restaurantId === currentRestaurantId));
  };

	/**
     * Function to handle the selected customer from the dropdown
     * @param {String} selectedCustomerId - The selected customer's ID
	 * @returns {void} - The function does not return a value
     */
	const handleSelectedCustomer = (selectedCustomerId) => {
		// Find the customer with the given ID
		const selectedCustomer = customers.find(customer => customer.id === Number(selectedCustomerId));

		// Set the current customer
		setCurrentCustomer(selectedCustomer);
	};

  /**
   * Function to handle the selected manager from the dropdown
   * @param {*} manager - the selected manager's ID
   */
  const handleManagerSelection = (selectedManagerId) => {
    // Find the manager with the given ID
		const selectedManager = managers.find(manager => manager.id === Number(selectedManagerId));

    // Set the current manager 
    setCurrentManager(selectedManager);
  };

  /**
   * Function to handle the selected order so that the status can progress from ordered to 
   * in-progress to awaiting-pickup to completed
   * @param {*} order the order to update the status of 
   */ 
   const handleOrderSelection = (order) => {
    setCurrentOrder(order);

    /** TODO */ 

  };

  /**
   * Fetch managers from the API/Database
   */ 
  useEffect(() => {
    const fetchManagerList = async () => {
      try {
        const response = await axios(
          'http://localhost:8080/managers',
        );
        setManagers(response.data);
      } catch (error) {
        console.error(error);
      }
      
    };
    fetchManagerList();
  }, []); 
  
  /**
   * Fetch MenuItems from the API/Database
   */
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        // Fetch all menuItems from the database
        const response = await axios("http://localhost:8080/restaurants")
        const allMenuItems = response.data;

        // Derive the menuItems for the current restaurant
        const menuItems = allMenuItems.filter(menuItems => menuItems.restaurants.includes(currentRestaurant._id));

        // Update state
        setMenuItems(allMenuItems);
        // setMenuItemsInCart(menuItemsInCart);
      } catch (error) {
        console.error(error);
      }
    }
    fetchMenuItems();
  }, []);

  /**
   * Fetch Restaurants from the API/Database
   */
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        // Fetch all restaurants from the database
        const response = await axios("http://localhost:8080/restaurants")
        // Update state
        setRestaurants(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);
  
  /**
   * Fetch Orders from the API/Database
   */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios(
          "http://localhost:8080/orders"
        )
        setOrders(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchOrders();
  }, []);

	/**	
	 * Function to filter the Restaurants based on the search input
	*/
	useEffect(() => {
		// If the search text is empty, set filteredRestaurants to all Restaurants
		if (!searchText) {
			setFilteredRestaurants(restaurants);
			return;
		}
	  
		// Filter the Restaurants based on the search input
		const newFilteredRestaurants = restaurants.filter(restaurant =>
			restaurant.name.toLowerCase().includes(searchText.toLowerCase())
			// || restaurant.description.toLowerCase().includes(searchText.toLowerCase())
			// || restaurant.department.toLowerCase().includes(searchText.toLowerCase())
		);
	  
		// Update the filteredRestaurants state
		setFilteredRestaurants(newFilteredRestaurants);
	}, [restaurants, searchText]);
	
	/**
	 * Function to handle search input change
	 * @param {Object} event - The event object
	 * @returns {void} - The function does not return a value
	 */
	const handleSearchInput = event => {
		// Set the search input
		setSearchText(event.target.value);
	};

	/**
	 * Return the main App component
	 */
	return (
		<div className="App-wrapper">
			<header>
				<h1 className="h1">Restaurant Order Pickup Management System</h1>
			</header>
			<main>
        <section  className="App-view-buttons-container">
          <div className="App-view-buttons">
            <button onClick={() => onViewButtonClick("manager")}>Manager View</button>
          </div>
          <div className="App-view-buttons">
            <button onClick={() => onViewButtonClick("customer")}>Customer View</button>
          </div>
        </section>
        {view === "customer" && (
              <>
          <section className="App-restaurant-list">
                <h3 className="h2">Restaurants</h3>
                <SearchBar
                  className="App-restaurant-search-bar"
                  placeholder="Search for restaurants"
                  handleInput={handleSearchInput}
                />
          </section>
          <section className="App-menu-items">
            <h3 className="h3">currentRestaurant.name</h3>
            <SearchBar
              className="App-menu-item-search-bar"
              placeholder="Search for menu items"
              handleInput={handleSearchInput}
            />
            <MenuItemsTable
              className="App-menu-item-table"
              restaurants={filteredRestaurants}
              currentRestaurant={currentRestaurant}
              menuItemsInCart={menuItemsInCart}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
            />
          </section>
          <section className="App-current-order">
            <h3 className="h2">Your Order</h3>
            <CurrentOrderCartTable
              className="App-current-order-cart-table"
              menuItems={menuItemsInCart}
              currentRestaurant={currentRestaurant}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
              />
          </section>
						</>
        )}
        {view === "manager" && (
          <>
            <section className="App-select-manager">
            <DropDown 
              placeholder="Select Manager" 
              options={managers}
              currentOption={currentManager}
              onManagerSelection={handleManagerSelection} />
            </section>
            <section>
              <h3 className="h2">{currentRestaurant.name}</h3>
            </section>
            <section>
              {/* <ManagerTable 
                orders={getOrdersForCurrentRestaurant(orders, currentRestaurant.id)} 
                onOrderSelection={handleOrderSelection}/> */}
            </section>
          </>
        )}
			</main>
			<footer>
				<p>Thank you for choosing Restaurant Order Pickup Management System || 2024 &copy; Copyright</p>
			</footer>
		</div>
	);
}

// Export the App component
export default App;
