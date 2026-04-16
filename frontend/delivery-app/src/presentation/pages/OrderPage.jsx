import { useState } from "react";
import { Accordion, Badge, Table, Container, Pagination } from "react-bootstrap";

const createMockOrder = (index, status) => {
  const baseDate = new Date("2026-04-01");
  baseDate.setDate(baseDate.getDate() + index);
  const formattedDate = baseDate.toISOString().slice(0, 10);

  const itemsByStatus = {
    Delivered: [
      { sku: "SKU-101", name: "Forklift Battery", quantity: 1, price: 89.95 },
      { sku: "SKU-202", name: "Shipping Crate", quantity: 2, price: 24.0 },
      { sku: "SKU-310", name: "Safety Helmet", quantity: 3, price: 15.0 },
    ],
    "In Transit": [
      { sku: "SKU-155", name: "Pallet Jack", quantity: 1, price: 59.5 },
      { sku: "SKU-220", name: "Protective Gloves", quantity: 4, price: 10.0 },
      { sku: "SKU-720", name: "Pallet Wrap", quantity: 8, price: 7.75 },
    ],
    Processing: [
      { sku: "SKU-330", name: "Inventory Scanner", quantity: 1, price: 149.99 },
      { sku: "SKU-402", name: "Label Printer", quantity: 1, price: 96.76 },
      { sku: "SKU-940", name: "First Aid Kit", quantity: 1, price: 69.35 },
    ],
  };

  const items = itemsByStatus[status].map((item, itemIndex) => ({
    ...item,
    sku: `${item.sku}-${index + 1}`,
    quantity: item.quantity + (itemIndex % 2),
  }));

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return {
    orderId: `ORD-${1000 + index}`,
    date: formattedDate,
    status,
    total: Number(total.toFixed(2)),
    items,
  };
};

const mockOrders = [
  ...Array.from({ length: 25 }, (_, index) => createMockOrder(index + 1, "Delivered")),
  ...Array.from({ length: 25 }, (_, index) => createMockOrder(index + 1 + 25, "In Transit")),
  ...Array.from({ length: 25 }, (_, index) => createMockOrder(index + 1 + 50, "Processing")),
];

const statusVariant = (status) => {
  switch (status) {
    case "Delivered":
      return "success";
    case "In Transit":
      return "warning";
    case "Processing":
      return "info";
    default:
      return "secondary";
  }
};

const AccordionOrderWrapper = ({ orders, activeKey, onSelect }) => {
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(orders.length / pageSize));
  const visibleOrders = orders.slice(page * pageSize, page * pageSize + pageSize);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pageCount) {
      setPage(newPage);
    }
  };

  return (
    <>
      <Accordion activeKey={activeKey} onSelect={onSelect}>
        {visibleOrders.map((order, index) => (
          <Accordion.Item eventKey={`${index}`} key={order.orderId}>
            <Accordion.Header>
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start w-100">
                <div>
                  <strong>{order.orderId}</strong>
                  <div className="text-muted">{order.date}</div>
                </div>
                <div className="text-sm-end mt-2 mt-sm-0">
                  <Badge bg={statusVariant(order.status)} className="me-2">
                    {order.status}
                  </Badge>
                  <div className="fw-semibold">${order.total.toFixed(2)}</div>
                </div>
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <Table responsive bordered hover className="mb-0">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Item</th>
                    <th className="text-end">Qty</th>
                    <th className="text-end">Price</th>
                    <th className="text-end">Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.sku}>
                      <td>{item.sku}</td>
                      <td>{item.name}</td>
                      <td className="text-end">{item.quantity}</td>
                      <td className="text-end">${item.price.toFixed(2)}</td>
                      <td className="text-end">
                        ${(item.quantity * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      {pageCount > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <Pagination>
            <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 0} />
            {Array.from({ length: pageCount }, (_, index) => (
              <Pagination.Item
                key={index}
                active={index === page}
                onClick={() => handlePageChange(index)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === pageCount - 1} />
          </Pagination>
        </div>
      )}
    </>
  );
};

const OrderPage = () => {
  const [activeKey, setActiveKey] = useState("0");
  const [activeKey1, setActiveKey1] = useState("0");
  const [activeKey2, setActiveKey2] = useState("0");
  const [activeKey3, setActiveKey3] = useState("0");

  const activeKeySelectHandler = (key) => {
    setActiveKey(key);
  };

  return (
    <Container className="mt-5">
      <Accordion activeKey={activeKey} onSelect={activeKeySelectHandler}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <h1>Order Processing</h1>
          </Accordion.Header>
          <Accordion.Body>
            <AccordionOrderWrapper
              orders={mockOrders.filter((item) => item.status === 'Delivered')}
              activeKey={activeKey1}
              onSelect={(key) => setActiveKey1(key)}
            />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <h1>Order In Transit</h1>
          </Accordion.Header>
          <Accordion.Body>
            <AccordionOrderWrapper
              orders={mockOrders.filter((item) => item.status === 'In Transit')}
              activeKey={activeKey2}
              onSelect={(key) => setActiveKey2(key)}
            />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>
            <h1>Order History</h1>
          </Accordion.Header>
          <Accordion.Body>
            <AccordionOrderWrapper
              orders={mockOrders.filter((item) => item.status === 'Processing')}
              activeKey={activeKey3}
              onSelect={(key) => setActiveKey3(key)}
            />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default OrderPage;
