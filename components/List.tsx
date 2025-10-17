import { DemoItem } from "@/interfaces/Demo.interface";
import { useState, useEffect, useRef } from "react";

interface ListProps {
    items: DemoItem[];
    renderMode?: 'SSR' | 'CSR' | 'SSG' | 'ISR';
}

const List = ({ items, renderMode = 'CSR' }: ListProps) => {
    const [renderTime, setRenderTime] = useState<number>(0);
    const [imageLoadCount, setImageLoadCount] = useState<number>(0);
    const [isClient, setIsClient] = useState(false);
    const renderStartTime = useRef<number>(0);

    useEffect(() => {
        setIsClient(true);
        renderStartTime.current = performance.now();
    }, []);

    useEffect(() => {
        if (isClient && items.length > 0) {
            const endTime = performance.now();
            setRenderTime(endTime - renderStartTime.current);
        }
    }, [isClient, items]);

    const handleImageLoad = () => {
        setImageLoadCount(prev => prev + 1);
    };

    const handleImageError = (e: any) => {
        e.target.src = `https://placehold.co/400x300?text=Image+Not+Found`;
    };

    return (
        <div className="min-h-screen bg-base-200">
            <div className="container mx-auto px-4 lg:px-8 pb-10">
                <div className="stats shadow mb-8 w-full">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>                        
                        <div className="stat-title">Render Mode</div>
                        <div className="stat-value text-2xl">{renderMode}</div>
                        <div className="stat-desc">
                            {renderMode === 'SSR' ? 'Server Side Rendering' : 
                             renderMode === 'CSR' ? 'Client Side Rendering' :
                             renderMode === 'SSG' ? 'Static Site Generation' : 
                             'Incremental Static Regeneration'}
                        </div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>                        
                        <div className="stat-title">Render Time</div>
                        <div className="stat-value text-2xl">{renderTime.toFixed(2)}ms</div>
                        <div className="stat-desc">Component render duration</div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-accent">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                        </div>                        
                        <div className="stat-title">Images Loaded</div>
                        <div className="stat-value text-2xl">{imageLoadCount}/{items.length}</div>
                        <div className="stat-desc">Loaded images count</div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-info">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                        </div>                        
                        <div className="stat-title">Total Items</div>
                        <div className="stat-value text-2xl">{items.length}</div>
                        <div className="stat-desc">Test data volume</div>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-base-content">
                        Product Listings
                    </h2>
                    <div className="badge badge-lg badge-outline">
                        {renderMode} Mode
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {items.map((item, index) => (
                        <div 
                            key={item.id} 
                            className="card w-full bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-200"
                            data-testid={`product-card-${item.id}`}
                        >
                            <figure className="relative">
                                <img 
                                    src={`https://picsum.photos/id/${item.id}/400/300`} 
                                    alt={`Product ${item.id}`}
                                    className="w-full h-48 object-cover"
                                    loading={index < 8 ? "eager" : "lazy"}
                                    onLoad={handleImageLoad}
                                    onError={handleImageError}
                                /> 
                            </figure>
                            <div className="card-body p-4">
                                <h3 className="card-title text-base font-semibold line-clamp-2" title={item.name}>
                                    {item.name}
                                </h3>
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-lg font-bold text-error">${item.price}</p>
                                    <div className="text-xs text-base-content/60">ID: {item.id}</div>
                                </div>
                                <div className="card-actions justify-end mt-3">                                    <button 
                                    className="btn btn-primary btn-sm w-full"
                                    onClick={() => {
                                        console.log(`Clicked product ${item.id} at ${performance.now()}ms`);
                                    }}
                                >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div> 
                
            </div>
        </div>
    );
};
export default List;