import React, { useEffect, useState } from "react";
import axiosClient from "./axios";

import RestaurantCard from "./components/restaurantCard/restaurantCard.component";
import MenuItemsTable from "./components/menuItemsTable/menuItemsTable.component";
import CurrentOrderCartTable
  from "./components/currentOrderCartTable/currentOrderCartTable.component";

import SearchBar from "./components/searchBar/searchBar.component";
import ManagerOrderTable from "./components/managerTable/managerOrdersTable.component";
import ManagerMenuItemsTable from "./components/managerTable/managerMenuItemsTable.component";
import DropDown from "./components/dropDown/dropDown.component";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";


/**
 * Main App component
 * @returns {JSX.Element} App component
 */
function App() {
  const [view, setView] = useState("customer"); // Set default view to customer
  const [restaurantSearchText, setRestaurantSearchText] = useState("");
  const [menuItemSearchText, setMenuItemSearchText] = useState("");

  const [menuItems, setMenuItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [managers, setManagers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);

  const [currentManager, setCurrentManager] = useState({});
  const [currentRestaurant, setCurrentRestaurant] = useState({ name: "Select a restaurant" });
  const [currentCustomer, setCurrentCustomer] = useState({});
  const [currentMenuItemId, setCurrentMenuItemId] = useState(null);
  const [currentRestaurantOrders, setCurrentRestaurantOrders] = useState([]);

  const [showManagerOrderTable, setShowManagerOrderTable] = useState(true);
  const [showManagerMenuItemsTable, setShowManagerMenuItemsTable] = useState(false);

  const [menuItemsInCart, setMenuItemsInCart] = useState([]);
  const [menuItemIdCounter, setMenuItemIdCounter] = useState(0);

  useEffect(() => {
    setCurrentRestaurant(currentManager.restaurantId || { name: "Select a restaurant" });
  }, [currentManager])

  /**
    * Function to handle view button click
    * @param {String} view - The view
    * @returns {void} - The function does not return a value
    */
  const onViewButtonClick = (view) => {
    setView(view);

    // reset the restaurant and restaurant orders back to empty because restaurant will depend on view
    setCurrentRestaurant({ name: "Select a restaurant" });
    setCurrentRestaurantOrders([]);
    setMenuItems([]);
    setCurrentCustomer({});
    setCurrentManager({});
  };


  /**
   * Sets the orders for a single specified restaurant.
   * @param {*} orders a list of all the orders for all restaurants
   * @param {*} currentRestaurantId the id of the specified restaurant to get the orders for
   */
  const getOrdersForCurrentRestaurant = (orders, currentRestaurantId) => {
    // Filter to get a list of orders for the specified restaurant
    const restaurantOrders = orders.filter(order => order.restaurantId === currentRestaurantId);
    // set the array to empty if there are no orders for the specified restaurant
    setCurrentRestaurantOrders(restaurantOrders.length > 0 ? restaurantOrders : []);
  };


  /**
    * Function to handle the selected manager from the dropdown
    * @param {*} manager - the selected manager's ID
    * @returns {void} - The function does not return a value
    */
  const handleManagerSelection = (selectedManagerId) => {
    // Find the manager with the given ID
    const selectedManager = managers.find(manager => manager.id === selectedManagerId);

    // Set the current manager
    setCurrentManager(selectedManager);

    // Get the orders for the restaurant that the manager manages
    setCurrentRestaurantOrders(getOrdersForCurrentRestaurant(orders, selectedManager.restaurantId)); // maybe change to UseEffect so that it updates when order status changes ?????
  };


  const handleManagersOrderSelection = () => {
    // TODO - send status update to backend to update status of order and change order status here and update button color and text in table
    // go from go from ordered to in-progress then from in-progress to awaiting-pickup then to completed




  };


  /**
   * Changes the status of a menu item to sold-out or in-stock when the button is clicked in the table
   * @param {*} itemId the id of the menuItem to update the status of
   */
  const handleManagersMenuItemSelection = async (itemId) => {
    try {
      // Send a PATCH request to change the status to its opposite value 
      await axiosClient.patch(`/menuItems/${itemId}`, { 
         // Find the current status and change it 
        status: menuItems.find(item => item.id === itemId).status === "sold-out" ? "in stock" : "sold-out"
      });

      // Set currentMenuItemId to trigger useEffect to retrieve updated menuItems
      setCurrentMenuItemId(itemId);

    } catch (error) {
        console.error("Error updating status:", error);
    }
  };


  /**
   * Function to handle the selected customer from the dropdown
   * @param {*} selectedCustomerId - the selected customer's ID
   * @returns {void} - The function does not return a value
   */
  const handleCustomerSelection = (selectedCustomerId) => {
    // Find the customer with the given ID
    const selectedCustomer = customers.find(customer => customer.id === Number(selectedCustomerId));

    // Set the current customer
    setCurrentCustomer(selectedCustomer);
  }


  /**
    * Function to handle adding a menuItem to the cart
    * @param {Object} menuItem - The menuItem to add to the cart
    * @returns {void} - The function does not return a value
    */
  const onAddToCart = (menuItem) => {
    // Assign a new unique ID to the item
    const itemWithId = { ...menuItem, id: menuItemIdCounter };

    // Add the item to the cart
    setMenuItemsInCart(prevItems => [...prevItems, itemWithId]);

    // Increment the menu item ID counter
    setMenuItemIdCounter(menuItemIdCounter + 1);
  }


  /**
    * Function to handle removing a menuItem from the cart
    * @param {Object} menuItem - The menuItem to remove from the cart
    * @returns {void} - The function does not return a value
    */
  const onRemoveFromCart = (menuItem) => {
    // Remove only the item with the matching ID
    setMenuItemsInCart(prevItems => prevItems.filter(item => item.id !== menuItem.id));
  }


  /**
   * Function to handle the checkout process
   * @returns {void} - The function does not return a value
   */
  const onCheckout = () => {
    checkoutItemsInCart(currentCustomer, currentRestaurant, menuItemsInCart).then((response) => {
      console.log(response);
      setMenuItemsInCart([]);
    });
  }


  /**
   * Function to checkout the cart
   * @param {String} currentRestaurant
   * @param {String} currentCustomer
   * @param {Array} menuItemsInCart
   * @returns {Void} - The function does not return a value
   */
  const checkoutItemsInCart = async (currentCustomer, currentRestaurant, menuItemsInCart) => {
    try {
      const response = await axiosClient.post("/orders", {
        customerId: currentCustomer.id,
        restaurantId: currentRestaurant.id,
        menuItems: menuItemsInCart.map(menuItem => menuItem.id),
        pickupTime: "2024-03-15T14:30:00Z"
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };


  /**
    * Fetch MenuItems from the API/Database
    */
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        if (currentRestaurant.name === "Select a restaurant") {
          return;
        }
        if (currentRestaurant.id) {
          await axiosClient.get(`/restaurants/menuItems/${currentRestaurant.id}`).then((res) => {

            const allMenuItems = res.data;
            // extract id, name, status, description, price
            const extractedMenuItems = allMenuItems.map(menuItem => {
              return {
                id: menuItem.id,
                name: menuItem.name,
                status: menuItem.status,
                description: menuItem.description,
                price: menuItem.price
              };
            })
            setMenuItems(extractedMenuItems);
          })
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchMenuItems().then();
  }, [currentRestaurant, currentMenuItemId, menuItems]);


  /**
    * Fetch Restaurants from the API/Database
    */
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        await axiosClient.get("/restaurants").then((res) => {
          const allRestaurants = res.data;
          setRestaurants(allRestaurants);
        })
      } catch (error) {
        console.error(error);
      }
    }
    fetchRestaurants().then();
  }, []);


  /**
    * Fetch managers from the API/Database
    */
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        await axiosClient.get("/managers").then((res) => {
          const allManagers = res.data;
          setManagers(allManagers);
        })
      } catch (error) {
        console.error(error);
      }

    };
    fetchManagers();
  }, []);


  /**
   * Fetch customers from the API/Database
   * @returns {void} - The function does not return a value
   */
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        await axiosClient.get("/customers").then((res) => {
          const allCustomers = res.data;
          setCustomers(allCustomers);
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchCustomers();
  }, []);


  /**
    * Fetch Orders from the API/Database
    */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        await axiosClient.get("/orders").then((res) => {
          const allOrders = res.data;
          setOrders(allOrders);
        })
      } catch (error) {
        console.error(error);
      }
    }
    fetchOrders().then();
  }, []);


  /**
    * Function to filter the Restaurants based on the search input
    * @returns {void} - The function does not return a value
    */
  useEffect(() => {
    // If the search text is empty, set filteredRestaurants to all Restaurants
    if (!restaurantSearchText) {
      setFilteredRestaurants(restaurants);
      return;
    }

    // Filter the Restaurants based on the search input
    const newFilteredRestaurants = restaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(restaurantSearchText.toLowerCase())
      // || restaurant.description.toLowerCase().includes(restaurantSearchText.toLowerCase())
      // || restaurant.department.toLowerCase().includes(restaurantSearchText.toLowerCase())
    );

    // Update the filteredRestaurants state
    setFilteredRestaurants(newFilteredRestaurants);
  }, [restaurants, restaurantSearchText]);


  /**
   * Function to filter the MenuItems based on the search input
   * @returns {void} - The function does not return a value
   */
  useEffect(() => {
    // If the search text is empty, set filteredMenuItems to all MenuItems
    if (!menuItemSearchText) {
      setFilteredMenuItems(menuItems);
      return;
    }

    // Filter the MenuItems based on the search input
    const newFilteredMenuItems = menuItems.filter(menuItem =>
      menuItem.name.toLowerCase().includes(menuItemSearchText.toLowerCase())
      || menuItem.description.toLowerCase().includes(menuItemSearchText.toLowerCase())
      // || menuItem.status.toLowerCase().includes(menuItemSearchText.toLowerCase())
    );

    // Update the filteredMenuItems state
    setFilteredMenuItems(newFilteredMenuItems);
  }, [menuItems, menuItemSearchText]);


  /**
   * Function to handle the search input change for restaurants
   * @param {Object} event - The event object
   * @returns {void} - The function does not return a value
   */
  const handleRestaurantSearchInput = (event) => {
    setRestaurantSearchText(event.target.value);
  }


  /**
   * Function to handle the search input change for menu items
   * @param {Object} event - The event object
   * @returns {void} - The function does not return a value
   */
  const handleMenuItemSearchInput = (event) => {
    setMenuItemSearchText(event.target.value);
  }


  const handleManagerOrderTable = () => {
    setShowManagerOrderTable(true);
    setShowManagerMenuItemsTable(false);
  };


  const handleManagerMenuItems = () => {
    setShowManagerOrderTable(false);
    setShowManagerMenuItemsTable(true);
  };


  return (
    <div className="App-wrapper">
      <header>
        <h1 className="h1">Restaurant Order Pickup Management System</h1>
      </header>
      <section className="App-view-container">
        <div className="App-view-buttons">
          <button onClick={() => onViewButtonClick("manager")}>Manager View</button>
          <button onClick={() => onViewButtonClick("customer")}>Customer View</button>
        </div>
        <section className="App-view-dropdowns">
          {view === "manager" && (
            <>
              <DropDown
                options={managers}
                currentOption={currentManager}
                onManagerSelection={handleManagerSelection}
              />
            </>
          )}
          {view === "customer" && (
            <>
              <DropDown
                options={customers}
                currentOption={currentCustomer}
                onCustomerSelection={handleCustomerSelection}
              />
            </>
          )}
        </section>
      </section>
      <main>
        {view === "customer" && (
          <>
            <section className="App-restaurant-list">
              <h2 className="h2">Restaurants</h2>
              <SearchBar
                className="App-restaurant-search-bar"
                placeholder="Search for restaurants"
                handleInput={handleRestaurantSearchInput}
              />
              <div className="App-restaurant-cards">
                {filteredRestaurants.map(restaurant => (
                  <RestaurantCard
                    key={restaurant._id}
                    restaurant={restaurant}
                    onClick={() => {
                      setCurrentRestaurant(restaurant);
                    }}
                  />
                ))}
              </div>
            </section>
            <section className="App-menu-items">
              <h2 className="h2">{currentRestaurant.name}</h2>
              <SearchBar
                className="App-menu-item-search-bar"
                placeholder="Search for menu items"
                handleInput={handleMenuItemSearchInput}
              />
              <div className="App-menu-list">
                <MenuItemsTable
                  menuItems={filteredMenuItems}
                  className="App-menu-item-table"
                  currentRestaurant={currentRestaurant}
                  currentCustomer={currentCustomer}
                  onAddToCart={onAddToCart}
                />
              </div>
            </section>
            <section className="App-current-order">
              <h2 className="h2">Your Order</h2>
              <div className="current-order-table">
                <CurrentOrderCartTable
                  className="App-current-order-cart-table"
                  menuItemsInCart={menuItemsInCart}
                  onRemoveFromCart={onRemoveFromCart}
                  onCheckout={onCheckout}
                  orders={orders}
                  currentCustomer={currentCustomer}
                />
              </div>
            </section>
          </>
        )}
        {view === "manager" && (
          <>
          <section>
            <div className="App-manager-restaurant-name">
              {currentRestaurant.name === "Select a restaurant" ? null : (
                <h3>{currentRestaurant.name}</h3>
            )}
            </div>
            <div>
              <div className="App-manager-table-buttons">
                <button onClick={handleManagerOrderTable}>Orders</button>
                <button onClick={handleManagerMenuItems}>Menu Items</button>
              </div>
              {showManagerOrderTable && (
                <section className="App-manager-order-table">
                  <ManagerOrderTable
                    orders={currentRestaurantOrders}
                    onOrderSelection={handleManagersOrderSelection} />
                </section>
              )}
              {showManagerMenuItemsTable && (
                <section className="App-manager-menuItems-table">
                  <ManagerMenuItemsTable
                    menuItems={menuItems}
                    onItemSelection={handleManagersMenuItemSelection} />
                </section>
              )}
            </div>
          </section>
          </>
        )}
      </main>
      <footer>
        <p>Thank you for choosing Restaurant Order Pickup Management System ||
          2024 &copy; Copyright</p>
      </footer>
    </div>
  );
}

// Export the App component
export default App;
