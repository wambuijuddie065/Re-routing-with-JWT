import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import {Data} from '../Interfaces/interfaces'
import { NextFunction, Request, Response } from 'express'
import { info } from 'console'
dotenv.config()

interface Extended extends Request{
    info?:Data
}

 export const VerifyToken=(req:Extended,res:Response,next:NextFunction)=>{
   try {
    const token=req.headers['token'] as string
    if (!token) {
        
        res.json({message:'You are not authorised to access this route'})
    }
    const data=jwt.verify(token,process.env.KEY as string) as Data
    req.info=data
    
   } catch (error:any) {
    res.json({error})
    
   }
   next()
}