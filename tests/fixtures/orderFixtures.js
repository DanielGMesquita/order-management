/**
 * Test Fixtures
 * Dados para testes
 */

const validOrderPayload = {
  numeroPedido: 'TEST-2024-001',
  valorTotal: 5000,
  dataCriacao: '2024-01-15T10:30:00Z',
  items: [
    {
      idItem: '2434',
      quantidadeItem: 2,
      valorItem: 2500,
    },
  ],
};

const validOrderPayload2 = {
  numeroPedido: 'TEST-2024-002',
  valorTotal: 10000,
  dataCriacao: '2024-01-16T11:45:00Z',
  items: [
    {
      idItem: '5678',
      quantidadeItem: 1,
      valorItem: 10000,
    },
  ],
};

const multipleItemsOrderPayload = {
  numeroPedido: 'TEST-2024-003',
  valorTotal: 7500,
  dataCriacao: '2024-01-17T12:00:00Z',
  items: [
    {
      idItem: '1001',
      quantidadeItem: 2,
      valorItem: 3000,
    },
    {
      idItem: '1002',
      quantidadeItem: 1,
      valorItem: 1500,
    },
  ],
};

const invalidOrderPayloads = {
  missingNumeroPedido: {
    valorTotal: 5000,
    dataCriacao: '2024-01-15T10:30:00Z',
    items: [{ idItem: '123', quantidadeItem: 1, valorItem: 5000 }],
  },
  missingValorTotal: {
    numeroPedido: 'TEST-001',
    dataCriacao: '2024-01-15T10:30:00Z',
    items: [{ idItem: '123', quantidadeItem: 1, valorItem: 5000 }],
  },
  missingDataCriacao: {
    numeroPedido: 'TEST-001',
    valorTotal: 5000,
    items: [{ idItem: '123', quantidadeItem: 1, valorItem: 5000 }],
  },
  missingItems: {
    numeroPedido: 'TEST-001',
    valorTotal: 5000,
    dataCriacao: '2024-01-15T10:30:00Z',
    items: [],
  },
  invalidDataCriacao: {
    numeroPedido: 'TEST-001',
    valorTotal: 5000,
    dataCriacao: 'invalid-date',
    items: [{ idItem: '123', quantidadeItem: 1, valorItem: 5000 }],
  },
  negativeValorTotal: {
    numeroPedido: 'TEST-001',
    valorTotal: -5000,
    dataCriacao: '2024-01-15T10:30:00Z',
    items: [{ idItem: '123', quantidadeItem: 1, valorItem: 5000 }],
  },
  negativeQuantidadeItem: {
    numeroPedido: 'TEST-001',
    valorTotal: 5000,
    dataCriacao: '2024-01-15T10:30:00Z',
    items: [{ idItem: '123', quantidadeItem: -1, valorItem: 5000 }],
  },
  negativeValorItem: {
    numeroPedido: 'TEST-001',
    valorTotal: 5000,
    dataCriacao: '2024-01-15T10:30:00Z',
    items: [{ idItem: '123', quantidadeItem: 1, valorItem: -5000 }],
  },
};

const updateOrderPayload = {
  valorTotal: 7500,
  items: [
    {
      idItem: '9999',
      quantidadeItem: 3,
      valorItem: 2500,
    },
  ],
};

const expectedOrderResponse = {
  orderId: 'TEST-2024-001',
  value: 5000,
  creationDate: '2024-01-15T10:30:00.000Z',
  items: [
    {
      productId: 2434,
      quantity: 2,
      price: 2500,
    },
  ],
};

export {
    validOrderPayload,
    validOrderPayload2,
    multipleItemsOrderPayload,
    invalidOrderPayloads,
    expectedOrderResponse,
}