/**
 * Helper functions for date and time operations
 */

/**
 * Convert time string (HH:MM:SS) to minutes
 * @param {string} time - Time string to convert
 * @returns {number} Time in minutes
 */
const timeToMinutes = (time) => {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return (hours * 60) + (minutes || 0) + ((seconds || 0) / 60);
};

/**
 * Check if two time ranges overlap
 * @param {string} startTime1 - First range start time (HH:MM)
 * @param {string} endTime1 - First range end time (HH:MM)
 * @param {string} startTime2 - Second range start time (HH:MM)
 * @param {string} endTime2 - Second range end time (HH:MM)
 * @returns {boolean} True if the time ranges overlap
 */
const validateTimeOverlap = (startTime1, endTime1, startTime2, endTime2) => {
    const start1 = timeToMinutes(startTime1);
    const end1 = timeToMinutes(endTime1);
    const start2 = timeToMinutes(startTime2);
    const end2 = timeToMinutes(endTime2);

    return (start1 < end2 && end1 > start2);
};

/**
 * Format minutes to time string (HH:MM)
 * @param {number} minutes - Minutes to format
 * @returns {string} Formatted time string (HH:MM)
 */
const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

/**
 * Generate time slots between start and end time with given interval
 * @param {string} startTime - Start time (HH:MM)
 * @param {string} endTime - End time (HH:MM)
 * @param {number} intervalMinutes - Interval in minutes (default: 60)
 * @returns {Array} Array of time slot objects with startTime and endTime
 */
const generateTimeSlots = (startTime, endTime, intervalMinutes = 60) => {
    const slots = [];

    // Convert times to minutes
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    // Generate slots
    for (let start = startMinutes; start < endMinutes; start += intervalMinutes) {
        const end = start + intervalMinutes;
        if (end <= endMinutes) {
            slots.push({
                startTime: formatTime(start),
                endTime: formatTime(end)
            });
        }
    }

    return slots;
};

/**
 * Filter available time slots by removing booked slots
 * @param {Array} allTimeSlots - Array of all possible time slots
 * @param {Array} bookings - Array of booked time slots
 * @returns {Array} Array of available time slots
 */
const filterAvailableTimeSlots = (allTimeSlots, bookings) => {
    // If no bookings, all slots are available
    if (!bookings.length) {
        return allTimeSlots;
    }

    return allTimeSlots.filter(slot => {
        const isSlotBooked = bookings.some(booking => {
            return validateTimeOverlap(
                slot.startTime,
                slot.endTime,
                booking.startTime,
                booking.endTime
            );
        });

        return !isSlotBooked;
    });
};

/**
 * Check if a date is in the past
 * @param {string} date - Date string (YYYY-MM-DD)
 * @returns {boolean} True if the date is in the past
 */
const isDateInPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    return checkDate < today;
};

/**
 * Calculate duration between two times in hours
 * @param {string} startTime - Start time (HH:MM)
 * @param {string} endTime - End time (HH:MM)
 * @returns {number} Duration in hours
 */
const calculateDurationHours = (startTime, endTime) => {
    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);

    return (end - start) / 60;
};

module.exports = {
    timeToMinutes,
    validateTimeOverlap,
    formatTime,
    generateTimeSlots,
    filterAvailableTimeSlots,
    isDateInPast,
    calculateDurationHours
}; 