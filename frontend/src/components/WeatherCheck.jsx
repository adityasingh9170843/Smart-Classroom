import axios from 'axios';
import cron from 'node-cron';
import dotenv from 'dotenv';
import NotificationsPage from '@/pages/Notifications';
dotenv.config();

// --- Configuration ---
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const CITY = process.env.WEATHER_CITY || 'mumbai'; // Default city
const COUNTRY_CODE = process.env.WEATHER_COUNTRY_CODE || 'IN'; // Default country

const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY_CODE}&appid=${OPENWEATHER_API_KEY}`;


async function checkWeatherAndNotify() {
  if (!OPENWEATHER_API_KEY) {
    console.warn('Weather checker is disabled. OPENWEATHER_API_KEY is not set.');
    return;
  }

  console.log('Running daily weather check...');

  try {
    const response = await axios.get(WEATHER_API_URL);
    const weatherData = response.data;

    // OpenWeatherMap returns an array of weather conditions. We check the main condition.
    const weatherCondition = weatherData.weather[0].main; // e.g., "Rain", "Clouds", "Clear"
    console.log(`Current weather in ${CITY}: ${weatherCondition}`);

    // Check for rainy conditions
    const isRainy = ['Rain', 'Thunderstorm', 'Drizzle'].includes(weatherCondition);

    if (isRainy) {
      const message = `Due to rainy weather (${weatherCondition}) in ${CITY}, all classes are cancelled today. Please stay safe.`;
      
      console.log('Rain detected! Creating cancellation notification.');

      // Create and save the notification to the database
      const notification = new Notification({
        title: 'Classes Cancelled Due to Weather',
        message: message,
        type: 'warning', // 'warning' or 'info' type is suitable
        isRead: false,
      });

      await notification.save();
      console.log('Cancellation notification saved successfully.');
    } else {
      console.log('Weather is clear. No notification needed.');
    }
  } catch (error) {
    if (error.response) {
      console.error('Error fetching weather data:', error.response.status, error.response.data.message);
    } else {
      console.error('An unexpected error occurred in the weather checker:', error.message);
    }
  }
}

/**
 * Schedules the weather check to run once every day at 7:00 AM.
 * Cron syntax: minute hour day-of-month month day-of-week
 * '0 7 * * *' means at minute 0 of hour 7, every day.
 */
function scheduleWeatherChecks() {
    cron.schedule('0 7 * * *', checkWeatherAndNotify, {
        scheduled: true,
        timezone: "Asia/Kolkata" // Set to your university's timezone
    });

    console.log('Weather check job scheduled to run every day at 7:00 AM.');
    // For testing, you can run it once on startup:
    // checkWeatherAndNotify(); 
}

export default scheduleWeatherChecks;
