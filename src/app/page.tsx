import BannerProfile from '../app/components/BannerProfile';
import AddContent from '../app/components/AddContent';
import PostContent from '../app/components/PostContent';


export async function HomePage() {

  

  return (
    <>
      <div className="min-h-screen bg-white flex justify-center py-10 lg:w-1/2 :w-full">
        <div className="flex flex-wrap md:flex-nowrap grid-cols-1 lg:grid-cols-3 lg:gap-8 w-full max-w-7xl">
          <div className="lg:col-span-1 post p-5 lg:p-1 rounded-md mt-10">
            <div className="lg:fixed lg:left-14 lg:w-3/12 md:fixed md:w-5/12">
              <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mb-4">
                <BannerProfile />
              </div>
              
            </div>
          </div>
          <div className="lg:col-span-2 mt-10 w-full" id="posted">
            <div className="bg-white p-8 rounded-lg shadow-md w-full mb-10">
                <AddContent />
            </div>
            <div className="grid grid-cols-1 gap-4 w-full">
              <PostContent />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;