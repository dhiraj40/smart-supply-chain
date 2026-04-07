import { createProcessCheckout } from './ProcessCheckout'

describe('createProcessCheckout', () => {
  test('creates the order only after payment confirmation', async () => {
    const createOrderDraft = jest.fn().mockReturnValue({
      createdAt: '2026-04-03T00:00:00.000Z',
      totalAmount: 89.99,
      items: [{ itemId: 'PROD-101', quantity: 1, unitPrice: 89.99 }],
    })
    const paymentRepository = {
      start: jest.fn().mockResolvedValue({
        paymentId: 'PAY-1',
        status: 'pending',
        message: 'Starting payment...',
      }),
      getStatus: jest
        .fn()
        .mockResolvedValueOnce({
          paymentId: 'PAY-1',
          status: 'pending',
          message: 'Checking payment status...',
        })
        .mockResolvedValueOnce({
          paymentId: 'PAY-1',
          status: 'successful',
          message: 'Payment confirmed.',
        }),
    }
    const orderRepository = {
      create: jest.fn().mockResolvedValue({
        orderId: 'ORD-1',
        status: 'created',
      }),
    }
    const processCheckout = createProcessCheckout({
      createOrderDraft,
      paymentRepository,
      orderRepository,
      pollIntervalMs: 0,
      maxPollAttempts: 3,
    })
    const paymentStatuses = []

    const result = await processCheckout(
      [{ item: { id: 'PROD-101', name: 'Scanner', unitPrice: 89.99 }, quantity: 1 }],
      {
        onPaymentStatus(payment) {
          paymentStatuses.push(payment.status)
        },
      }
    )

    expect(createOrderDraft).toHaveBeenCalledTimes(1)
    expect(orderRepository.create).toHaveBeenCalledWith(
      createOrderDraft.mock.results[0].value
    )
    expect(paymentStatuses).toEqual(['pending', 'pending', 'successful'])
    expect(result).toEqual({
      order: {
        orderId: 'ORD-1',
        status: 'created',
      },
      payment: {
        paymentId: 'PAY-1',
        status: 'successful',
        message: 'Payment confirmed.',
      },
    })
  })

  test('fails checkout when payment never reaches a terminal status', async () => {
    const processCheckout = createProcessCheckout({
      createOrderDraft: () => ({
        createdAt: '2026-04-03T00:00:00.000Z',
        totalAmount: 89.99,
        items: [{ itemId: 'PROD-101', quantity: 1, unitPrice: 89.99 }],
      }),
      paymentRepository: {
        start: jest.fn().mockResolvedValue({
          paymentId: 'PAY-2',
          status: 'pending',
          message: 'Starting payment...',
        }),
        getStatus: jest.fn().mockResolvedValue({
          paymentId: 'PAY-2',
          status: 'pending',
          message: 'Checking payment status...',
        }),
      },
      orderRepository: {
        create: jest.fn(),
      },
      pollIntervalMs: 0,
      maxPollAttempts: 2,
    })

    await expect(
      processCheckout([
        { item: { id: 'PROD-101', name: 'Scanner', unitPrice: 89.99 }, quantity: 1 },
      ])
    ).rejects.toThrow('Payment confirmation timed out. Please try again.')
  })
})
