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

export {
  mapOrderInputToDatabase,
  mapItemsInputToDatabase,
};
