import { useLocation } from 'react-router-dom'
import  { useEffect,useState } from 'react'
import DashSidebar from '../components/DashSidebar'
import DashProfile from '../components/DashProfile'
import DashPost from '../components/DashPost'
import DashUsers from '../components/DashUsers'
import DashComment from '../components/DashComment'
import DashBoardComp from '../components/DashBoardComp'
import DashAdd from '../components/DashAdd'

export default function Dashboard() {
  const location = useLocation()
  const [tab,setTab] = useState('')
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
   if (tabFromUrl){
    setTab(tabFromUrl);
   }
  },[location.search])  
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/*sidebar*/}
        <DashSidebar/>
      </div>
      {/*profile*/}
      
      {tab==='profile' && <DashProfile/>}
      {/*posts...*/}{
        tab === 'posts' && <DashPost/>
      }
      {/*users*/}{
        tab==='users' && <DashUsers/>
      }
      {/*adds*/}{
        tab==='adds' && <DashAdd/>
      }
      {/*comment*/}{
        tab=== 'comment' && <DashComment/>
      }
      {/*dashboard comp */}
      {tab==='dash' && <DashBoardComp/>}
    </div>
  )
}
