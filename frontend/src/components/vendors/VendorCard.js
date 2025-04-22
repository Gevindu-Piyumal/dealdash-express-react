import Link from 'next/link';
import Image from 'next/image';
import Button from '../ui/Button';

export default function VendorCard({ vendor, onDelete }) {
  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-center mb-4">
          {vendor.logo ? (
            <div className="w-16 h-16 mr-4 relative">
              <Image 
                src={vendor.logo} 
                alt={vendor.name}
                fill
                className="object-cover rounded"
              />
            </div>
          ) : (
            <div className="w-16 h-16 mr-4 bg-gray-200 flex justify-center items-center rounded">
              <span className="text-gray-500">No logo</span>
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold">{vendor.name}</h3>
            {vendor.address && (
              <p className="text-sm text-gray-500">{vendor.address}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          {vendor.contactNumber && (
            <div>
              <span className="font-medium text-gray-700">Phone:</span> {vendor.contactNumber}
            </div>
          )}
          {vendor.email && (
            <div>
              <span className="font-medium text-gray-700">Email:</span> {vendor.email}
            </div>
          )}
          {vendor.website && (
            <div>
              <span className="font-medium text-gray-700">Website:</span> {vendor.website}
            </div>
          )}
          {vendor.openingHours && (
            <div>
              <span className="font-medium text-gray-700">Hours:</span> {vendor.openingHours}
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2">
          <Link href={`/vendors/${vendor._id}`}>
            <Button variant="secondary">View</Button>
          </Link>
          <Link href={`/vendors/edit/${vendor._id}`}>
            <Button>Edit</Button>
          </Link>
          <Button variant="danger" onClick={() => onDelete(vendor._id)}>Delete</Button>
        </div>
      </div>
    </div>
  );
}