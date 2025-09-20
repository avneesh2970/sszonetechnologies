import React, { useEffect } from 'react'
import CartItems from '../componant/CartItems'
import all_course from '../assets/Course_Data'
import Card from '../componant/Card'

function Cart() {
  
  const topThree = all_course.slice(0, 3);
  useEffect(()=>{
    scrollTo(0 , 0 )
  },[])

  return (
    <div className='w-full font-[Manrope] max-w-screen-2xl mx-auto'>
        <div className='px-4 md:px-24 py-[30px] '>
            <h1 className='font-semibold text-[48px] leading-[100%] tracking-normal pb-6'>Shopping Cart</h1>
          <CartItems/>
        </div>
        <div className='py-[30px] px-4 sm:px-10 md:px-24 font-[Manrope] flex flex-col items-center'>
          <p className='font-bold text-[18px] leading-[100%] tracking-normal text-[#1C4ED9] pb-2 text-center uppercase'>Explore Recommended Courses</p>
          <h1 className='font-semibold md:text-4xl text-2xl leading-[100%] tracking-normal text-[#292929] pb-2 text-center'>You Might Also Like</h1>
          <p className=' text-sm md:text-xl leading-[100%] max-w-[70%] tracking-normal text-[#6F6F6F] pb-10 text-center'>Discover personalized course recommendations curated to match your interests and learning goals.</p>
        </div>
        <div className=''>
          <Card all_course={topThree}/>
        </div>
    </div>
  )
}

export default Cart
