/**
 * Data Mappers
 * Funções para transformar dados entre requisição e banco de dados
 */

/**
 * Mapeia dados de entrada para o formato do banco de dados
 * @param {Object} inputData - Dados recebidos da requisição
 * @returns {Object} Dados mapeados para o banco de dados
 */
const mapOrderInputToDatabase = (inputData) => {
  return {
    orderId: inputData.numeroPedido,
    value: inputData.valorTotal,
    creationDate: new Date(inputData.dataCriacao),
  };
};

/**
 * Mapeia itens de entrada para o formato do banco de dados
 * @param {Array} items - Array de itens
 * @param {String} orderId - ID do pedido
 * @returns {Array} Itens mapeados
 */
const mapItemsInputToDatabase = (items, orderId) => {
  return items.map(item => ({
    orderId: orderId,
    productId: parseInt(item.idItem, 10),
    quantity: item.quantidadeItem,
    price: item.valorItem,
  }));
};

/**
 * Mapeia dados do banco para formato de saída
 * @param {Object} orderData - Dados da ordem do banco de dados
 * @returns {Object} Dados formatados para resposta
 */
const mapOrderDatabaseToOutput = (orderData) => {
  const plainOrder = orderData.toJSON ? orderData.toJSON() : orderData;
  
  return {
    orderId: plainOrder.orderId,
    value: parseFloat(plainOrder.value),
    creationDate: plainOrder.creationDate,
    items: Array.isArray(plainOrder.items) ? mapItemsDatabaseToOutput(plainOrder.items) : [],
  };
};

/**
 * Mapeia itens do banco para formato de saída
 * @param {Array} items - Array de itens
 * @returns {Array} Itens formatados
 */
const mapItemsDatabaseToOutput = (items) => {
  return items.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
    price: parseFloat(item.price),
  }));
};

export {
  mapOrderInputToDatabase,
  mapItemsInputToDatabase,
  mapOrderDatabaseToOutput,
  mapItemsDatabaseToOutput,
};
