import React, {useEffect, useState} from "react";
import axiosClient from "./axios";

import RestaurantCard from "./components/restaurantCard/restaurantCard.component";
import MenuItemsTable from "./components/menuItemsTable/menuItemsTable.component";
import CurrentOrderCartTable
  from "./components/currentOrderCartTable/currentOrderCartTable.component";

import ManagerOrderTable from "./components/managerTable/managerOrdersTable.component";
import ManagerMenuItemsTable
  from "./components/managerTable/managerMenuItemsTable.component";
import EditMenuItemWindow from "./components/menuItemWindow/edit.component";
import AddMenuItemWindow from "./components/menuItemWindow/add.component";

import OrderConfirmation from "./components/orderConfirmation/orderConfirmation.component";
import ConfirmationWindow
  from "./components/confirmationWindow/confirmationWindow.component";

import SearchBar from "./components/searchBar/searchBar.component";
import DropDown from "./components/dropDown/dropDown.component";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ChangeHoursWindow from "./components/restaurantHoursWindow/hoursWindow.component";
import ManagerAnalytics from "./components/managerTable/manager-analytics.component";


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
  const [currentRestaurant, setCurrentRestaurant] = useState({name: "Select a restaurant"});
  const [currentCustomer, setCurrentCustomer] = useState({});
  const [currentRestaurantMenuItems, setCurrentRestaurantMenuItems] = useState([]);
  const [currentRestaurantOrders, setCurrentRestaurantOrders] = useState([]);

  const [showManagerOrderTable, setShowManagerOrderTable] = useState(true);
  const [showManagerMenuItemsTable, setShowManagerMenuItemsTable] = useState(false);
  const [showManagerAnalytics, setShowManagerAnalytics] = useState(false);

  const [menuItemsInCart, setMenuItemsInCart] = useState([]);
  const [orderNumber, setOrderNumber] = useState(null);

  const [showCheckout, setShowCheckout] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const toggleCheckout = () => setShowCheckout(!showCheckout);
  const toggleConfirmation = () => setShowConfirmation(!showConfirmation);

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [asap, setAsap] = useState(false);
  const [storeHours, setStoreHours] = useState(["00:00", "23:59"]);
  const cookTime = 15;

  const toggleShowHours = () => setShowHours(!showHours);
  const [showHours, setShowHours] = useState(false);

  // for adding, editing, and deleting a menu item as a manager
  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const toggleAddMenuItem = () => setShowAddItem(!showAddItem);
  const toggleEditMenuItem = () => setShowEditItem(!showEditItem);
  const [menuItemToEdit, setMenuItemToEdit] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteMenuItemId, setDeleteMenuItemId] = useState(null);

  /**
   * Function to handle view button click
   * @param {String} view - The view
   * @returns {void} - The function does not return a value
   */
  const onViewButtonClick = (newView) => {
    if (newView !== view) {
      setView(newView);

      // reset variables back to empty because they will depend on view
      setCurrentRestaurant({name: "Select a restaurant"});
      setCurrentRestaurantOrders([]);
      setCurrentRestaurantMenuItems([]);
      setCurrentCustomer({});
      setCurrentManager({});
      setMenuItemsInCart([]);
    }
  };

  useEffect(() => {
    fetchMenuItems();
    fetchRestaurants();
  }, [view]);


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
  };


  /**
   * Updates the status of an order and fetches the updated list of orders.
   *
   * This function sends a PATCH request to the server to update the status of a specific order
   * identified by its orderId. Upon successful update, it fetches the updated list of orders
   * to ensure the UI reflects the latest data. If the request fails to update the order status
   * or encounters an error, it logs the error message to the console.
   *
   * @param {string|number} orderId The unique identifier of the order to update.
   * @param {string} newStatus The new status to be assigned to the order.
   */
  const managerUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axiosClient.patch(`/orders/${orderId}`, {status: newStatus});
      if (response.status === 200) {
        // After successfully updating the order status, fetch orders again for a UI update
        fetchOrders();
      }
      else {
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  /**
   * Updates the pickup time of an order.
   *
   * @param {string|number} orderId The unique identifier of the order to update.
   * @param {string} newPickupTime The new pickup time to be assigned to the order.
   */
  const updateOrderPickupTime = async (orderId, newPickupTime) => {
    try {
      const response = await axiosClient.post(`/orders/${orderId}/schedule-pickup`, { pickupTime: newPickupTime });
      if (response.status === 200) {
        // Update local orders state with new pickup time
        const updatedOrders = orders.map((order) =>
          order.id === orderId ? { ...order, pickupTime: newPickupTime } : order
        );
        setOrders(updatedOrders);
      } else {
        console.error("Failed to assign pickup time to order.");
      }
    } catch (error) {
      console.error("Error updating order pickup time:", error);
    }
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

      //update table
      fetchMenuItems();

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
  };


  /**
   * Function to handle adding a menuItem to the cart
   * @param {Object} menuItem - The menuItem to add to the cart
   * @returns {void} - The function does not return a value
   */
  const onAddToCart = (menuItem) => {
    // Check if the item is already in the cart
    const existingItem = menuItemsInCart.find(item => item.id === menuItem.id);

    // If the item is already in the cart, increment the quantity
    if (existingItem) {
      // If the item is already in the cart, increment its quantity
      setMenuItemsInCart(prevItems => prevItems.map(item =>
        item.id === menuItem.id ? {...item, quantity: item.quantity + 1} : item
      ));
    }
    else {
      // Otherwise, add the item to the cart
      setMenuItemsInCart(prevItems => [...prevItems, {...menuItem, quantity: 1}]);
    }
  };


  /**
   * Function to handle removing a menuItem from the cart
   * @param {Object} menuItem - The menuItem to remove from the cart
   * @returns {void} - The function does not return a value
   */
  const onRemoveFromCart = (menuItem) => {
    // Check if the item has a quantity greater than 1
    const existingItem = menuItemsInCart.find(item => item.id === menuItem.id);

    if (existingItem && existingItem.quantity > 1) {
      // If the item has a quantity greater than 1, decrement the quantity
      setMenuItemsInCart(prevItems => prevItems.map(item =>
        item.id === menuItem.id ? {...item, quantity: item.quantity - 1} : item
      ));
    }
    else {
      // Otherwise, remove the item from the cart
      setMenuItemsInCart(prevItems => prevItems.filter(item => item.id !== menuItem.id));
    }
  };


  /**
   * Function to cancel the checkout process
   * @returns {void} - The function does not return a value
   */
  const onCancelCheckout = () => {
    toggleCheckout();
    setAsap(false);
  };


  /**
   * Function to handle the checkout process
   * @returns {void} - The function does not return a value
   */
  const onSubmitOrder = async () => {
    try {
      const response = await checkoutItemsInCart(currentCustomer, currentRestaurant, menuItemsInCart);
      if (response) {
        setOrderNumber(response.id);
        toggleCheckout();
        toggleConfirmation();
        setMenuItemsInCart([]);
        setAsap(false);
        fetchOrders();
      }
      } catch(error) {
        console.error("Error submitting order:", error);
        setOrderNumber(null);
        toggleCheckout();
        toggleConfirmation();
    }
  };


  /**
   * Function to checkout the cart
   * @param {String} currentRestaurant
   * @param {String} currentCustomer
   * @param {Array} menuItemsInCart
   * @returns {Void} - The function does not return a value
   */
  const checkoutItemsInCart = async (currentCustomer, currentRestaurant, menuItemsInCart) => {
    try {
      // Create a new Date object from selectedDate
      const selectedPickupDateTime = new Date(selectedDate);

      // Split the selectedTime into hours and minutes
      const [selectedHours, selectedMinutes] = selectedTime?.split(":")?.map(Number);

      // Set the hours and minutes of selectedPickupDateTime
      selectedPickupDateTime.setHours(selectedHours, selectedMinutes, 0, 0);

      // If any of the menuItems have quantity > 1, create a new array with each menuItem repeated by its quantity
      const menuItemsInCartFlattened = menuItemsInCart.flatMap(menuItem =>
        Array.from({length: menuItem.quantity}, () => menuItem)
      );

      // Create the request body
      let requestBody = {
        customerId: currentCustomer.id,
        restaurantId: currentRestaurant.id,
        menuItems: menuItemsInCartFlattened.map(menuItem => menuItem.id),
      };

      // Add the pickup time to the request body if it is not ASAP
      if (asap) {
        requestBody.pickupTime = formatTime(new Date("1970-01-01T00:00:00Z"));
      } else if (!asap) {
        requestBody.pickupTime = formatTime(selectedPickupDateTime);
      }

      // Send a POST request to create a new order
      const response = await axiosClient.post("/orders", requestBody);
      if (response.status === 201) {
        return response.data;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  };


  /**
   * Function to format the time from a Date object to a String
   * @param {Date} date - The Date object to be formatted
   * @returns {String} - The String representing the formatted time
   */
  const formatTime = (date) => {
    const pad = (num) => num.toString().padStart(2, '0');

    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1); // Months are 0-based
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());
    const ss = pad(date.getSeconds());

    return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`;
  };


  /**
   * Function to check if the selected date is today
   * @param {Date} date - The selected date to check
   * @returns {Boolean} - The boolean value representing if the selected date is today
   */
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };


  /**
   * Function to get the date and time constraints for order pickup
   * @returns {Object} - The object with the date and time constraints
   */
  const getDateConstraints = () => {
    // Use the current date as minDate and format it to store opening hours
    const minDate = new Date();
    const [openHour, openMinutes] = storeHours[0].split(":").map(Number);
    minDate.setHours(openHour, openMinutes, 0, 0);

    // Set the maxDate to current date plus 4 weeks and format it to store closing hours
    const maxDate = new Date();
    const [closeHour, closeMinutes] = storeHours[1].split(":").map(Number);
    maxDate.setDate(maxDate.getDate() + 28);
    maxDate.setHours(closeHour, closeMinutes, 0, 0)

    return {minDate, maxDate};
  };


  /**
   * Function to get the date and time constraints for order pickup
   * @param {Date} selecteDate - The selected date
   * @returns {Object} - The object with the date and time constraints
   */
  const getTimeConstraints = (selectedDate) => {
    // Get the current date, hour, and minutes
    const currentDate = new Date();

    // Initialize the minTime and maxTime
    let minTime = storeHours[0];
    const maxTime = storeHours[1];
    if (isToday(selectedDate)) {
      const newMinutes = (currentDate.getMinutes() + cookTime) % 60;
      const addHours = Math.floor((currentDate.getMinutes() + cookTime) / 60);
      const newHours = (currentDate.getHours() + addHours) % 24;
      minTime = newMinutes < 10 ? newHours + ":0" + newMinutes : newHours + ":" + newMinutes;
    }
    return {minTime, maxTime};
  };


  /**
   * Function to update order status to "Completed"
   * @param {String} OrderID - id of the order to update, this is all we need, as ID is unique
   * @returns {Void} - The function does not return a value
   */
  const completeOrder = async (orderID) => {
    try {
      const response = await axiosClient.patch(`/orders/${orderID}`, {
        status: "completed"
      });
      fetchOrders();
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };


  /**
   * Fetch all menu items from the API/Database at load up
   * @returns {void} - The function does not return a value
   */
  const fetchMenuItems = async () => {
    try {
      const response = await axiosClient.get(`/menuItems/`);
      // extract id, name, status, description, price
      const extractedMenuItems = response.data.map(menuItem => {
        return {
          id: menuItem.id,
          name: menuItem.name,
          status: menuItem.status,
          description: menuItem.description,
          price: menuItem.price,
          image: menuItem.image
        };
      })
      setMenuItems(extractedMenuItems);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);


  /**
   * Sets the current restaurant's menu items
   * @param {Array} menuItems - The list of all menu items
   * @param {Object} currentRestaurant - The current restaurant
   * @returns {void} - The function does not return a value
   */
  const getCurrentRestaurantMenuItems = (menuItems, currentRestaurant) => {
    const restaurantMenuItems = menuItems.filter(menuItem => currentRestaurant.menuItems.includes(menuItem.id));
    setCurrentRestaurantMenuItems(restaurantMenuItems);
  };


  /**
   * UseEffect to set the current restaurant's menu items when the current restaurant or list of menu items changes
   */
  useEffect(() => {
    if (menuItems && currentRestaurant && currentRestaurant.name && currentRestaurant.id) {
      getCurrentRestaurantMenuItems(menuItems, currentRestaurant);
    }
  }, [menuItems, currentRestaurant]);


  /**
   * UseEffect to set the current restaurant's store hours when the current restaurant changes
   * @returns {void} - The function does not return a value
   */
  useEffect(() => {
    if (currentRestaurant && currentRestaurant.id) {
      if (currentRestaurant.storeHours && currentRestaurant.storeHours.open && currentRestaurant.storeHours.close) {
        setStoreHours([currentRestaurant.storeHours.open, currentRestaurant.storeHours.close]);
      } else {
        setStoreHours(["00:00", "23:59"]);
      }
    }
  }, [currentRestaurant]);


  /**
   * Fetch Restaurants from the API/Database
   * @returns {void} - The function does not return a value
   */
  const fetchRestaurants = async () => {
    try {
      const response = await axiosClient.get("/restaurants");
      setRestaurants(response.data);
      //set current restaurant if selected - for changing hours to update immediately
      if (currentRestaurant.id) {
        setCurrentRestaurant(response.data.find( restaurant => restaurant.id === currentRestaurant.id))
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * UseEffect to fetch all restaurants from the database at load up
   */
  useEffect(() => {
    fetchRestaurants();
    // this complains that I dont have fetchRestaurants in dependencies, but that breaks stuff and it works
    // fine like this so I'm just disabling the warning...
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  /**
   * Function to handle logic when restaurant card is clicked
   * @param {Object} restaurant - The restaurant object
   * @returns {void} - The function does not return a value
   */
  const handleRestaurantClick = (restaurant) => {
    if (menuItemsInCart.length > 0) {
      setSelectedRestaurant(restaurant);
      setShowConfirmationModal(true);
    }
    else {
      setCurrentRestaurant(restaurant);
    }
  };


  /**
   * Function to handle the confirmation of changing the restaurant
   * @returns {void} - The function does not return a value
   */
  const handleConfirmChangeRestaurant = () => {
    // Clear the cart and set the current restaurant
    setMenuItemsInCart([]);
    setCurrentRestaurant(selectedRestaurant);
    setShowConfirmationModal(false);
  };


  /**
   * Function to handle the cancelation of changing the restaurant
   * @returns {void} - The function does not return a value
   */
  const handleCancelChangeRestaurant = () => {
    // Clear the selected restaurant and hide the modal
    setSelectedRestaurant(null);
    setShowConfirmationModal(false);
  }


  /**
   * UseEffect to set the current restaurant when the current manager changes
   */
  useEffect(() => {
    if (currentManager && currentManager.restaurantId) {
      setCurrentRestaurant(currentManager.restaurantId);
    }
    else {
      setCurrentRestaurant({name: "Select a restaurant"});
    }
  }, [currentManager]);


  /**
   * Fetch managers from the API/Database to populate the dropdown
   * @returns {void} - The function does not return a value
   */
  const fetchManagers = async () => {
    try {
      const response = await axiosClient.get("/managers");
      setManagers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * UseEffect to fetch all managers from the database at load up
   */
  useEffect(() => {
    fetchManagers();
  }, []);


  /**
   * Fetch customers from the API/Database to populate the dropdown
   * @returns {void} - The function does not return a value
   */
  const fetchCustomers = async () => {
    try {
      const response = await axiosClient.get("/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);


  /**
   * Fetch Orders from the API/Database to populate the orders variable, which is later filtered
   * @returns {void} - The function does not return a value
  */
 const fetchOrders = async () => {
    const statusOrder = ["ordered", "in-progress", "awaiting pickup", "completed"];
    try {
      const response = await axiosClient.get("/orders");
      setOrders(response.data.sort((a, b) => {
        // Sort by status first
        const partOrder = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        if (partOrder !== 0) return partOrder;

        // If the status is the same, then sort by time
        return a.pickupTime.localeCompare(b.pickupTime);
      }));
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);


  /**
   * Sets the orders for a single specified restaurant.
   * @param {*} orders a list of all the orders for all restaurants
   * @param {*} currentRestaurantId the id of the specified restaurant to get the orders for
   */
  const getOrdersForCurrentRestaurant = (orders, currentRestaurantId) => {
    // Filter to get a list of orders for the specified restaurant
    const restaurantOrders = orders.filter(order => order.restaurantId._id === currentRestaurantId._id);

    // set the array to empty if there are no orders for the specified restaurant
    setCurrentRestaurantOrders(restaurantOrders.length > 0 ? restaurantOrders : []);
  };


  // Reacts to changes in orders and currentManager to update the orders for the current restaurant
  useEffect(() => {
    if (orders && currentManager && currentManager.restaurantId) {
      getOrdersForCurrentRestaurant(orders, currentManager.restaurantId);
    }
  }, [orders, currentManager]);


  /**
   * Function to filter the Restaurants based on the restaurant search input
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
    );

    // Update the filteredRestaurants state
    setFilteredRestaurants(newFilteredRestaurants);
  }, [restaurants, restaurantSearchText]);


  /**
   * Function to filter the currentRestaurantMenuItems based on the menu items search input
   * @returns {void} - The function does not return a value
   */
  useEffect(() => {
    // If the search text is empty, set filteredMenuItems to all currentRestaurantMenuItems
    if (!menuItemSearchText) {
      setFilteredMenuItems(currentRestaurantMenuItems);
      return;
    }

    // Filter the currentRestaurantMenuItems based on the search input
    const newFilteredMenuItems = currentRestaurantMenuItems.filter(menuItem =>
      menuItem.name.toLowerCase().includes(menuItemSearchText.toLowerCase())
      || menuItem.description.toLowerCase().includes(menuItemSearchText.toLowerCase())
    );

    // Update the filteredMenuItems state
    setFilteredMenuItems(newFilteredMenuItems);
  }, [currentRestaurantMenuItems, menuItemSearchText]);


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


  /**
   * Function to show the table for the orders for the manager's restaurant
   */
  const handleManagerOrderTable = () => {
    setShowManagerOrderTable(true);

    setShowManagerMenuItemsTable(false);
    setShowManagerAnalytics(false)
  };


  /**
   * Function to show the table for the menu items for the manager's restaurant
   */
  const handleManagerMenuItems = () => {
    setShowManagerMenuItemsTable(true);

    setShowManagerOrderTable(false);
    setShowManagerAnalytics(false)
  };

  const handleManagerAnalytics = () => {
    setShowManagerAnalytics(true);
    setShowManagerOrderTable(false);
    setShowManagerMenuItemsTable(false);
  };

  const handleEditMenuItem = async (menuItem) => {
    try {
      const { id, ...editAttributes } = menuItem;
      const response = await axiosClient.patch(`/menuItems/${id}`, editAttributes);
      if (response.status === 200) {
            // update list of all menu items
            fetchMenuItems();
      }
    } catch (error) {
      window.alert("Failed to update menu item, please try again.");
      console.error("Error editing menu item:", error);
    }
  }

  const handleManagerEditSelection = (menuItem) => {
    setMenuItemToEdit(menuItem);
    toggleEditMenuItem();
  };


  const handleManagerDeleteSelection = async (menuItemId) => {
    try {
      const response = await axiosClient.delete(`/menuItems/${menuItemId}`);
      if (response.status === 200) {
        // remove menu item id from restaurant's menu items array
        try {
          const response = await axiosClient.patch(`/restaurants/${currentManager.restaurantId.id}/deleteMenuItem`, {menuItemId});
          if (response.status === 200) {
            // update list of all menu items
            fetchMenuItems();
            // update currentRestaurant to the same restaurant but with the updated array of menuItems
            setCurrentRestaurant(response.data);
          }
          else {
            window.alert("Failed to update restaurant's menu items while deleting the menu item, please try again.");
            console.error("Failed to update restaurant's menu items");
          }
        } catch (error) {
          window.alert("Failed to update restaurant's menu items while deleting the menu item, please try again.");
          console.error("Error updating restaurant menu items:", error);
        }
      }
      else {
        window.alert("Failed to delete menu item, please try again.");
        console.error("Failed to delete menu item");
      }
    } catch (error) {
      window.alert("Failed to delete menu item, please try again.");
      console.error("Error deleting menu item:", error);
    }
  };


  const handleCancelDeleteMenuItem = () => {
    setShowDeleteConfirmation(false);
    if (deleteMenuItemId !== null) {
      setDeleteMenuItemId(null);
    }
  };

  const handleConfirmDeleteMenuItem = async () => {
    if (deleteMenuItemId !== null) {
      await handleManagerDeleteSelection(deleteMenuItemId);
      setDeleteMenuItemId(null);
      setShowDeleteConfirmation(false);
    }
  };

  const openDeleteConfirmation = (menuItemId) => {
    setDeleteMenuItemId(menuItemId);
    setShowDeleteConfirmation(true);
  };


  const handleAddMenuItem = async (menuItemAttributes) => {
    try {
      const response = await axiosClient.post(`/menuItems/`, menuItemAttributes);
      if (response.status === 201) {
        // Get the id of the newly created menu item
        const newMenuItemId = response.data.id;
        // add new menu item to restaurant's menu items array
        try {
          const response = await axiosClient.patch(`/restaurants/${currentManager.restaurantId.id}/addMenuItem`, {newMenuItemId});
          if (response.status === 200) {
            // update list of all menu items
            fetchMenuItems();
            // update currentRestaurant to the same restaurant but with the updated array of menuItems
            setCurrentRestaurant(response.data);
          }
          else {
            window.alert("Failed to update restaurant's menu items while creating menu item, please try again.");
            console.error("Failed to update restaurant menu items");
          }
        } catch (error) {
          window.alert("Failed to update restaurant's menu items while creating menu item, please try again.");
          console.error("Error updating restaurant menu items:", error);
        }
      }
      else {
        window.alert("Failed to create menu item, please try again.");
        console.error("Failed to create menu item");
      }
    } catch (error) {
      window.alert("Failed to create menu item, please try again.");
      console.error("Error creating menu item:", error);
    }
  };

  const handleChangeHours = async (storeHours) => {
    try {
      const response = await axiosClient.patch(`/restaurants/${currentRestaurant.id}`, {storeHours});
      if (response.status === 200) {
        // fetch restaurants again for a UI update
        fetchRestaurants();
        fetchManagers();
      }
      else {
        window.alert("Failed to update restaurant's hours, please try again.");
        console.error("Failed to change restaurant hours");
      }
    } catch (error) {
      window.alert("Failed to update restaurant's hours, please try again.");
      console.error("Error changing restaurant hours:", error);
    }
  };


  return (
    <div className="App-wrapper">
      <header>
        <h1 className="h1">Restaurant Order Pickup Management System</h1>
      </header>
      <section className="App-view-selection">
        <div className="App-view-buttons">
          <button
            style={{
              backgroundColor: view === "manager" ? "lightblue" : "white",
              color: view === "manager" ? "white" : "black"
            }}
            onClick={() => onViewButtonClick("manager")}
            disabled={view === "manager"}
          >
            Manager View
          </button>
          <button
            style={{
              backgroundColor: view === "customer" ? "lightblue" : "white",
              color: view === "customer" ? "white" : "black"
            }}
            onClick={() => onViewButtonClick("customer")}
            disabled={view === "customer"}
          >
            Customer View
          </button>
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
            <div className="App-customer-view">
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
                      onClick={() => handleRestaurantClick(restaurant)}
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
                <MenuItemsTable
                  className="App-menu-item-table"
                  menuItems={filteredMenuItems}
                  currentRestaurant={currentRestaurant}
                  currentCustomer={currentCustomer}
                  onAddToCart={onAddToCart}
                />
              </section>
              <section className="App-current-order">
                <h2 className="h2">Your Order</h2>
                <div className="current-order-table">
                  <CurrentOrderCartTable
                    className="App-current-order-cart-table"
                    menuItemsInCart={menuItemsInCart}
                    onRemoveFromCart={onRemoveFromCart}
                    onCancelCheckout={onCancelCheckout}
                    onSubmitOrder={onSubmitOrder}
                    showCheckout={showCheckout}
                    toggleCheckout={toggleCheckout}
                    showConfirmation={showConfirmation}
                    toggleConfirmation={toggleConfirmation}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    selectedTime={selectedTime}
                    setSelectedTime={setSelectedTime}
                    getDateConstraints={getDateConstraints}
                    getTimeConstraints={getTimeConstraints}
                    asap={asap}
                    setAsap={setAsap}
                    orders={orders}
                    currentCustomer={currentCustomer}
                    completeOrder={completeOrder}
                  />
                </div>
              </section>
            </div>
          </>
        )}
        {view === "manager" && (
          <>
            <section className="App-manager-view">
              <div className="App-manager-restaurant-name">
                {currentRestaurant.name === "Select a restaurant" ? null : (
                  <h3>{currentRestaurant.name}</h3>
                )}
              </div>
              <div>
                <div className="App-manager-table-buttons">
                  <button onClick={handleManagerOrderTable}>Orders</button>
                  <button onClick={handleManagerMenuItems}>Menu Items</button>
                  {currentRestaurant.id && (
                    // this will only show when current restaurant is selected
                    // current restaurant is updated when a manager is selected
                    <>
                      <button onClick={toggleAddMenuItem}>Add Menu Item</button>
                      <button onClick={toggleShowHours}>Change Restaurant Hours</button>
                    </>
                  )}
                  <button onClick={handleManagerAnalytics}>Analytics</button>
                </div>
                {showManagerOrderTable && (
                  <section className="App-manager-order-table">
                    <ManagerOrderTable
                      className="App-manager-order-table"
                      orders={currentRestaurantOrders}
                      onUpdateOrderStatus={managerUpdateOrderStatus}
                      onUpdateOrderPickupTime={updateOrderPickupTime}
                      getOrders={fetchOrders}
                    />
                  </section>
                )}
                {showManagerMenuItemsTable && (
                  <section className="App-manager-menuItems-table">
                    <ManagerMenuItemsTable
                      className="App-manager-menu-items-table"
                      menuItems={filteredMenuItems}
                      onItemSelection={handleManagersMenuItemSelection}
                      onEditSelection={handleManagerEditSelection}
                      onDeleteSelection={openDeleteConfirmation}
                    />
                    <EditMenuItemWindow
                      className="App-manager-edit-menu-item-table"
                      showMenuItem={showEditItem}
                      toggleMenuItem={toggleEditMenuItem}
                      onSubmit={handleEditMenuItem}
                      menuItemToEdit={menuItemToEdit}
                    />
                  </section>
                )}

                {showManagerAnalytics && (
                  <section className="App-manager-analytics">
                    <ManagerAnalytics currentManager={currentManager}/>
                  </section>
                )}
              </div>
            </section>
          </>
        )}
      </main>
      <OrderConfirmation
        showConfirmation={showConfirmation}
        toggleConfirmation={toggleConfirmation}
        orderNumber={orderNumber}
      />
      <ChangeHoursWindow
        currentRestaurant={currentRestaurant}
        showHours={showHours}
        toggleHours={toggleShowHours}
        onSubmit={handleChangeHours}
      />
      <AddMenuItemWindow
        showMenuItem={showAddItem}
        toggleMenuItem={toggleAddMenuItem}
        onSubmit={handleAddMenuItem}
      />
      <ConfirmationWindow
        className="App-confirm-change-restaurant"
        show={showConfirmationModal}
        title="Change Restaurant?"
        body="This will empty your current order cart"
        onConfirm={handleConfirmChangeRestaurant}
        onCancel={handleCancelChangeRestaurant}
      />
      <ConfirmationWindow
        className="App-confirm-delete-menuItem"
        show={showDeleteConfirmation}
        title="Delete?"
        body="Are you sure that you would like to delete this menu item?"
        onConfirm={handleConfirmDeleteMenuItem}
        onCancel={handleCancelDeleteMenuItem}
      />
      <footer>
        <p>Thank you for choosing Restaurant Order Pickup Management System ||
          2024 &copy; Copyright</p>
      </footer>
    </div>
  );
}

// Export the App component
export default App;
