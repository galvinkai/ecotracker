# EcoTracker Frontend Manual Testing Checklist

## General UI
- [ ] Application loads without errors
- [ ] Navigation between sections works correctly
- [ ] Light/dark mode toggle functions properly
- [ ] UI is responsive and adapts to different screen sizes
- [ ] All text is visible and legible in both light and dark modes

## Transactions Tab
- [ ] Transaction list displays correctly
- [ ] Transaction list includes both local and server-provided transactions
- [ ] "Add Transaction" button is functional
- [ ] Adding a new transaction works:
  - [ ] Form validation works correctly
  - [ ] New transaction appears in the list after submission
  - [ ] Carbon impact is calculated and displayed
- [ ] Transaction categories are correctly color-coded
- [ ] Transaction filtering/sorting works if implemented

## Carbon Footprint Chart
- [ ] Chart is displayed correctly
- [ ] Chart shows data for multiple months
- [ ] Chart includes both footprint and target lines
- [ ] Chart updates if a new transaction is added
- [ ] Chart tooltips work when hovering over data points

## Insights Panel
- [ ] Insights panel displays recommendations
- [ ] Insights are categorized correctly (high/medium/low priority)
- [ ] Messages section shows relevant messages
- [ ] UI for insights is visually appealing and readable

## Chat Assistant (if implemented)
- [ ] Chat interface loads correctly
- [ ] Sending a message works
- [ ] Responses are received and displayed properly
- [ ] Chat history is maintained during the session

## Error Handling and Offline Mode
- [ ] Error messages are displayed appropriately if API calls fail
- [ ] Offline mode functions correctly when backend is unreachable
- [ ] App provides feedback during loading states

## Performance
- [ ] App loads quickly
- [ ] Interactions are responsive
- [ ] No visible performance issues when using the application

## Cross-Browser Compatibility
- [ ] App works in Chrome
- [ ] App works in Firefox
- [ ] App works in Safari/Edge (if available)

## Mobile Experience
- [ ] App is usable on mobile devices
- [ ] Touch interactions work correctly
- [ ] Layout adjusts appropriately for small screens

## Notes:
<!-- Add any additional observations or issues here -->
