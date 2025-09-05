/**
 * Development Helpers for EcoTracker
 * 
 * These functions can be used from the browser console for development and testing.
 */

// Reset all randomized data to generate new values
window.resetEcoTrackerData = function() {
  localStorage.removeItem('ecotracker_mock_transactions');
  localStorage.removeItem('ecotracker_chart_data');
  localStorage.removeItem('ecotracker_insights');
  
  // Keep offline transactions if needed
  const keepOfflineTransactions = confirm('Keep existing offline transactions?');
  if (!keepOfflineTransactions) {
    localStorage.removeItem('ecotracker_offline_transactions');
  }
  
  alert('EcoTracker data has been reset. Refresh the page to see new randomized data.');
};

// Reset only specific data type
window.resetEcoTrackerMockTransactions = function() {
  localStorage.removeItem('ecotracker_mock_transactions');
  alert('Mock transactions have been reset. Refresh the page to see new randomized transactions.');
};

window.resetEcoTrackerChartData = function() {
  localStorage.removeItem('ecotracker_chart_data');
  alert('Chart data has been reset. Refresh the page to see new randomized chart.');
};

window.resetEcoTrackerInsights = function() {
  localStorage.removeItem('ecotracker_insights');
  alert('Insights have been reset. Refresh the page to see new randomized insights.');
};

console.log('EcoTracker Development Helpers loaded. Use resetEcoTrackerData() to reset all randomized data.');
