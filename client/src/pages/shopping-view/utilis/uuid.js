// utils/uuid.js
export const generateTransactionUUID = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `order-${timestamp}-${random}`;
};
