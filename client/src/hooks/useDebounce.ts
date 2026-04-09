/**
 * USE DEBOUNCE HOOK
 * Purpose: Prevents high-frequency updates (e.g., search input) from spamming the API.
 * * Parameters:
 * - value: The raw input value.
 * - delay: Time in milliseconds to wait before updating the "debounced" value.
 * * Main Logic: Clears and resets a timer on every keystroke.
 */