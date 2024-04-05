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

/**
 * Converts my time string from 24h (as it is in the database) to 12h
 * @param {String} time - in 24h in format "hh:mm"
 * @returns time string in 21h format "hh:mm a/p"
 */
export const tConvert = (time) => {
  // split into hours/mins
  time = time.toString();
  let times = time.split(":")
  // set default ampm as AM
  let ampm = " AM";

  // if > 12, set PM and subtract 12
  if (times[0] > 12) {
    ampm = " PM"
    times[0] -= 12;
  } else if (times[0] == 12) {
    // if equal to 12 set pm, dont remove 12 (noon)
    ampm = " PM"
  } else if (times[0] == 0) {
    // if midnight, we have to add 12 manually
    times[0] = 12;
  }

  return times[0] + ":" + times[1] + ampm; // return adjusted time or original string
}
