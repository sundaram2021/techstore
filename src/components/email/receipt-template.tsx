
import * as React from 'react';

interface ReceiptEmailProps {
    orderId: string;
    items: {
        name: string;
        quantity: number;
        price: number;
        image?: string;
    }[];
    total: number;
    deliveryDate: string;
}

export const ReceiptEmail: React.FC<ReceiptEmailProps> = ({
    orderId,
    items,
    total,
    deliveryDate,
}) => (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px', color: '#333' }}>
        <h1 style={{ color: '#0ea5e9', textAlign: 'center' }}>Thanks for your order!</h1>
        <p style={{ textAlign: 'center', fontSize: '16px', color: '#666' }}>
            We simply love that you chose us.
        </p>

        <div style={{ margin: '30px 0', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Order Details</h2>
            <p style={{ margin: '5px 0' }}><strong>Order ID:</strong> {orderId}</p>
            <p style={{ margin: '5px 0' }}><strong>Estimated Delivery:</strong> {deliveryDate}</p>
        </div>

        <div style={{ borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '20px 0' }}>
            {items.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    {item.image && (
                        <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', marginRight: '15px' }}
                        />
                    )}
                    <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 5px', fontSize: '16px' }}>{item.name}</h3>
                        <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>Qty: {item.quantity}</p>
                    </div>
                    <div style={{ fontWeight: 'bold' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                    </div>
                </div>
            ))}
        </div>

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <p style={{ fontSize: '14px', color: '#666' }}>Total Amount</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#0ea5e9' }}>${total.toFixed(2)}</p>
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '12px', color: '#9ca3af' }}>
            <p>&copy; {new Date().getFullYear()} TechStore. All rights reserved.</p>
        </div>
    </div>
);
