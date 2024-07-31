import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

const PostersUI = ({ posters }: { posters: number }) => {
  return (
    <div className="mt-10 lg:mt-20">
      <h1 className="text-white text-xl lg:text-3xl font-semibold text-center mb-5">
        Hot New
      </h1>

      <div className="hidden sm:flex justify-center items-center space-x-4">
        {Array.from({ length: posters }).map((_, i) => (
          <SkeletonTheme
            key={i}
            baseColor="#202020"
            highlightColor="#444"
            borderRadius={15}
          >
            <div
              className={`relative w-52 h-96 overflow-hidden rounded-2xl
                transform transition-transform duration-500 hover:rotate-y-180 group`}
            >
              <Skeleton height={400} />
            </div>
          </SkeletonTheme>
        ))}
      </div>

      <div className="sm:hidden flex justify-center items-center space-x-4">
        <SkeletonTheme
          baseColor="#202020"
          highlightColor="#444"
          borderRadius={15}
        >
          <div
            className={`relative w-52 h-96 overflow-hidden rounded-2xl
                transform transition-transform duration-500 hover:rotate-y-180 group`}
          >
            <Skeleton height={400} />
          </div>
        </SkeletonTheme>
      </div>
    </div>
  )
}

export default PostersUI
