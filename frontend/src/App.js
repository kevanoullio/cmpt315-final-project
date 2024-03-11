import React, {useEffect, useState} from "react";

// import MenuItem from "./components/menuItem/menuItem.component";
// import Restaurant from "./components/restaurant/restaurant.component";
// import Manager from "./components/manager/manager.component";
// import Customer from "./components/customer/customer.component";
// import Order from "./components/order/order.component";
import RestaurantCard from "./components/restaurantCard/restaurantCard.component";
import MenuItemsTable from "./components/menuItemTable/menuItemTable.component";
import CurrentOrderCartTable
    from "./components/currentOrderCartTable/currentOrderCartTable.component";
import SearchBar from "./components/searchBar/searchBar.component";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import axiosClient from "./axios";

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

    const [currentRestaurant, setCurrentRestaurant] = useState({name: "Select a restaurant"});
    const [currentManager, setCurrentManager] = useState([]);
    const [currentCustomer, setCurrentCustomer] = useState([]);

    const [menuItemsInCart, setMenuItemsInCart] = useState([]);

    /**
     * Function to handle view button click
     * @param {String} view - The view
     * @returns {void} - The function does not return a value
     */
    const onViewButtonClick = (view) => {
        setView(view);
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
     * Fetch MenuItems from the API/Database
     */
    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                if (currentRestaurant.name === "Select a restaurant") {
                    return;
                }
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
                    console.log(extractedMenuItems);
                    setMenuItems(extractedMenuItems);
                })
            } catch (error) {
                console.error(error);
            }
        }
        fetchMenuItems().then();
    }, [currentRestaurant]);

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

    return (
      <div className="App-wrapper">
          <header>
              <h1 className="h1">Restaurant Order Pickup Management System</h1>
          </header>
          <main>
              {view === "customer" && (
                <>
                    <section className="App-restaurant-list">
                        <h3 className="h2">Restaurants</h3>
                        <SearchBar
                          className="App-restaurant-search-bar"
                          placeholder="Search for restaurants"
                          handleInput={handleSearchInput}
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
                        <h3 className="h3">{currentRestaurant.name}</h3>
                        <SearchBar
                          className="App-menu-item-search-bar"
                          placeholder="Search for menu items"
                          handleInput={handleSearchInput}
                        />
                        <MenuItemsTable
                          menuItems={menuItems}
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
