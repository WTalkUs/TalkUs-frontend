import { Card, Skeleton } from "@heroui/react";

export default function PostSkeletonLoading() {
  return (
    <div className="w-full max-w-[900px] m-6 mt-0 space-y-4">
      {[1, 2, 3].map((index) => (
        <Card
          key={index}
          className="w-full bg-background-1 shadow-md rounded-lg border border-default-200 p-6"
        >
          <div className="grid md:grid-cols-5 gap-4">
            <Skeleton className="rounded-2xl col-span-1 hidden md:block">
              <div className="w-[156px] h-[156px]" />
            </Skeleton>
            <div className="col-span-4 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <Skeleton className="w-3/4 rounded-lg">
                  <div className="h-8" />
                </Skeleton>
                <Skeleton className="w-1/3 rounded-lg">
                  <div className="h-6" />
                </Skeleton>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="rounded-full">
                    <div className="w-10 h-10" />
                  </Skeleton>
                  <Skeleton className="w-24 rounded-lg">
                    <div className="h-4" />
                  </Skeleton>
                </div>
                <Skeleton className="w-24 rounded-lg">
                  <div className="h-4" />
                </Skeleton>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
