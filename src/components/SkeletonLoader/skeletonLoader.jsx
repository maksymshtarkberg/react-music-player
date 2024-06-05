import { Skeleton } from "@chakra-ui/react";

const SkeletonLoader = ({ count, height, width }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <Skeleton
          key={i}
          startColor="rgba(200, 187, 255, 0.6)"
          endColor="rgb(0 0 0 / 25%)"
          height={height}
          width={width}
          borderRadius={8}
          marginBottom={10}
        />
      ))}
    </>
  );
};

export default SkeletonLoader;
