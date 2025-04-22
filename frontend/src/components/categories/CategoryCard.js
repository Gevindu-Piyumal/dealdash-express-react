import Link from 'next/link';
import Image from 'next/image';
import Button from '../ui/Button';

export default function CategoryCard({ category, onDelete }) {
  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-center mb-4">
          {category.icon ? (
            <div className="w-12 h-12 mr-4 relative">
              <Image 
                src={category.icon} 
                alt={category.name}
                fill
                className="object-cover rounded"
              />
            </div>
          ) : (
            <div className="w-12 h-12 mr-4 bg-gray-200 flex justify-center items-center rounded">
              <span className="text-gray-500">No icon</span>
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold">{category.name}</h3>
            {category.dealCount !== undefined && (
              <p className="text-sm text-gray-500">{category.dealCount} active deals</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Link href={`/categories/${category._id}`}>
            <Button variant="secondary">View</Button>
          </Link>
          <Link href={`/categories/edit/${category._id}`}>
            <Button>Edit</Button>
          </Link>
          <Button variant="danger" onClick={() => onDelete(category._id)}>Delete</Button>
        </div>
      </div>
    </div>
  );
}