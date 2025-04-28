
/**
 * Generates a random room ID for collaboration sessions
 * @returns A string room ID
 */
export function generateRoomId(): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const length = 8;
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
}
