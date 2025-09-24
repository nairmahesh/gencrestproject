import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const distributors = [
  { id: '1325', name: 'SRI RAMA SEEDS AND PESTICIDES' },
  { id: '1326', name: 'National Fertilizers' },
  { id: '1327', name: 'Kisan Agri Store' },
];

const DistributorListPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Liquidation</h1>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Select Distributor to Visit</h2>
        <div className="rounded-lg border bg-background">
          <ul className="divide-y divide-border">
            {distributors.map((distributor) => (
              <li key={distributor.id}>
                <Link
                  to={`/liquidation/distributor/${distributor.id}`}
                  className="flex items-center justify-between p-4 hover:bg-secondary"
                >
                  <span>{distributor.name}</span>
                  <ChevronRight className="h-5 w-5 text-secondary-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DistributorListPage;