export type Membership = {
  id: string;
  name: string;
  badge?: string;
  features: string[];
  highlight?: boolean;
};

export const memberships: Membership[] = [
  {
    id: 'basico',
    name: 'Básico',
    features: [
      '1 limpieza profunda',
      '1 facial de tu elección',
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    badge: 'Más popular',
    features: [
      '2 faciales de tu elección',
      '10% de descuento',
    ],
    highlight: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    features: [
      '3 faciales de tu elección',
      '2 corporales',
      '20% de descuento',
    ],
  },
];
