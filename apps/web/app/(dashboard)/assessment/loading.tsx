export default function AssessmentLoading() {
    return (
        <div className="max-w-[800px] mx-auto px-6 py-12 md:py-24">
            <header className="mb-12 md:mb-16 space-y-4">
                <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-3/4 max-w-2xl bg-gray-100 rounded animate-pulse" />
            </header>

            <div className="grid grid-cols-1 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-8 bg-white border border-gray-100 rounded-[16px] shadow-sm flex flex-col md:flex-row justify-between gap-6 animate-pulse">
                        <div className="space-y-4 flex-1">
                            <div className="h-8 w-64 bg-gray-200 rounded" />
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-gray-100 rounded" />
                                <div className="h-4 w-5/6 bg-gray-100 rounded" />
                            </div>
                        </div>
                        <div className="flex gap-8 pt-4 md:pt-0 border-t border-gray-50 md:border-none">
                            <div className="space-y-2">
                                <div className="h-5 w-8 bg-gray-200 rounded" />
                                <div className="h-3 w-16 bg-gray-100 rounded" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-5 w-8 bg-gray-200 rounded" />
                                <div className="h-3 w-16 bg-gray-100 rounded" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
