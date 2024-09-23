import Rating from '@/app/utils/Rating'
import { avatar } from '@material-tailwind/react'
import { Card } from '@mui/material'
import Image from 'next/image'
import React from 'react'

const ReviewCard = (props) => {
  return (
    <>                                
    <Card className="p-6 shadow-lg">
    <div className="flex items-center gap-4">
        <Image
            src={props.item.avatar}
            alt=""
            width={40}
            height={40}
            className="rounded-full border-2 border-primary"
        />
        <div>
            <h4 className="font-semibold">{props.item.name}</h4>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Rating rating={props.item.rating} />
            </div>
        </div>
    </div>
    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {props.item.comment} 
    </p>
    </Card>
      
    </>
  )
}

export default ReviewCard
