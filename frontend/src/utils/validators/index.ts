export const minLen = min => val => val.length >= min || (min == 1 ? `Please type something` : `This must be at least ${min} characters`);
export const maxLen = max => val => val.length <= max || `You are ${val.length - max} characters over the limit`;
