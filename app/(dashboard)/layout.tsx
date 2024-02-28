import Navbar from "@/components/navbar"
import SideBar from "@/components/sidebar"
import { apiLimitCount } from "@/lib/api-limit"
import { checkSubscription } from "@/lib/subscription"


const DashboardLayout = async ({children}:{children:React.ReactNode}) => {
  const getApiLimitCount = await apiLimitCount()
  const isPro = await checkSubscription()
  return (
    <div className="h-full relative">
        <div className="h-full  hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0  bg-gray-900 ">
              <SideBar isPro={isPro} apiLimitCount ={getApiLimitCount}/>
        </div>
        <main className="md:pl-72  "><Navbar/>{children}</main>
    </div>
  )
}

export default DashboardLayout