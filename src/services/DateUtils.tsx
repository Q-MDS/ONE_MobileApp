class DateUtils {
	// Get the current week number
	static getCurrentWeekNumber(): number {
	  const now = new Date();
	  const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
	  const pastDaysOfYear = (now.valueOf() - firstDayOfYear.valueOf()) / 86400000;
	  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
	}
  
	// Get the current day of the week number (0 for Sunday, 1 for Monday, etc.)
	static getCurrentDayOfWeek(): number {
	  return new Date().getDay();
	}
  }

  export default DateUtils;