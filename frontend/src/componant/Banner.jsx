
function Banner({title, description, image}) {
  return (
    <div className='w-full relative pb-[30px]'>
      <img src={image} alt="" className='w-full h-[500px] object-cover'/>
      <div className='absolute top-[30%] w-[200px] sm:w-[300px] md:w-[500px] left-4 sm:left-[96px] text-[#292929]'>
        <h2 className='font-[Manrope] pb-6 font-semibold text-[48px] leading-[100%] text-[#292929]'>{title}</h2>
        <p className='font-[Manrope] font-normal text-[18px] leading-[100%] tracking-normal text-[#6F6F6F] w-full'>{description}</p>
      </div>
    </div>
  )
}

export default Banner
