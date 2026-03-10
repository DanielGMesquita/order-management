/**
 * Unit Tests - Mappers
 * Testa transformações de dados
 */

import { mapOrderInputToDatabase, mapItemsInputToDatabase, mapOrderDatabaseToOutput, mapItemsDatabaseToOutput } from '../../src/utils/mappers.js';

import { validOrderPayload, expectedOrderResponse } from '../fixtures/OrderFixtures.js';

describe('Data Mappers - Unit Tests', () => {
  describe('mapOrderInputToDatabase', () => {
    test('deve mapear dados de entrada para formato do banco', () => {
      const result = mapOrderInputToDatabase(validOrderPayload);

      expect(result).toHaveProperty('orderId', validOrderPayload.numeroPedido);
      expect(result).toHaveProperty('value', validOrderPayload.valorTotal);
      expect(result).toHaveProperty('creationDate');
      expect(result.creationDate).toBeInstanceOf(Date);
    });

    test('deve converter data corretamente', () => {
      const dateString = '2024-01-15T10:30:00Z';
      const result = mapOrderInputToDatabase({
        ...validOrderPayload,
        dataCriacao: dateString,
      });

      const expectedDate = new Date(dateString);
      expect(result.creationDate).toEqual(expectedDate);
    });

    test('deve preservar valor total', () => {
      const testValue = 12345.67;
      const result = mapOrderInputToDatabase({
        ...validOrderPayload,
        valorTotal: testValue,
      });

      expect(result.value).toBe(testValue);
    });
  });

  describe('mapItemsInputToDatabase', () => {
    test('deve mapear array de itens para formato do banco', () => {
      const items = validOrderPayload.items;
      const result = mapItemsInputToDatabase(items, 'TEST-001');

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
    });

    test('deve converter idItem para productId como número', () => {
      const items = [{ idItem: '2434', quantidadeItem: 2, valorItem: 1000 }];
      const result = mapItemsInputToDatabase(items, 'TEST-001');

      expect(result[0].productId).toBe(2434);
      expect(typeof result[0].productId).toBe('number');
    });

    test('deve mapear múltiplos itens corretamente', () => {
      const items = [
        { idItem: '100', quantidadeItem: 2, valorItem: 500 },
        { idItem: '200', quantidadeItem: 3, valorItem: 300 },
      ];
      const result = mapItemsInputToDatabase(items, 'TEST-001');

      expect(result).toHaveLength(2);
      expect(result[0].productId).toBe(100);
      expect(result[1].productId).toBe(200);
      expect(result[0].quantity).toBe(2);
      expect(result[1].quantity).toBe(3);
    });

    test('deve incluir orderId em cada item', () => {
      const items = validOrderPayload.items;
      const orderId = 'TEST-123';
      const result = mapItemsInputToDatabase(items, orderId);

      result.forEach(item => {
        expect(item.orderId).toBe(orderId);
      });
    });

    test('deve mapear preço corretamente', () => {
      const items = [{ idItem: '123', quantidadeItem: 1, valorItem: 999.99 }];
      const result = mapItemsInputToDatabase(items, 'TEST-001');

      expect(result[0].price).toBe(999.99);
    });
  });

  describe('mapOrderDatabaseToOutput', () => {
    test('deve mapear dados do banco para formato de saída', () => {
      const databaseData = {
        orderId: 'TEST-001',
        value: '5000.00',
        creationDate: new Date('2024-01-15T10:30:00Z'),
        items: [
          {
            productId: 2434,
            quantity: 2,
            price: '2500.00',
          },
        ],
        toJSON: function () {
          return {
            orderId: this.orderId,
            value: this.value,
            creationDate: this.creationDate,
            items: this.items,
          };
        },
      };

      const result = mapOrderDatabaseToOutput(databaseData);

      expect(result).toHaveProperty('orderId', 'TEST-001');
      expect(result).toHaveProperty('value', 5000);
      expect(result).toHaveProperty('creationDate');
      expect(result).toHaveProperty('items');
    });

    test('deve converter value para número', () => {
      const databaseData = {
        orderId: 'TEST-001',
        value: '5000.00',
        creationDate: new Date(),
        items: [],
        toJSON: function () {
          return {
            orderId: this.orderId,
            value: this.value,
            creationDate: this.creationDate,
            items: this.items,
          };
        },
      };

      const result = mapOrderDatabaseToOutput(databaseData);

      expect(typeof result.value).toBe('number');
      expect(result.value).toBe(5000);
    });

    test('deve retornar array vazio se items não existirem', () => {
      const databaseData = {
        orderId: 'TEST-001',
        value: '5000.00',
        creationDate: new Date(),
        items: null,
        toJSON: function () {
          return {
            orderId: this.orderId,
            value: this.value,
            creationDate: this.creationDate,
            items: this.items,
          };
        },
      };

      const result = mapOrderDatabaseToOutput(databaseData);

      expect(result.items).toEqual([]);
    });
  });

  describe('mapItemsDatabaseToOutput', () => {
    test('deve mapear itens do banco para saída', () => {
      const databaseItems = [
        { productId: 2434, quantity: 2, price: '2500.00' },
      ];

      const result = mapItemsDatabaseToOutput(databaseItems);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('productId', 2434);
      expect(result[0]).toHaveProperty('quantity', 2);
      expect(result[0]).toHaveProperty('price', 2500);
    });

    test('deve converter price para número', () => {
      const databaseItems = [
        { productId: 100, quantity: 1, price: '999.99' },
      ];

      const result = mapItemsDatabaseToOutput(databaseItems);

      expect(typeof result[0].price).toBe('number');
      expect(result[0].price).toBe(999.99);
    });

    test('deve mapear múltiplos itens', () => {
      const databaseItems = [
        { productId: 100, quantity: 2, price: '500.00' },
        { productId: 200, quantity: 3, price: '300.00' },
      ];

      const result = mapItemsDatabaseToOutput(databaseItems);

      expect(result).toHaveLength(2);
      expect(result[0].productId).toBe(100);
      expect(result[1].productId).toBe(200);
    });
  });
});
