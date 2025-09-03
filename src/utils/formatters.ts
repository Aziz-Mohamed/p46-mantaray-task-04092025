/**
 * Utility functions for formatting data
 * Following clean code principles with single responsibility
 */

export const formatDate = (
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string');
    }
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

export const formatTime = (timeString: string): string => {
  try {
    let time: Date;
    if (timeString.includes('T')) {
      time = new Date(timeString);
    } else {
      time = new Date(`2000-01-01T${timeString}`);
    }
    
    if (isNaN(time.getTime())) {
      throw new Error('Invalid time string');
    }
    
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid Time';
  }
};

export const formatPrice = (
  price: number,
  currency: string = 'USD',
  showFree: boolean = true
): string => {
  try {
    if (typeof price !== 'number' || isNaN(price)) {
      throw new Error('Invalid price value');
    }
    
    if (price === 0 && showFree) {
      return 'Free';
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  } catch (error) {
    console.error('Error formatting price:', error);
    return 'Invalid Price';
  }
};

export const formatEventDate = (dateString: string): string => {
  return formatDate(dateString, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatEventDateLong = (dateString: string): string => {
  return formatDate(dateString, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatAvailableSpots = (
  availableSpots: number,
  totalCapacity?: number
): string => {
  try {
    if (typeof availableSpots !== 'number' || isNaN(availableSpots)) {
      throw new Error('Invalid available spots value');
    }
    
    if (availableSpots <= 0) {
      return 'Sold out';
    }
    
    if (availableSpots === 1) {
      return '1 spot left';
    }
    
    if (totalCapacity && availableSpots === totalCapacity) {
      return 'All spots available';
    }
    
    return `${availableSpots} spots left`;
  } catch (error) {
    console.error('Error formatting available spots:', error);
    return 'Invalid spots';
  }
};
