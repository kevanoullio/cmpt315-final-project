// Extra file to store some useful functions you want to use more than in just one file

/**
 * Function to see if a restaurant is currently in operating hours
 * Uses the users current time from new Date()
 * NOTE: This allows the user to change their PC's current time to trick a
 * store into thinking they are open, but I wanted this so testing is easy :)
 *
 * If we wanted to change it, get time from this api call: https://worldtimeapi.org/api/
 * @param {*} open the open time, in 24 hour with colon between mins:hour
 * @param {*} close the close time, in 24 hour with colon between mins:hour
 */
export const isOpen = (open, close) => {
  const d = new Date(); // get current user time, hours and minutes
  const hour = d.getHours();
  const mins = d.getMinutes();

  // convert user time to minutes
  const currentTimeInMinutes = hour * 60 + mins;
  // and restaurant open and close to minutes for easy comparison
  const openTimeInMinutes = parseInt(open.split(":")[0]) * 60 + parseInt(open.split(":")[1]);
  const closeTimeInMinutes = parseInt(close.split(":")[0]) * 60 + parseInt(close.split(":")[1]);

  return (openTimeInMinutes < currentTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes);
}

