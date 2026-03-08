import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton = () => (
  <div className="min-h-screen bg-background">
    {/* Hero skeleton */}
    <div className="relative">
      <Skeleton className="w-full h-[320px]" />
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="flex items-end gap-6">
          <Skeleton className="w-28 h-28 rounded-full shrink-0" />
          <div className="flex-1 space-y-3 pb-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 max-w-full" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
    </div>

    {/* Section skeletons */}
    <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((j) => (
              <Skeleton key={j} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ProfileSkeleton;
