import Link from 'next/link';
import Image from 'next/image';
import Button from '../ui/Button';

export default function DealCard({ deal, onDelete }) {
  // Format dates in a readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Determine if the deal is expired
  const isExpired = new Date(deal.expireDate) < new Date();
  
  // Get status badge class
  const getStatusBadgeClass = () => {
    if (!deal.isActive) return "bg-gray-200 text-gray-800";
    if (isExpired) return "bg-red-100 text-red-800";
    if (deal.isFeatured) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };
  
  // Get status text
  const getStatusText = () => {
    if (!deal.isActive) return "Inactive";
    if (isExpired) return "Expired";
    if (deal.isFeatured) return "Featured";
    return "Active";
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {deal.banner && (
        <div className="h-48 w-full relative">
          <Image 
            src={deal.banner} 
            alt={deal.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{deal.title}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass()}`}>
            {getStatusText()}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{deal.description}</p>
        
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-500">
          <div>
            <span className="font-medium">Start:</span> {formatDate(deal.startDate)}
          </div>
          <div>
            <span className="font-medium">Expires:</span> {formatDate(deal.expireDate)}
          </div>
          
          {deal.vendor && (
            <div className="flex items-center col-span-2">
              <span className="font-medium mr-1">Vendor:</span>
              {deal.vendor.logo ? (
                <div className="w-4 h-4 mr-1 relative">
                  <Image
                    src={deal.vendor.logo}
                    alt={deal.vendor.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
              ) : null}
              <span>{deal.vendor.name}</span>
            </div>
          )}
          
          {deal.category && (
            <div className="flex items-center col-span-2">
              <span className="font-medium mr-1">Category:</span>
              {deal.category.icon ? (
                <div className="w-4 h-4 mr-1 relative">
                  <Image
                    src={deal.category.icon}
                    alt={deal.category.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
              ) : null}
              <span>{deal.category.name}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2">
          <Link href={`/deals/${deal._id}`}>
            <Button variant="secondary">View</Button>
          </Link>
          <Link href={`/deals/edit/${deal._id}`}>
            <Button>Edit</Button>
          </Link>
          <Button variant="danger" onClick={() => onDelete(deal._id)}>Delete</Button>
        </div>
      </div>
    </div>
  );
}